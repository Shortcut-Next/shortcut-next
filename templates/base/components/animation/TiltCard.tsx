'use client'

import React, { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'

/**
 * TiltCard
 *
 * A wrapper that applies a 3D perspective tilt effect driven by the cursor
 * position within the card. Spring physics smooth out the rotation so it
 * feels physical and natural. An optional radial-gradient "glare" highlight
 * can be layered on top to reinforce the 3D illusion.
 *
 * The component forwards all standard Framer Motion `div` props so you can
 * attach `className`, `style`, layout animations, etc. as needed.
 *
 * Respects `prefers-reduced-motion` — when the user has opted out of motion
 * the card renders as a plain wrapper with no rotation or scale applied.
 *
 * @example
 * // Simple tilt card with default settings
 * <TiltCard style={{ borderRadius: 16, padding: 24, background: '#fff' }}>
 *   <h2>Hello</h2>
 *   <p>Hover me to tilt!</p>
 * </TiltCard>
 *
 * @example
 * // Aggressive tilt with glare highlight for a holographic card effect
 * <TiltCard
 *   maxRotation={15}
 *   scaleOnHover={1.05}
 *   glare
 *   glareOpacity={0.25}
 *   perspective={800}
 *   style={{ borderRadius: 12, overflow: 'hidden' }}
 * >
 *   <PricingCard plan="Pro" />
 * </TiltCard>
 *
 * @example
 * // Soft tilt with tighter spring for a snappier response
 * <TiltCard
 *   maxRotation={5}
 *   springStiffness={500}
 *   springDamping={20}
 *   className="feature-card"
 * >
 *   <FeatureIcon />
 *   <p>Feature description</p>
 * </TiltCard>
 */

export interface TiltCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  /** Maximum rotation in degrees on each axis. @default 8 */
  maxRotation?: number
  /** CSS perspective depth in pixels for the 3D effect. @default 1000 */
  perspective?: number
  /** Scale multiplier applied on hover. @default 1.02 */
  scaleOnHover?: number
  /** Whether to show a radial glare highlight that follows the cursor. @default false */
  glare?: boolean
  /** Peak opacity of the glare overlay. @default 0.15 */
  glareOpacity?: number
  /** Spring stiffness for the rotation spring. @default 300 */
  springStiffness?: number
  /** Spring damping for the rotation spring. @default 30 */
  springDamping?: number
  children: React.ReactNode
}

const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      maxRotation = 8,
      perspective = 1000,
      scaleOnHover = 1.02,
      glare = false,
      glareOpacity = 0.15,
      springStiffness = 300,
      springDamping = 30,
      children,
      style,
      ...rest
    },
    _ref
  ) => {
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    // Internal ref for getBoundingClientRect — we don't expose this because the
    // forwarded ref is wired to the motion.div directly via the spread below.
    const cardRef = useRef<HTMLDivElement>(null)

    // Raw motion values
    const rotateX = useMotionValue(0)
    const rotateY = useMotionValue(0)
    const scale = useMotionValue(1)
    const glareX = useMotionValue(0)
    const glareY = useMotionValue(0)

    // Spring-smoothed values
    const springRotateX = useSpring(rotateX, {
      stiffness: springStiffness,
      damping: springDamping,
    })
    const springRotateY = useSpring(rotateY, {
      stiffness: springStiffness,
      damping: springDamping,
    })
    const springScale = useSpring(scale, { stiffness: 400, damping: 25 })

    // Glare background template (only computed when glare=true, but hooks must
    // always be called, so we compute it unconditionally and conditionally apply)
    const glareBackground = useMotionTemplate`radial-gradient(circle 200px at ${glareX}px ${glareY}px, rgba(255,255,255,${glareOpacity}), transparent)`

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const normalX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const normalY =
        (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

      rotateX.set(-normalY * maxRotation)
      rotateY.set(normalX * maxRotation)
      scale.set(scaleOnHover)

      if (glare) {
        glareX.set(e.clientX - rect.left)
        glareY.set(e.clientY - rect.top)
      }
    }

    const handleMouseLeave = () => {
      rotateX.set(0)
      rotateY.set(0)
      scale.set(1)
    }

    if (prefersReducedMotion) {
      return (
        <motion.div style={style} {...rest}>
          {children}
        </motion.div>
      )
    }

    return (
      // Outer plain div establishes the perspective context. It must NOT be a
      // motion.div itself — nesting perspective inside a transform breaks the 3D.
      <div style={{ perspective }}>
        <motion.div
          ref={cardRef}
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            scale: springScale,
            transformStyle: 'preserve-3d',
            position: 'relative',
            ...style,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...rest}
        >
          {/* Glare layer — absolutely positioned above children */}
          {glare && (
            <motion.div
              style={{
                background: glareBackground,
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                borderRadius: 'inherit',
                zIndex: 10,
              }}
              aria-hidden
            />
          )}

          {children}
        </motion.div>
      </div>
    )
  }
)

TiltCard.displayName = 'TiltCard'

export default TiltCard
