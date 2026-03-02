'use client'

import React from 'react'
import { Easing, motion, Variants } from 'framer-motion'

/**
 * TextReveal
 *
 * Splits a text string into animated units — letters, words, or lines — and
 * reveals each one from beneath an `overflow: hidden` clip with a staggered
 * upward slide. The technique mirrors the word-reveal used in the CTA section
 * but is generalised so it can be dropped onto any heading, paragraph, or label.
 *
 * Under the hood every unit is wrapped in a `<span style="overflow:hidden">`,
 * and the inner `motion.span` animates from `y:'100%'` (fully hidden below the
 * clip boundary) to `y:'0%'`, giving a clean "emerges from under" feel.
 * A Framer Motion `staggerChildren` variant drives the cascade.
 *
 * Respects `prefers-reduced-motion`: when active the text renders instantly
 * with no animation.
 *
 * @example
 * // Word reveal on a heading — the most common usage
 * <TextReveal text="Your next project starts here" as="h2" splitBy="word" />
 *
 * @example
 * // Letter-by-letter reveal for short hero labels
 * <TextReveal
 *   text="Scaffold."
 *   as="h1"
 *   splitBy="letter"
 *   staggerDelay={0.04}
 *   duration={0.5}
 * />
 *
 * @example
 * // Line-by-line reveal for a multi-line tagline
 * <TextReveal
 *   text={"Build faster.\nShip with confidence.\nScale without limits."}
 *   as="p"
 *   splitBy="line"
 *   staggerDelay={0.14}
 *   duration={0.7}
 * />
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextRevealProps {
  /** The text string to animate. Use '\n' to define line breaks in 'line' mode. */
  text: string
  /**
   * How to split the text into animated units.
   * - `'letter'` — each character is its own unit (best for short labels / hero words)
   * - `'word'`   — each space-separated word is a unit (default, works for any length)
   * - `'line'`   — each `\n`-separated segment is a unit (best for multi-line blocks)
   * @default 'word'
   */
  splitBy?: 'letter' | 'word' | 'line'
  /** Seconds between each unit's entrance animation. @default 0.05 */
  staggerDelay?: number
  /** Initial delay (seconds) before the first unit begins animating. @default 0 */
  delayChildren?: number
  /** Duration (seconds) of each unit's entrance animation. @default 0.6 */
  duration?: number
  /**
   * Framer Motion easing for each unit. Accepts any easing string (`'easeOut'`,
   * `'circOut'`, etc.) or a cubic-bezier array (`[0.22, 1, 0.36, 1]`).
   * @default [0.22, 1, 0.36, 1]
   */
  ease?: Easing | Easing[] | undefined
  /** When true, animates only the first time the element enters the viewport. @default true */
  once?: boolean
  /**
   * HTML element to render the text within for correct semantics.
   * The animation orchestrator is always a `motion.div` wrapper.
   * @default 'p'
   */
  as?: React.ElementType
  /** Class name applied to the semantic element. */
  className?: string
  /** Inline styles applied to the semantic element. */
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TextReveal({
  text,
  splitBy = 'word',
  staggerDelay = 0.05,
  delayChildren = 0,
  duration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  once = true,
  as: Tag = 'p',
  className,
  style,
}: TextRevealProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  if (prefersReducedMotion) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    )
  }

  // Framer Motion variants -------------------------------------------------------

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration, ease },
    },
  }

  // Rendered units ---------------------------------------------------------------

  const renderUnits = () => {
    if (splitBy === 'letter') {
      return text.split('').map((char, i) => {
        // Render spaces as fixed-width spans to preserve word gaps
        if (char === ' ') {
          return (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {' '}
            </span>
          )
        }
        return (
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          >
            <motion.span style={{ display: 'inline-block' }} variants={itemVariants}>
              {char}
            </motion.span>
          </span>
        )
      })
    }

    if (splitBy === 'word') {
      const words = text.split(' ')
      return words.map((word, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span style={{ display: 'inline-block' }} variants={itemVariants}>
              {word}
            </motion.span>
          </span>
          {/* Preserve inter-word spacing */}
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))
    }

    // splitBy === 'line'
    return text.split('\n').map((line, i) => (
      <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
        <motion.span style={{ display: 'block' }} variants={itemVariants}>
          {/* Render a non-breaking space for intentionally empty lines */}
          {line || '\u00A0'}
        </motion.span>
      </span>
    ))
  }

  // The motion.div orchestrates stagger; the Tag provides correct HTML semantics
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once, margin: '-50px' }}
    >
      <Tag className={className} style={style}>
        {renderUnits()}
      </Tag>
    </motion.div>
  )
}

TextReveal.displayName = 'TextReveal'
