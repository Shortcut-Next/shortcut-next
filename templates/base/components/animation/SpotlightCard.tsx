'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

/**
 * SpotlightCard
 *
 * A container card where a radial spotlight gradient follows the user's cursor
 * within its bounds. This creates the popular "interactive glow" effect seen
 * on sites like Linear, Vercel, and Tailwind UI.
 *
 * The spotlight is rendered as a separate absolutely-positioned layer so it
 * never interferes with the card's children layout. Children are elevated above
 * the spotlight layer via `z-index: 1`.
 *
 * Uses `useTheme()` to derive a sensible default spotlight color from the
 * active MUI palette. Pass a custom `spotlightColor` to override — any valid
 * CSS color string works (hex, rgba, hsl, etc.).
 *
 * Respects `prefers-reduced-motion` — the spotlight is completely disabled for
 * users who prefer reduced motion, and the card renders as a plain wrapper.
 *
 * @example
 * // Basic usage — spotlight inherits primary color from MUI theme
 * <SpotlightCard style={{ borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
 *   <h3>Feature Title</h3>
 *   <p>Feature description goes here.</p>
 * </SpotlightCard>
 *
 * @example
 * // Custom amber spotlight on a dark card
 * <SpotlightCard
 *   spotlightColor="rgba(251, 191, 36, 0.15)"
 *   spotlightSize={400}
 *   style={{ background: '#111', borderRadius: 12, padding: 24, color: '#fff' }}
 * >
 *   <PricingTier />
 * </SpotlightCard>
 *
 * @example
 * // Tight spotlight for a small icon card
 * <SpotlightCard
 *   spotlightSize={150}
 *   style={{ width: 120, height: 120, borderRadius: 16, display: 'grid', placeItems: 'center' }}
 * >
 *   <Icon fontSize="large" />
 * </SpotlightCard>
 */

export interface SpotlightCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  /**
   * CSS color for the spotlight gradient.
   * Defaults to `alpha(theme.palette.primary.main, 0.12)` from the active MUI theme.
   */
  spotlightColor?: string
  /** Diameter of the spotlight circle in pixels. @default 300 */
  spotlightSize?: number
  children: React.ReactNode
}

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ spotlightColor, spotlightSize = 300, children, style, ...rest }, ref) => {
    const theme = useTheme()

    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    // Resolve the spotlight color — prop takes precedence over theme default.
    const resolvedColor =
      spotlightColor ?? alpha(theme.palette.primary.main, 0.12)

    // Start off-screen so there's no glitch on initial render.
    const spotX = useMotionValue(-9999)
    const spotY = useMotionValue(-9999)

    const backgroundStyle = useMotionTemplate`radial-gradient(circle ${spotlightSize}px at ${spotX}px ${spotY}px, ${resolvedColor}, transparent)`

    // We need a ref on the container to compute relative mouse position.
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      spotX.set(e.clientX - rect.left)
      spotY.set(e.clientY - rect.top)
    }

    const handleMouseLeave = () => {
      spotX.set(-9999)
      spotY.set(-9999)
    }

    if (prefersReducedMotion) {
      return (
        <motion.div ref={ref} style={style} {...rest}>
          {children}
        </motion.div>
      )
    }

    return (
      <motion.div
        // Merge the internal ref for mouse tracking with the forwarded ref.
        ref={(node) => {
          // Update internal ref
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node
          // Forward the ref to the consumer
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative', overflow: 'hidden', ...style }}
        {...rest}
      >
        {/* Spotlight layer — sits below children */}
        <motion.div
          style={{
            background: backgroundStyle,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
          aria-hidden
        />

        {/* Children rendered above the spotlight */}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </motion.div>
    )
  }
)

SpotlightCard.displayName = 'SpotlightCard'

export default SpotlightCard
