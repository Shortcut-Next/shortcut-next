# Landing Page Content Guide

All visible text, links, and section visibility for the placeholder landing page
are controlled through a **single static file**:

```
components/landing/landingContent.ts
```

No component code needs to be touched. Change a string in that file and the
page reflects it instantly — no rebuilds, no grep-and-replace across components.

---

## How It Works

The file exports one typed object called `landingContent`. Every section of the
landing page reads from it. Each section follows the same shape:

```ts
sectionName: {
  visible: true,   // set to false to hide the section entirely
  ...fields        // all user-visible text lives here
}
```

Setting `visible: false` on any section removes it from the rendered page completely.
The section component is never mounted, so no placeholder space is left behind.

---

## Claude Prompt — Rewrite Content for Your Product

Use the prompt below to have Claude rewrite the entire `landingContent.ts` file
for your specific product. Paste it into Claude Code (or any Claude interface)
and replace the bracketed placeholder with a description of what your product does.

The prompt produces a complete, ready-to-paste replacement for the exported
`landingContent` object — preserving all TypeScript types and structural
requirements while filling in copy that fits your product.

```
Rewrite the `landingContent` export in
`components/landing/landingContent.ts` for a new product.

My product: [describe your product in 2–4 sentences — what it does,
who it is for, and what makes it different]

Rules:
1. Output only the full `landingContent` object — no explanation, no
   surrounding text, no markdown code fences.
2. Preserve every key and every TypeScript type exactly as they appear
   in the original file. Do not add, remove, or rename any keys.
3. Keep `visible: true` on all sections unless the section genuinely
   does not apply to this product (e.g. a CLI install banner for a
   SaaS that has no install command).
4. Rewrite every string to fit the product naturally — do not leave
   any Shortcut Next / scaffolding copy behind.
5. For `codeDemo.terminalLines`: write a realistic, product-appropriate
   shell session (e.g. sign-up flow, API call, config init).
6. For `whatYouGet.fileTree`: represent the folder structure a user
   would open after getting started — keep the same TreeNode shape.
7. For `stats.items`: choose 3 numbers that matter for this product.
   Set `animateTo: null` for values that are not plain integers
   (e.g. "<1ms", "99.9%") and put the display string in `display`.
8. For `footer.resourceLinks`: use real or plausible documentation
   section names relevant to the product — keep `external: true`.
9. Keep all `href` values as `#section-name` anchors or plausible URLs.
   Do not use placeholder text like "YOUR_LINK_HERE".
10. Write copy that is direct, confident, and benefit-focused —
    not marketing fluff. Developers are the audience.
```

---

## Quick Reference

| Section | Key | What it controls |
| --- | --- | --- |
| Navigation bar | `nav` | Links, CTA button |
| Hero | `hero` | Headline, subtitle, CTAs, terminal command |
| Scrolling banner | `installBanner` | Two rows of feature tags |
| Feature cards | `features` | Numbered feature grid |
| Code demo | `codeDemo` | Left-side copy + right-side terminal |
| Tech stack | `techStack` | Library cards + callout |
| What you get | `whatYouGet` | File tree + included-items list |
| How it works | `howItWorks` | Numbered steps |
| Stats counter | `stats` | Three animated numbers |
| FAQ accordion | `faq` | Questions and answers |
| CTA section | `cta` | Final call-to-action block |
| Footer | `footer` | Brand, links, install command |

---

## Section Reference

### `nav` — Navigation Bar

```ts
nav: {
  visible: true,
  links: [
    { label: 'Features', href: '#features' },
    // add or remove nav items freely
  ],
  cta: { label: 'Get Started', href: '/login' }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `links` | `{ label, href }[]` | Navigation links rendered left of the CTA |
| `cta` | `{ label, href }` | Primary button at the right end of the nav bar |

---

### `hero` — Full-screen Hero Section

```ts
hero: {
  visible: true,
  eyebrow: 'NEXT.JS SCAFFOLDING CLI',      // small all-caps label above title
  title: 'Stop Starting From Scratch',      // large animated heading
  subtitle: '...',                          // paragraph below the title
  primaryCta: { label: 'Get Started', href: '#get-started' },
  secondaryCta: { label: 'View Docs', href: '...', target: '_blank' },
  command: 'npx create-shortcut-next',      // shown in the terminal chip
  scrollLabel: 'SCROLL'                     // label beside the scroll indicator
}
```

| Field | Type | Description |
| --- | --- | --- |
| `eyebrow` | `string` | Small overline badge above the main title |
| `title` | `string` | Main headline — large animated text |
| `subtitle` | `string` | Supporting paragraph |
| `primaryCta` | `{ label, href }` | Solid primary button |
| `secondaryCta` | `{ label, href, target }` | Ghost/outline secondary button |
| `command` | `string` | Shell command shown in the animated terminal chip |
| `scrollLabel` | `string` | Label next to the scroll-down indicator |

---

### `installBanner` — Scrolling Marquee Banner

Two rows of tag-style chips that scroll horizontally in opposite directions.

```ts
installBanner: {
  visible: true,
  row1: ['Next.js 15', 'App Router', 'MUI v7', ...],
  row2: ['Dark Mode', 'i18n + RTL', 'Protected Routes', ...]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `row1` | `string[]` | Top row — scrolls left |
| `row2` | `string[]` | Bottom row — scrolls right |

Add or remove strings from either array freely. Both rows loop infinitely.

---

### `features` — Numbered Feature Cards Grid

```ts
features: {
  visible: true,
  label: 'FEATURES',                // section eyebrow
  heading: 'A complete app...',     // section heading
  cards: [
    { num: '01', name: 'MUI v7 Design System', desc: '...' },
    // up to any number of cards
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Small all-caps label above the heading |
| `heading` | `string` | Section heading |
| `cards[].num` | `string` | Decorative number shown on the card (e.g. `'01'`) |
| `cards[].name` | `string` | Feature name |
| `cards[].desc` | `string` | One or two sentence description |

---

### `codeDemo` — Split Code Demo Section

Left side: copy + bullet list. Right side: an animated terminal window.

```ts
codeDemo: {
  visible: true,
  label: 'QUICK START',
  heading: 'From zero to dashboard in under 30 seconds',
  body: '...',
  bullets: ['JWT auth context built in', ...],
  terminalLines: [
    { tokens: [{ text: '# Install and scaffold', color: 'muted' }] },
    {
      tokens: [
        { text: '$ ', color: 'muted' },
        { text: 'npx', color: 'primary' },
        { text: ' create-shortcut-next ', color: 'text' },
        { text: 'my-app', color: 'secondary' }
      ]
    },
    { blank: true, tokens: [] },   // empty line in the terminal
  ]
}
```

#### `TerminalLine` shape

Each entry in `terminalLines` is a line in the terminal. A line is made of tokens.

```ts
type TerminalLine = {
  tokens: TerminalToken[]
  blank?: true   // renders an empty line; tokens can be []
}

type TerminalToken = {
  text: string
  color?: 'muted' | 'primary' | 'secondary' | 'text'
}
```

| Color | Appearance |
| --- | --- |
| `'muted'` | Dimmed — for comments and prompts (`#`, `$`) |
| `'primary'` | Theme primary color — for commands (`npx`, `cd`) |
| `'secondary'` | Theme secondary color — for values and names |
| `'text'` | Default foreground — for flags, paths, and arguments |

Omitting `color` is equivalent to `'text'`.

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Section heading |
| `body` | `string` | Copy paragraph on the left side |
| `bullets` | `string[]` | Bullet-point list below the paragraph |
| `terminalLines` | `TerminalLine[]` | Lines rendered in the terminal window |

---

### `techStack` — Library Cards Grid

```ts
techStack: {
  visible: true,
  label: 'TECH STACK',
  heading: 'Eight libraries. One command.',
  subheading: '...',
  cards: [
    { role: 'FRAMEWORK', name: 'Next.js 15', desc: '...' },
  ],
  callout: 'Tailwind CSS v4 — zero-config utility classes'
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Section heading |
| `subheading` | `string` | Supporting subtitle below the heading |
| `cards[].role` | `string` | Small all-caps role label on the card |
| `cards[].name` | `string` | Library or technology name |
| `cards[].desc` | `string` | Description — why it is included |
| `callout` | `string` | Single highlighted callout line at the bottom |

---

### `whatYouGet` — File Tree + Included Items

Left side: an interactive file tree rendered in a terminal frame.
Right side: a checklist of included features.

```ts
whatYouGet: {
  visible: true,
  label: 'WHAT YOU GET',
  heading: 'A working app, not a starting point.',
  body: '...',
  terminalLabel: 'project structure',
  defaultExpandedIds: ['app', 'dashboard-group', ...],
  fileTree: [ /* TreeNode[] — see below */ ],
  includedItems: [
    { title: 'Login page', desc: '...' },
  ]
}
```

#### `TreeNode` shape

```ts
type TreeNode = {
  id: string          // unique identifier — also used in defaultExpandedIds
  name: string        // file or directory name as shown in the tree
  type: 'dir' | 'file'
  comment?: string    // inline comment shown after the name (→ description)
  children?: TreeNode[]  // only for directories
}
```

`defaultExpandedIds` is an array of `id` values that should be open when the page
first renders. Any id not in this array starts collapsed.

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Section heading |
| `body` | `string` | Supporting paragraph |
| `terminalLabel` | `string` | Label shown in the terminal frame header |
| `defaultExpandedIds` | `string[]` | IDs of tree nodes that start expanded |
| `fileTree` | `TreeNode[]` | Root-level nodes of the file tree |
| `includedItems` | `{ title, desc }[]` | Checklist items on the right side |

---

### `howItWorks` — Numbered Steps

```ts
howItWorks: {
  visible: true,
  label: 'HOW IT WORKS',
  heading: 'Interactive setup. Instant structure.',
  steps: [
    { number: 'STEP 01', title: 'Run the CLI', desc: '...' },
    { number: 'STEP 02', title: 'Choose your preset', desc: '...' },
    { number: 'STEP 03', title: 'Open your editor and ship', desc: '...' }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Section heading |
| `steps[].number` | `string` | Step label (e.g. `'STEP 01'`) |
| `steps[].title` | `string` | Step heading |
| `steps[].desc` | `string` | Step description |

Add or remove entries in `steps` — the component renders however many are provided.

---

### `stats` — Animated Number Counters

```ts
stats: {
  visible: true,
  items: [
    { animateTo: 9, suffix: '+', display: '0+', label: 'INTEGRATED PACKAGES' },
    { animateTo: 4, suffix: '',  display: '0',  label: 'BUILT-IN RBAC ROLES' },
    { animateTo: null, suffix: '', display: '<30s', label: 'TO RUNNING DEV SERVER' }
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `animateTo` | `number \| null` | Target number for the count-up animation. Set to `null` for non-integer values |
| `suffix` | `string` | Appended after the animated number (e.g. `'+'`, `'%'`, `'ms'`) |
| `display` | `string` | Starting display value before the animation runs (e.g. `'0+'`) |
| `label` | `string` | Label below the number |

When `animateTo` is `null`, the counter skips the animation and renders
`display` directly. Use this for values like `'<30s'` or `'99.9%'` that
cannot be counted to.

---

### `faq` — Accordion FAQ

```ts
faq: {
  visible: true,
  label: 'FAQ',
  heading: 'What developers ask first',
  items: [
    { question: '...', answer: '...' },
  ]
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Section heading |
| `items[].question` | `string` | Accordion trigger text |
| `items[].answer` | `string` | Expanded content — plain prose |

Add as many items as needed. Each renders as an accordion panel.

---

### `cta` — Final Call-to-Action

```ts
cta: {
  visible: true,
  label: 'GET STARTED',
  heading: 'Your next project starts here',
  body: '...',
  primaryBtn: {
    label: 'Copy Install Command',
    copiedLabel: 'Copied!',     // shown for 2 s after clicking
    command: 'npx create-shortcut-next'   // copied to clipboard on click
  },
  secondaryBtn: { label: 'View Documentation', href: '...' }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Section eyebrow |
| `heading` | `string` | Large animated heading (word-by-word reveal) |
| `body` | `string` | Supporting paragraph |
| `primaryBtn.label` | `string` | Primary button text |
| `primaryBtn.copiedLabel` | `string` | Text shown briefly after the command is copied |
| `primaryBtn.command` | `string` | Shell command copied to clipboard on click |
| `secondaryBtn.label` | `string` | Secondary button text |
| `secondaryBtn.href` | `string` | Secondary button URL |

---

### `footer` — Page Footer

```ts
footer: {
  visible: true,
  brand: { name: '.shortcut', desc: '...' },
  techBadges: ['Next.js 15', 'MUI v7', ...],
  templateLinks: [
    { label: 'Features', href: '#features' },
  ],
  resourceLinks: [
    { label: 'Getting Started', href: '...', external: true },
  ],
  getStarted: {
    heading: 'Run this in your terminal:',
    command: 'npx create-shortcut-next',
    note: 'No global install required.'
  },
  copyright: 'shortcut-next · MIT License',
  builtWith: 'Built with Next.js · Deployed on Vercel'
}
```

| Field | Type | Description |
| --- | --- | --- |
| `brand.name` | `string` | Product name in the footer logo area |
| `brand.desc` | `string` | One-sentence brand description |
| `techBadges` | `string[]` | Small tech-stack chips displayed in the brand column |
| `templateLinks` | `{ label, href }[]` | In-page anchor links (left column) |
| `resourceLinks` | `{ label, href, external }[]` | Documentation / resource links (middle column) |
| `getStarted.heading` | `string` | Heading above the install command box |
| `getStarted.command` | `string` | Shell command displayed in the footer terminal box |
| `getStarted.note` | `string` | Small note below the command |
| `copyright` | `string` | Copyright line at the very bottom |
| `builtWith` | `string` | "Built with" attribution line |

Set `external: true` on any `resourceLinks` entry to have it open in a new tab.

---

## Hiding a Section

Set `visible: false` on the section you want to remove:

```ts
installBanner: {
  visible: false,   // ← section will not render at all
  row1: [...],
  row2: [...]
}
```

Sections that are `visible: false`:
- Are not mounted in the DOM
- Leave no empty space
- Still need their data fields — the TypeScript type requires them

---

## Tips

- **Order is fixed.** Sections always appear in the order defined in
  `PlaceholderLandingPage.tsx`. The content file controls text and visibility
  only — not position.
- **No rebuild required.** The file is a plain TypeScript module imported at
  runtime. Saving it triggers the Next.js fast-refresh cycle and the page
  updates in the browser instantly.
- **The CTA heading is animated.** The `cta.heading` string is split
  word-by-word and each word slides up into view. Keep it short (≤ 8 words)
  for the best visual result.
- **Terminal tokens are composable.** A single terminal line can mix as many
  token colors as needed. Split one command across multiple tokens to highlight
  specific parts (flags, values, paths) in different colors.
- **Stats with `animateTo: null`** skip the count-up and show `display`
  directly. Use this for any value that is not a plain integer.
