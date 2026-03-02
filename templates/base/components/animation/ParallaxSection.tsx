'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * ParallaxSection
 *
 * Wraps content and applies a scroll-linked parallax translation so the inner
 * content moves at a different speed than the page, creating a depth illusion.
 * The effect is driven entirely by Framer Motion's `useScroll` +
 * `useTransform` — no JavaScript scroll listeners, no jank.
 *
 * The `speed` prop controls intensity and direction:
 *  - `0`   → no parallax (same as plain div)
 *  - `0.3` → content scrolls slightly slower than the page (subtle depth)
 *  - `1`   → content travels 50 % of its own height relative to the viewport
 *  - `-0.3`→ counter-scroll (content moves opposite to scroll direction)
 *
 * Respects `prefers-reduced-motion` — if the user has opted out of motion the
 * component renders children without any transform applied.
 *
 * @example
 * // Subtle vertical parallax on a hero background image
 * <ParallaxSection speed={0.4} style={{ height: 500 }}>
 *   <img src="/hero.jpg" alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 * </ParallaxSection>
 *
 * @example
 * // Counter-scroll effect — content floats upward as user scrolls down
 * <ParallaxSection speed={-0.2}>
 *   <FloatingBadge />
 * </ParallaxSection>
 *
 * @example
 * // Horizontal parallax for a decorative side element
 * <ParallaxSection direction="horizontal" speed={0.3}>
 *   <DecorativeSvg />
 * </ParallaxSection>
 */

export interface ParallaxSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Parallax intensity.
   * `0` = no effect, positive = same-direction scroll, negative = counter-scroll.
   * @default 0.3
   */
  speed?: number
  /** Axis on which the parallax effect is applied. @default 'vertical' */
  direction?: 'vertical' | 'horizontal'
  children: React.ReactNode
}

const ParallaxSection = React.forwardRef<HTMLDivElement, ParallaxSectionProps>(
  ({ speed = 0.3, direction = 'vertical', children, style, ...rest }, _ref) => {
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    // We need an internal ref for scroll tracking; expose the forwarded ref via
    // a callback ref on the outer div if needed.
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress, scrollXProgress } = useScroll({
      target: containerRef,
      offset: ['start end', 'end start'],
    })

    const yTransform = useTransform(
      scrollYProgress,
      [0, 1],
      [`${-speed * 50}%`, `${speed * 50}%`]
    )

    const xTransform = useTransform(
      scrollXProgress,
      [0, 1],
      [`${-speed * 50}%`, `${speed * 50}%`]
    )

    if (prefersReducedMotion) {
      return (
        <div ref={containerRef} style={{ overflow: 'hidden', ...style }} {...rest}>
          {children}
        </div>
      )
    }

    const motionStyle =
      direction === 'horizontal' ? { x: xTransform } : { y: yTransform }

    return (
      <div
        ref={containerRef}
        style={{ overflow: 'hidden', ...style }}
        {...rest}
      >
        <motion.div style={motionStyle}>{children}</motion.div>
      </div>
    )
  }
)

ParallaxSection.displayName = 'ParallaxSection'

export default ParallaxSection
