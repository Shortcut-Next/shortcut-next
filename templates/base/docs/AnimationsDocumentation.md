# Animation Components

A library of reusable animation wrappers built with **Framer Motion** and **GSAP**.
All components respect `prefers-reduced-motion` for accessibility.

---

## Claude Prompt — Generate Docs Pages

Use the following prompt with Claude to scaffold a full documentation section in the Next.js app.
It will create a `/docs` route group with a persistent sidebar and one detailed page per animation component.

```
Create a full documentation section inside `templates/base/app/docs/` for this project's animation component library.

Structure to create:
  templates/base/app/docs/
  ├── layout.tsx                         # Sticky sidebar layout ('use client' for usePathname)
  ├── page.tsx                           # Overview index page listing all components
  ├── _components/
  │   ├── DocsNav.tsx                    # Sidebar nav with active-link highlighting
  │   ├── CodeBlock.tsx                  # Styled <pre><code> block using MUI Box sx
  │   └── PropsTable.tsx                 # MUI Table showing prop name / type / default / description
  └── animations/
      ├── fade-in/page.tsx
      ├── stagger-group/page.tsx
      ├── magnetic-button/page.tsx
      ├── parallax-section/page.tsx
      ├── tilt-card/page.tsx
      ├── spotlight-card/page.tsx
      └── text-reveal/page.tsx

Sidebar nav groups:
  • Getting Started → Overview (/docs)
  • Animations →
      FadeIn              /docs/animations/fade-in
      StaggerGroup        /docs/animations/stagger-group
      MagneticButton      /docs/animations/magnetic-button
      ParallaxSection     /docs/animations/parallax-section
      TiltCard            /docs/animations/tilt-card
      SpotlightCard       /docs/animations/spotlight-card
      TextReveal          /docs/animations/text-reveal

Requirements:
- Use MUI components only (Box, Stack, Typography, Paper, Table, Chip, Divider, etc.)
- No raw <div> tags — use Box; no raw <ul>/<li> — use Stack/List
- Layout: 240 px sticky sidebar on md+, main content fills remaining width
- Active nav link: alpha(primary.main, 0.10) background + primary color text + fontWeight 700
- Each docs page must include:
    1. Breadcrumb (Docs > Animations > ComponentName)
    2. Component title (h3 variant) + library badge chip (Framer Motion / GSAP)
    3. One-paragraph description
    4. Import code block
    5. Full props table (PropRow: name, type, default, description)
    6. At least 3 usage examples — each with a plain-English comment and a CodeBlock
    7. Notes & Tips section (bulleted list via Stack/Typography)
    8. "View live demo →" link to /animations/showcase
- Add /docs/* wildcard to publicRoutes in routeMap.ts
- Refer to templates/base/docs/AnimationsDocumentation.md for accurate prop specs,
  descriptions, and usage examples.
```

---

## Quick Reference

| Component | Library | Effect |
|---|---|---|
| `FadeIn` | Framer Motion | Scroll-triggered entrance from a direction |
| `StaggerGroup` / `StaggerItem` | Framer Motion | Staggered entrance for lists/grids |
| `MagneticButton` | GSAP | Cursor-following magnetic button with MUI-style variants |
| `ParallaxSection` | Framer Motion | Scroll-based parallax depth effect |
| `TiltCard` | Framer Motion | 3D hover tilt with spring physics |
| `SpotlightCard` | Framer Motion | Radial spotlight follows cursor |
| `TextReveal` | Framer Motion | Staggered text reveal by letter, word, or line |

All components import from `@/components/animation`.

---

## FadeIn

### Description

`FadeIn` wraps a single child element and fades it in from a configurable direction
(up, down, left, right, or none) as it scrolls into the viewport. It uses Framer
Motion's `whileInView` API backed by the browser's Intersection Observer, so it
triggers lazily with no manual scroll listener overhead. When `prefers-reduced-motion`
is active, the wrapper renders its children immediately with no animation.

### Import

```tsx
import FadeIn from '@/components/animation/FadeIn'
// or
import { FadeIn } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` | Direction from which the element slides in |
| `distance` | `number` | `16` | Pixel offset of the starting position before animation |
| `once` | `boolean` | `true` | When `true`, only animates the first time the element enters view |
| `transition` | `Transition` (Framer Motion) | `{ duration: 0.6, ease: 'easeOut' }` | Merged with defaults — set `delay`, `duration`, `ease`, etc. |
| `children` | `React.ReactNode` | — | Content to animate |
| `...rest` | `motion.div` props | — | Any additional props are forwarded to the underlying `motion.div` |

> **Note:** `duration`, `delay`, and `ease` are NOT direct props. Pass them inside the `transition` prop:
> `<FadeIn transition={{ duration: 0.8, delay: 0.2 }}>`.

### Usage Examples

```tsx
// 1. Basic fade-up with defaults — the most common usage
<FadeIn>
  <Typography variant="h1">Welcome</Typography>
</FadeIn>
```

```tsx
// 2. Slide in from the left with custom delay and duration
<FadeIn direction="left" distance={40} transition={{ duration: 0.8, delay: 0.3 }}>
  <Paper sx={{ p: 3 }}>Feature highlight</Paper>
</FadeIn>
```

```tsx
// 3. Re-animate every time the element enters the viewport (not just once),
//    and pass a className directly onto the motion wrapper
<FadeIn direction="down" once={false} className="w-full mt-8">
  <Banner message="Limited time offer" />
</FadeIn>
```

```tsx
// 4. No slide — pure opacity fade (direction="none")
<FadeIn direction="none" transition={{ duration: 1.2 }}>
  <HeroImage />
</FadeIn>
```

### Notes / Tips

- **Viewport margin**: Uses a `-50px` margin so elements begin animating slightly
  before they fully enter the screen, giving a smoother feel.
- **SSR safety**: The `prefers-reduced-motion` check is guarded by
  `typeof window !== 'undefined'`, so the component is safe in server components
  and during Next.js static generation.
- **Staggering multiple items**: For lists or grids, prefer `StaggerGroup` /
  `StaggerItem` over multiple `<FadeIn transition={{ delay: n }}>` — it handles
  timing automatically and keeps markup cleaner.
- **Custom easing**: Any Framer Motion easing string or array works, e.g.
  `transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.7 }}`.

---

## StaggerGroup / StaggerItem

### Description

`StaggerGroup` is a Framer Motion `motion.div` orchestrator that automatically
staggers the entrance animation of its `StaggerItem` children. Each `StaggerItem`
fades and slides in sequentially, with the delay between items controlled by
`staggerDelay` on the parent. Direction, distance, and duration are shared via
React Context so you only configure them once on the parent. This pattern is ideal
for feature grids, team cards, pricing tables, or any repeating list.

### Import

```tsx
import { StaggerGroup, StaggerItem } from '@/components/animation/StaggerGroup'
// or
import { StaggerGroup, StaggerItem } from '@/components/animation'
```

### StaggerGroup Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `staggerDelay` | `number` | `0.1` | Seconds between each child's entrance |
| `delayChildren` | `number` | `0` | Initial delay before the first child animates |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` | Slide direction shared with all `StaggerItem` children |
| `distance` | `number` | `16` | Pixel offset of the starting position |
| `duration` | `number` | `0.6` | Animation duration (seconds) for each child |
| `once` | `boolean` | `true` | Whether to animate only on the first viewport entry |
| `children` | `React.ReactNode` | — | Should contain one or more `StaggerItem` elements |
| `...rest` | `motion.div` props | — | Forwarded to the container `motion.div` |

### StaggerItem Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | from parent context | Override the parent's direction |
| `distance` | `number` | from parent context | Override the parent's distance |
| `duration` | `number` | from parent context | Override the parent's duration |
| `children` | `React.ReactNode` | — | Content to animate |
| `...rest` | `motion.div` props | — | Forwarded to the item `motion.div` |

### Usage Examples

```tsx
// 1. Feature grid — items stagger 120 ms apart, sliding up
<StaggerGroup staggerDelay={0.12} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
  {features.map((feature) => (
    <StaggerItem key={feature.id}>
      <FeatureCard {...feature} />
    </StaggerItem>
  ))}
</StaggerGroup>
```

```tsx
// 2. Horizontal list — items slide in from the left with a 200 ms pre-delay
<StaggerGroup staggerDelay={0.08} delayChildren={0.2} direction="left" distance={32}>
  {teamMembers.map((member) => (
    <StaggerItem key={member.id}>
      <MemberCard {...member} />
    </StaggerItem>
  ))}
</StaggerGroup>
```

```tsx
// 3. Re-animate on every viewport entry; one item overrides direction
<StaggerGroup staggerDelay={0.15} once={false} direction="up">
  <StaggerItem><Step label="Step 1" /></StaggerItem>
  <StaggerItem direction="right"><Step label="Step 2" /></StaggerItem>
  <StaggerItem><Step label="Step 3" /></StaggerItem>
</StaggerGroup>
```

### Notes / Tips

- Only **direct** `StaggerItem` children participate in the stagger. Deeply nested
  items inside other wrappers are not affected.
- `StaggerGroup` adds no visible styling — it is purely a timing orchestrator.
- Both components respect `prefers-reduced-motion` and render children immediately
  without animation when the preference is active.
- Spread a `style` or `className` on `StaggerGroup` to control grid/flex layout
  without adding an extra wrapper element.

---

## MagneticButton

### Description

`MagneticButton` is a GSAP-powered interactive element that shifts toward the
user's cursor while they hover over it, creating a tactile "magnetic pull" feel.
On mouse leave it springs back to its resting position using an elastic ease.

It renders as either a `<button>` (default) or an `<a>` tag. Visual styling
mirrors MUI Button — choose a `variant` and `color` and the component derives all
colors from `useTheme()` automatically. `borderRadius` comes from
`themeConfig.borderRadius`. Override any individual property via the `style` prop.

### Import

```tsx
import MagneticButton from '@/components/animation/MagneticButton'
// or
import { MagneticButton } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `'button' \| 'a'` | `'button'` | HTML element to render |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | MUI palette color for the button |
| `variant` | `'contained' \| 'outlined' \| 'text'` | `'contained'` | Visual style, matching MUI Button variants |
| `strength` | `number` | `0.18` | Magnetic pull multiplier (0–1). Higher = stronger pull |
| `followDuration` | `number` | `0.3` | Cursor-follow animation duration in seconds |
| `followEase` | `string` | `'power2.out'` | GSAP ease for following the cursor |
| `returnDuration` | `number` | `0.6` | Spring-back animation duration in seconds |
| `returnEase` | `string` | `'elastic.out(1, 0.4)'` | GSAP ease for returning to rest |
| `disabled` | `boolean` | `false` | Disables the magnetic effect; dims opacity; passes `disabled` to `<button>` |
| `href` | `string` | — | Anchor `href` (only when `as="a"`) |
| `target` | `string` | — | Anchor `target` attribute |
| `rel` | `string` | — | Anchor `rel` attribute |
| `onClick` | `React.MouseEventHandler` | — | Click handler |
| `style` | `React.CSSProperties` | — | Merged on top of computed default styles — any property you set wins |
| `className` | `string` | — | CSS class(es) |
| `aria-label` | `string` | — | Accessible label |
| `children` | `React.ReactNode` | — | Button content |

### Usage Examples

```tsx
// 1. Default — contained primary, fully auto-styled from theme
<MagneticButton onClick={() => router.push('/signup')}>
  Get Started Free
</MagneticButton>
```

```tsx
// 2. Outlined secondary anchor with stronger pull
<MagneticButton
  as="a"
  href="https://github.com/your-org/project"
  target="_blank"
  rel="noopener noreferrer"
  variant="outlined"
  color="secondary"
  strength={0.30}
  aria-label="View project on GitHub (opens in new tab)"
>
  Star on GitHub
</MagneticButton>
```

```tsx
// 3. Text error button with custom font size override
<MagneticButton
  variant="text"
  color="error"
  returnEase="elastic.out(1.5, 0.3)"
  style={{ fontSize: 16, padding: '10px 28px' }}
  onClick={handleDelete}
>
  Delete Account
</MagneticButton>
```

```tsx
// 4. Disabled — plain styled button, no GSAP animation
<MagneticButton disabled variant="outlined" color="primary" onClick={handleSubmit}>
  Submit
</MagneticButton>
```

### Notes / Tips

- **`will-change` management**: Sets `will-change: transform` on `mouseenter` and
  resets it to `auto` after the return animation completes, keeping GPU layer
  promotion scoped to active interactions only.
- **Strength range**: Values between `0.10` and `0.25` feel natural for most button
  sizes. Larger values can feel disorienting on small elements.
- **Touch devices**: The magnetic effect is pointer-only (`mousemove`). On touch
  devices the element behaves as a standard button or anchor with no side effects.
- **Hover state**: Hover colors are computed from the active theme using React state
  (`useState`). The GSAP `transform` is applied directly to the DOM, so React
  re-renders on hover do not interrupt the animation.
- **Style override**: The `style` prop is merged last — anything you pass wins over
  the computed defaults, so you can customize padding, font-size, etc. freely.

---

## ParallaxSection

### Description

`ParallaxSection` is a Framer Motion scroll-driven wrapper that translates its
children along the Y axis (or X axis) as the user scrolls past it, creating a
layered depth effect. It uses `useScroll` with an element ref and `useTransform`
to map scroll progress to a percentage offset range. Best used for decorative
background layers, hero images, or accent shapes that should move at a different
speed than page content. The effect is suppressed when `prefers-reduced-motion`
is active.

### Import

```tsx
import ParallaxSection from '@/components/animation/ParallaxSection'
// or
import { ParallaxSection } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `speed` | `number` | `0.3` | Parallax intensity. `0` = no effect, `>0` = same direction, `<0` = counter-scroll |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Axis along which the parallax translation is applied |
| `children` | `React.ReactNode` | — | Content to apply the parallax effect to |
| `style` | `React.CSSProperties` | — | Applied to the outer `<div>` container |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the outer container `<div>` |

> **Note:** The outer container automatically has `overflow: hidden` applied.
> The inner `motion.div` handles the transform. The component does **not** extend
> `motion.div` props — pass `style` for layout overrides.

### How the speed formula works

The inner element translates between `-(speed × 50%)` and `+(speed × 50%)` as
the section scrolls from entering the bottom of the viewport to leaving the top.

| `speed` | Effect |
|---|---|
| `0` | No movement (same as plain wrapper) |
| `0.3` | Content moves 15% relative to viewport height — subtle depth |
| `0.6` | Content moves 30% — noticeable parallax for hero backgrounds |
| `-0.3` | Counter-scroll — content floats opposite to scroll direction |

### Usage Examples

```tsx
// 1. Hero section background that scrolls slower than the page
<ParallaxSection speed={0.4} style={{ height: 500 }}>
  <Box
    component="img"
    src="/hero-bg.jpg"
    sx={{ width: '100%', height: '140%', objectFit: 'cover' }}
  />
</ParallaxSection>
```

```tsx
// 2. Floating decorative blob that drifts upward faster than the content
<Box sx={{ position: 'relative' }}>
  <ParallaxSection speed={-0.5} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <Box sx={{ width: 400, height: 400, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.08, filter: 'blur(80px)' }} />
  </ParallaxSection>
  <SectionContent />
</Box>
```

```tsx
// 3. Horizontal parallax for a logo strip
<ParallaxSection direction="horizontal" speed={0.2} style={{ width: '100%' }}>
  <LogoStrip />
</ParallaxSection>
```

### Notes / Tips

- The outer container must have an explicit height (or sit inside a container with
  a defined height) for Framer Motion's scroll tracking to work correctly.
- `speed` values above `0.6` can make content feel disconnected from the page.
  Decorative elements tolerate higher values than content-carrying elements.
- For a "sticky" parallax hero, combine `ParallaxSection` with `position: sticky`
  on the outer container.
- The `overflow: hidden` on the container clips any visual bleed caused by the
  translation. If you need the parallax to bleed outside, wrap in a larger container.

---

## TiltCard

### Description

`TiltCard` wraps content in a card that rotates along both the X and Y axes in
response to the pointer position, simulating a physical 3D tilt. The rotation uses
Framer Motion spring physics (`useSpring`), so the card naturally overshoots slightly
and settles, giving it a satisfying inertia feel. On mouse leave all values spring
back to zero. An optional radial glare overlay shifts with the tilt to reinforce the
3D illusion. The effect is disabled when `prefers-reduced-motion` is active.

### Import

```tsx
import TiltCard from '@/components/animation/TiltCard'
// or
import { TiltCard } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxRotation` | `number` | `8` | Maximum rotation in degrees on each axis |
| `perspective` | `number` | `1000` | CSS perspective distance in pixels. Lower = more dramatic 3D |
| `scaleOnHover` | `number` | `1.02` | Scale multiplier applied while hovering |
| `glare` | `boolean` | `false` | Show a radial glare highlight that follows the cursor |
| `glareOpacity` | `number` | `0.15` | Peak opacity of the glare overlay |
| `springStiffness` | `number` | `300` | Framer Motion spring stiffness for the rotation |
| `springDamping` | `number` | `30` | Framer Motion spring damping |
| `children` | `React.ReactNode` | — | Card content |
| `style` | `React.CSSProperties` | — | Applied to the inner `motion.div` (border-radius, background, etc.) |
| `...rest` | `motion.div` props | — | Forwarded to the inner `motion.div` |

### Usage Examples

```tsx
// 1. Feature card with default tilt — subtle and clean
<TiltCard style={{ borderRadius: 16, border: '1px solid', borderColor: 'divider', padding: 24 }}>
  <Typography variant="h6">Real-time Sync</Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
    Data propagates instantly across all connected clients.
  </Typography>
</TiltCard>
```

```tsx
// 2. Holographic pricing card — aggressive tilt, glare enabled, looser spring
<TiltCard
  maxRotation={15}
  perspective={700}
  scaleOnHover={1.05}
  glare
  glareOpacity={0.25}
  springStiffness={200}
  springDamping={20}
  style={{ borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}
>
  <PricingCardContent plan="Pro" />
</TiltCard>
```

```tsx
// 3. Image card — keep overflow hidden so glare is clipped to card shape
<TiltCard
  glare
  maxRotation={10}
  style={{ borderRadius: 12, overflow: 'hidden', width: 320 }}
>
  <Box component="img" src="/screenshot.png" sx={{ width: '100%', display: 'block' }} />
</TiltCard>
```

### Notes / Tips

- The outer wrapper (`<div style={{ perspective }}>`) must **not** be a `motion.div` —
  nesting a CSS `perspective` inside a CSS `transform` breaks the 3D. `TiltCard`
  handles this structure automatically.
- `transformStyle: 'preserve-3d'` is applied to the inner card so child elements
  can also participate in the 3D space if needed.
- The glare overlay uses `pointer-events: none` and `zIndex: 10` so it never
  interferes with click or hover events on children.
- Tune `perspective` and `maxRotation` together: low perspective + high rotation =
  exaggerated; for subtle product cards use `perspective={1000}` + `maxRotation={6}`.

---

## SpotlightCard

### Description

`SpotlightCard` renders a card with a radial gradient "spotlight" that follows
the cursor while it moves over the card, highlighting the surface under the pointer
and creating a sense of physical depth. The gradient position is driven by Framer
Motion `useMotionValue` and `useMotionTemplate`, so it is animated off the React
render cycle for maximum performance — no state updates on `mousemove`. The spotlight
moves off-screen on mouse leave (initial position is `-9999px`) to prevent a flash
on first hover. Like all components in this library, the effect is suppressed when
`prefers-reduced-motion` is active.

### Import

```tsx
import SpotlightCard from '@/components/animation/SpotlightCard'
// or
import { SpotlightCard } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `spotlightColor` | `string` | `alpha(theme.palette.primary.main, 0.12)` | CSS color for the spotlight at its center. Supports hex, rgba, hsl, etc. |
| `spotlightSize` | `number` | `300` | Diameter of the spotlight circle in pixels |
| `children` | `React.ReactNode` | — | Card content |
| `style` | `React.CSSProperties` | — | Applied to the outer `motion.div`. Set border-radius, padding, background here |
| `...rest` | `motion.div` props | — | Forwarded to the outer `motion.div` |

### Usage Examples

```tsx
// 1. Theme-derived spotlight — adapts to light/dark mode automatically
<SpotlightCard style={{ borderRadius: 16, border: '1px solid', padding: 32 }}>
  <Typography variant="h6">Audit Logs</Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
    Every action is recorded with timestamps.
  </Typography>
</SpotlightCard>
```

```tsx
// 2. Custom amber spotlight on a dark card
<SpotlightCard
  spotlightColor="rgba(251, 191, 36, 0.18)"
  spotlightSize={380}
  style={{
    borderRadius: 16,
    background: '#0f0f0f',
    color: '#fff',
    padding: 32,
  }}
>
  <ProFeatureCard />
</SpotlightCard>
```

```tsx
// 3. Grid of spotlight cards — each card tracks its cursor independently
<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
  {features.map((f) => (
    <SpotlightCard
      key={f.id}
      spotlightSize={260}
      style={{ borderRadius: 12, border: '1px solid', padding: 24 }}
    >
      <FeatureItem feature={f} />
    </SpotlightCard>
  ))}
</Box>
```

### Notes / Tips

- The spotlight gradient is applied as a `background` on an absolutely positioned
  `motion.div` inside the card (`inset: 0`, `pointer-events: none`). Children render
  above it via `position: relative; z-index: 1`.
- Because position tracking uses `useMotionValue` + `useMotionTemplate` instead of
  React state, re-renders are NOT triggered on every `mousemove` — performance is
  equivalent to a pure CSS approach.
- `spotlightColor` supports any valid CSS color. Keep the alpha low (`0.06–0.15`)
  for a subtle effect on dark cards, slightly higher (`0.08–0.18`) on light cards.
- The component works best on cards with visible contrast (dark background or a clear
  border). On plain white backgrounds, use a warm or colored spotlight color.
- The default color reads `alpha(theme.palette.primary.main, 0.12)` from
  `useTheme()` — it switches automatically when the user toggles dark/light mode.

---

## TextReveal

### Description

`TextReveal` splits a text string into animated units — **letters**, **words**, or
**lines** — and reveals each one from beneath an `overflow: hidden` clip with a
staggered upward slide. The core technique is the same word-reveal used in the
CTA section heading ("Your next project starts here"), extracted into a reusable
component.

Under the hood every unit is wrapped in a `<span style="overflow:hidden">`, and
the inner `motion.span` animates from `y:'100%'` (fully hidden below the clip
boundary) to `y:'0%'`, giving a clean "emerges from under" feel. A Framer Motion
`staggerChildren` variant drives the cascade, triggered by `whileInView` so the
animation fires when the element scrolls into view.

When `prefers-reduced-motion` is active, the text renders instantly with no
animation.

### Import

```tsx
import TextReveal from '@/components/animation/TextReveal'
// or
import { TextReveal } from '@/components/animation'
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | The text to animate. Use `'\n'` to define line breaks in `'line'` mode. |
| `splitBy` | `'letter' \| 'word' \| 'line'` | `'word'` | How to split the text into animated units. |
| `staggerDelay` | `number` | `0.05` | Seconds between each unit's entrance animation. |
| `delayChildren` | `number` | `0` | Initial delay (seconds) before the first unit begins animating. |
| `duration` | `number` | `0.6` | Duration (seconds) of each unit's animation. |
| `ease` | `string \| number[]` | `[0.22, 1, 0.36, 1]` | Framer Motion easing. Any easing string or cubic-bezier array. |
| `once` | `boolean` | `true` | When `true`, animates only the first time the element enters the viewport. |
| `as` | `React.ElementType` | `'p'` | HTML tag for the text element (`'h1'`, `'h2'`, `'span'`, etc.). |
| `className` | `string` | — | Class name applied to the semantic element. |
| `style` | `React.CSSProperties` | — | Inline styles applied to the semantic element. |

> **Wrapper note:** The animation orchestrator is always a `motion.div` wrapping
> the `as` element. This adds one extra `display:block` div to the DOM. Use the
> `as` prop for the correct semantic element; apply layout styles via `style` or
> `className` on the element itself, or on a parent container.

### Split modes at a glance

| `splitBy` | Best for | Suggested `staggerDelay` |
| --- | --- | --- |
| `'letter'` | Short hero words / labels (≤ ~12 chars) | `0.03–0.05` |
| `'word'` | Any sentence-length heading or subtitle | `0.06–0.10` |
| `'line'` | Multi-line taglines using `\n` separators | `0.12–0.18` |

### Usage Examples

```tsx
// 1. Word reveal — drop-in replacement for the CTA heading technique
<TextReveal
  text="Your next project starts here"
  as="h2"
  splitBy="word"
  staggerDelay={0.08}
  style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}
/>
```

```tsx
// 2. Letter-by-letter reveal for a short hero label
<TextReveal
  text="Scaffold."
  as="h1"
  splitBy="letter"
  staggerDelay={0.04}
  duration={0.5}
  style={{ fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
/>
```

```tsx
// 3. Line-by-line reveal for a multi-line tagline
<TextReveal
  text={"Build faster.\nShip with confidence.\nScale without limits."}
  as="p"
  splitBy="line"
  staggerDelay={0.14}
  duration={0.7}
  style={{ fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.6 }}
/>
```

```tsx
// 4. Delayed entrance after a FadeIn sibling finishes
<TextReveal
  text="Everything you need, nothing you don't."
  as="h3"
  splitBy="word"
  delayChildren={0.4}
  staggerDelay={0.06}
  once={false}
/>
```

### Notes / Tips

- **Split mode selection**: `'letter'` produces the most dramatic stagger but
  looks best on short text (single words or short phrases). For sentences, use
  `'word'`. For large display copy spanning multiple visual lines, `'line'` gives
  a bold, sequential reveal that draws the eye downward.
- **Spaces in `'letter'` mode**: Space characters are rendered as `white-space: pre`
  spans so word gaps are preserved accurately regardless of font metrics.
- **Empty lines**: In `'line'` mode, empty `'\n\n'` segments render a
  non-breaking space (`\u00A0`) to keep line height intact.
- **Composing with `FadeIn`**: `TextReveal` already handles its own viewport
  trigger — do not nest it inside a `FadeIn` wrapper, as the outer `FadeIn`
  would animate the container before the inner stagger runs, causing a double
  animation.
- **Font inheritance**: The inner `motion.span` elements inherit all font styles
  from the `as` element, so `fontWeight`, `letterSpacing`, `lineHeight`, etc.
  applied via `style` or `className` work exactly as expected.
- **Re-animate on scroll back**: Set `once={false}` to replay the stagger every
  time the element re-enters the viewport — useful in showcase or demo pages.
