'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * FadeIn
 *
 * Wraps a single child and fades/slides it in from a given direction when it
 * enters the viewport. Uses the Intersection Observer via Framer Motion's
 * `whileInView` API. Respects the user's `prefers-reduced-motion` preference
 * by skipping all animation when the media query matches.
 *
 * @example
 * // Basic usage — fade up with defaults
 * <FadeIn>
 *   <h1>Hello World</h1>
 * </FadeIn>
 *
 * @example
 * // Slide in from the left with a custom delay and duration
 * <FadeIn direction="left" distance={32} transition={{ duration: 0.8, delay: 0.3 }}>
 *   <Card>Content</Card>
 * </FadeIn>
 *
 * @example
 * // Re-animate every time the element enters the viewport (not just once)
 * // and pass extra Framer Motion props (e.g. custom className)
 * <FadeIn direction="down" once={false} className="w-full">
 *   <Banner />
 * </FadeIn>
 */

export interface FadeInProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  /** Direction from which the element slides in. @default 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Pixel offset of the starting position. @default 16 */
  distance?: number
  /** Whether to animate only the first time the element enters view. @default true */
  once?: boolean
  /**
   * Override animation timing. Merges with defaults `{ duration: 0.6, ease: 'easeOut' }`.
   * @example transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
   */
  transition?: React.ComponentPropsWithoutRef<typeof motion.div>['transition']
  children: React.ReactNode
}

function getDirectionOffset(
  direction: FadeInProps['direction'],
  distance: number
): { x?: number; y?: number } {
  switch (direction) {
    case 'up':
      return { y: distance }
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    case 'none':
    default:
      return {}
  }
}

const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      direction = 'up',
      distance = 16,
      once = true,
      transition,
      children,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    if (prefersReducedMotion) {
      return (
        <motion.div ref={ref} {...rest}>
          {children}
        </motion.div>
      )
    }

    const directionOffset = getDirectionOffset(direction, distance)

    const initialState = { ...directionOffset, opacity: 0 }
    const animateState = { x: 0, y: 0, opacity: 1 }

    return (
      <motion.div
        ref={ref}
        initial={initialState}
        whileInView={animateState}
        viewport={{ once, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut', ...transition }}
        {...rest}
      >
        {children}
      </motion.div>
    )
  }
)

FadeIn.displayName = 'FadeIn'

export default FadeIn
