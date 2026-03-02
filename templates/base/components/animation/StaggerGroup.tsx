'use client'

import React, { createContext, useContext } from 'react'
import { motion, Variants } from 'framer-motion'

/**
 * StaggerGroup / StaggerItem
 *
 * A pair of components for staggered list/grid animations. `StaggerGroup` acts
 * as the orchestrating container — it triggers when it enters the viewport and
 * plays each direct `StaggerItem` child in sequence with a configurable delay
 * between them. Direction, distance, and duration are passed down to all
 * children via React Context so you only set them once on the parent.
 *
 * @example
 * // Basic staggered card grid
 * <StaggerGroup staggerDelay={0.12} direction="up">
 *   {cards.map((card) => (
 *     <StaggerItem key={card.id}>
 *       <Card>{card.title}</Card>
 *     </StaggerItem>
 *   ))}
 * </StaggerGroup>
 *
 * @example
 * // Horizontal slide-in list with an initial delay before the first item
 * <StaggerGroup direction="left" distance={24} delayChildren={0.2} staggerDelay={0.08}>
 *   <StaggerItem><Step label="Step 1" /></StaggerItem>
 *   <StaggerItem><Step label="Step 2" /></StaggerItem>
 *   <StaggerItem><Step label="Step 3" /></StaggerItem>
 * </StaggerGroup>
 *
 * @example
 * // Re-animate each time the group scrolls back into view
 * <StaggerGroup once={false} staggerDelay={0.15}>
 *   <StaggerItem><Feature icon={<Star />} title="Feature A" /></StaggerItem>
 *   <StaggerItem><Feature icon={<Star />} title="Feature B" /></StaggerItem>
 * </StaggerGroup>
 */

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StaggerContextValue {
  direction: 'up' | 'down' | 'left' | 'right' | 'none'
  distance: number
  duration: number
}

const StaggerContext = createContext<StaggerContextValue>({
  direction: 'up',
  distance: 16,
  duration: 0.6,
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDirectionOffset(
  direction: StaggerContextValue['direction'],
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

// ---------------------------------------------------------------------------
// StaggerGroup
// ---------------------------------------------------------------------------

export interface StaggerGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  /** Seconds between each child animation. @default 0.1 */
  staggerDelay?: number
  /** Initial delay (in seconds) before the first child animates. @default 0 */
  delayChildren?: number
  /** Slide-in direction shared with all StaggerItem children. @default 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Pixel offset of the starting position for each child. @default 16 */
  distance?: number
  /** Animation duration (seconds) for each child. @default 0.6 */
  duration?: number
  /** Trigger animation only once when the group first enters view. @default true */
  once?: boolean
  children: React.ReactNode
}

export function StaggerGroup({
  staggerDelay = 0.1,
  delayChildren = 0,
  direction = 'up',
  distance = 16,
  duration = 0.6,
  once = true,
  children,
  ...rest
}: StaggerGroupProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : delayChildren,
      },
    },
  }

  return (
    <StaggerContext.Provider value={{ direction, distance, duration }}>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once, margin: '-50px' }}
        {...rest}
      >
        {children}
      </motion.div>
    </StaggerContext.Provider>
  )
}

StaggerGroup.displayName = 'StaggerGroup'

// ---------------------------------------------------------------------------
// StaggerItem
// ---------------------------------------------------------------------------

export interface StaggerItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  children: React.ReactNode
  /** Override the direction from the parent StaggerGroup context. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Override the distance from the parent StaggerGroup context. */
  distance?: number
  /** Override the duration from the parent StaggerGroup context. */
  duration?: number
}

export function StaggerItem({
  children,
  direction: directionProp,
  distance: distanceProp,
  duration: durationProp,
  ...rest
}: StaggerItemProps) {
  const ctx = useContext(StaggerContext)

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const direction = directionProp ?? ctx.direction
  const distance = distanceProp ?? ctx.distance
  const duration = durationProp ?? ctx.duration

  if (prefersReducedMotion) {
    return (
      <motion.div variants={{ hidden: {}, visible: {} }} {...rest}>
        {children}
      </motion.div>
    )
  }

  const directionOffset = getDirectionOffset(direction, distance)

  const itemVariants: Variants = {
    hidden: { ...directionOffset, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration, ease: 'easeOut' },
    },
  }

  return (
    <motion.div variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  )
}

StaggerItem.displayName = 'StaggerItem'
