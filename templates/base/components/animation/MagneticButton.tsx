'use client'

import { useRef, useCallback, useState } from 'react'
import { useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { gsap } from '@/lib/gsap'
import themeConfig from '@/core/configs/themeConfig'

/**
 * MagneticButton
 *
 * A magnetic cursor-follow button (or anchor) powered by GSAP, styled like an
 * MUI Button. Pick a `variant` and `color` just as you would with MUI — the
 * component derives all colors from the active theme so it works seamlessly in
 * light and dark mode. Sizing, hover colors, and border-radius all come from
 * `useTheme()` and `themeConfig.borderRadius` by default; pass a `style` prop
 * to override any individual property.
 *
 * On hover the element subtly shifts toward the cursor. On mouse leave it
 * springs back using an elastic GSAP ease. All animation is skipped when the
 * user has enabled `prefers-reduced-motion`, or when `disabled` is `true`.
 *
 * @example
 * // 1. Default — contained primary, auto-styled from theme
 * <MagneticButton onClick={handleClick}>
 *   Get Started
 * </MagneticButton>
 *
 * @example
 * // 2. Outlined secondary anchor with stronger magnetic pull
 * <MagneticButton
 *   as="a"
 *   href="/pricing"
 *   variant="outlined"
 *   color="secondary"
 *   strength={0.35}
 * >
 *   View Pricing
 * </MagneticButton>
 *
 * @example
 * // 3. Text button, custom transition, inline style override
 * <MagneticButton
 *   variant="text"
 *   color="error"
 *   returnEase="elastic.out(1.5, 0.3)"
 *   style={{ fontSize: 16, padding: '10px 28px' }}
 * >
 *   Delete
 * </MagneticButton>
 *
 * @example
 * // 4. Disabled magnetic effect — plain styled button, no GSAP
 * <MagneticButton disabled variant="outlined" color="primary">
 *   Submit
 * </MagneticButton>
 */

export type MagneticButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type MagneticButtonVariant = 'contained' | 'outlined' | 'text'

type MagneticButtonProps = {
  /** HTML element to render. @default 'button' */
  as?: 'button' | 'a'
  /** MUI-style palette color. @default 'primary' */
  color?: MagneticButtonColor
  /** MUI-style visual variant. @default 'contained' */
  variant?: MagneticButtonVariant
  /** Magnetic pull multiplier in the range 0–1. @default 0.18 */
  strength?: number
  /** Duration in seconds for the cursor-follow animation. @default 0.3 */
  followDuration?: number
  /** GSAP ease string used while following the cursor. @default 'power2.out' */
  followEase?: string
  /** Duration in seconds for the spring-back animation on mouse leave. @default 0.6 */
  returnDuration?: number
  /** GSAP ease string used when springing back to rest. @default 'elastic.out(1, 0.4)' */
  returnEase?: string
  /**
   * Disables the magnetic effect (and dims opacity slightly).
   * Also respected automatically when `prefers-reduced-motion` is set. @default false
   */
  disabled?: boolean
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
  onClick?: React.MouseEventHandler
  /** Merged on top of the computed default styles — any property you set here wins. */
  style?: React.CSSProperties
  className?: string
  'aria-label'?: string
}

export default function MagneticButton({
  as = 'button',
  color = 'primary',
  variant = 'contained',
  strength = 0.18,
  followDuration = 0.3,
  followEase = 'power2.out',
  returnDuration = 0.6,
  returnEase = 'elastic.out(1, 0.4)',
  disabled = false,
  children,
  href,
  target,
  rel,
  onClick,
  style,
  className,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const theme = useTheme()
  const elRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  // -------------------------------------------------------------------------
  // Style computation
  // -------------------------------------------------------------------------

  const palette = theme.palette[color]
  const radius = themeConfig.borderRadius

  const baseStyle: React.CSSProperties = {
    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // Spacing
    padding: '7px 20px',
    // Typography
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.02857em',
    lineHeight: 1.75,
    // Misc
    borderRadius: radius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
    // Smooth color transitions (separate from GSAP transform)
    transition: 'background-color 200ms, color 200ms, border-color 200ms, box-shadow 200ms',
  }

  // Variant-specific base + hover tokens
  const variantBase: React.CSSProperties =
    variant === 'contained'
      ? {
          background: hovered ? palette.dark : palette.main,
          color: palette.contrastText,
          border: 'none',
          boxShadow: hovered
            ? `0 4px 16px ${alpha(palette.main, 0.4)}`
            : `0 2px 8px ${alpha(palette.main, 0.25)}`,
        }
      : variant === 'outlined'
        ? {
            background: hovered ? alpha(palette.main, 0.08) : 'transparent',
            color: palette.main,
            border: `1px solid ${hovered ? palette.main : alpha(palette.main, 0.5)}`,
            boxShadow: 'none',
          }
        : {
            // text
            background: hovered ? alpha(palette.main, 0.08) : 'transparent',
            color: palette.main,
            border: 'none',
            boxShadow: 'none',
          }

  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...variantBase,
    // User overrides win
    ...style,
  }

  // -------------------------------------------------------------------------
  // GSAP magnetic handlers
  // -------------------------------------------------------------------------

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (prefersReducedMotion || disabled || !elRef.current) return
    elRef.current.style.willChange = 'transform'
  }, [prefersReducedMotion, disabled])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion || disabled || !elRef.current) return

      const rect = elRef.current.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)

      gsap.to(elRef.current, { x: dx * strength, y: dy * strength, duration: followDuration, ease: followEase })
    },
    [prefersReducedMotion, disabled, strength, followDuration, followEase]
  )

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (!elRef.current) return
    gsap.to(elRef.current, {
      x: 0,
      y: 0,
      duration: returnDuration,
      ease: returnEase,
      onComplete: () => {
        if (elRef.current) elRef.current.style.willChange = 'auto'
      },
    })
  }, [returnDuration, returnEase])

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const sharedProps = {
    style: computedStyle,
    className,
    'aria-label': ariaLabel,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }

  if (as === 'a') {
    return (
      <a
        ref={elRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={elRef as React.Ref<HTMLButtonElement>}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
