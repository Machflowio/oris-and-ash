# CLAUDE.md

This file provides guidance to Claude Code when working on this project.

## Project

ORIS & ASH — a demo website for a fictional luxury perfume reseller 
brand. This is a pitch asset used to sell agency services to real 
perfume reseller businesses in Israel. Quality, polish, and attention 
to visual detail matter more than feature count or technical cleverness.

The site will be shown live to prospective clients. Every interaction 
should feel considered and premium. Jank, sloppy animations, or 
cut corners break the pitch.

**This is also the tech-stack template for future client work** in 
this segment — small luxury businesses, RTL languages, WhatsApp-first 
sales. The stack, file layout, conventions, and patterns documented 
below are the reusable baseline; the brand identity, copy, and 
business context are ORIS & ASH-specific and get swapped per client.

## Brand identity (ORIS & ASH demo)

- **Name:** ORIS & ASH
- **Angle:** Niche/rare/collector fragrance reseller — scarcity, 
  authenticity, insider culture
- **Tone:** Editorial, restrained, insider. Never salesy. Never 
  enthusiastic with exclamation marks. Never uses words like 
  "discover," "amazing," or "premium" directly.
- **Positioning line:** "Rare fragrances, sourced and authenticated. 
  For the ones who don't wear what everyone else does."

## Stack (the template)

### Web
- **Framework:** Next.js 16 (App Router) + TypeScript + Turbopack
- **Styling:** Tailwind CSS v4 (CSS-first config in `globals.css` 
  via `@theme`; no `tailwind.config.ts`)
- **Animation:** Framer Motion (component-level), GSAP + ScrollTrigger 
  (scroll-driven narrative), Lenis (smooth scroll)
- **i18n:** next-intl
- **Deployment:** Vercel

### Asset pipeline
- **Generation:** Kling 3.0 AI (text-to-video / image-to-video). 
  Prompts and reference frames live with the asset workflow, not 
  in this repo.
- **Output:** MP4 from Kling, typically 1080p, short loops 
  (~5s for the current hero smoke).
- **Post:** Optional color grade in DaVinci Resolve or CapCut. 
  Often skipped when the AI output is already on-brand.
- **Conversion for the scroll-scrub hero:** ffmpeg extracts the MP4 
  to a JPEG frame sequence (1080p + 720p variants) consumed by the 
  canvas-based scroll-scrub component. The MP4 itself is not shipped 
  to the browser.

### Asset hosting

For the ORIS & ASH demo, all assets live in `/public/` and are 
served by Vercel directly — total payload is small (~14 MB for the 
hero) and R2 isn't worth the setup cost. **For real client projects** 
with marketing-scale distribution, switch to **Cloudflare R2** and 
point the `NEXT_PUBLIC_HERO_FRAMES_BASE*` env vars at R2 URLs — no 
code changes required.

### Asset naming

- **Frame sequence directories:** `{section}-{descriptor}-frames-{height}p/` 
  (e.g. `hero-smoke-frames-1080p/`, `hero-smoke-frames-720p/`)
- **Frames inside a directory:** `frame-{nnn}.jpg`, zero-padded 
  to 3 digits, 1-indexed (`frame-001.jpg` … `frame-121.jpg`)
- **Posters:** `{section}-{descriptor}-poster.{ext}` 
  (e.g. `hero-smoke-poster.jpg`)
- **Future inline videos** (any non-scrubbed video added later): 
  `{section}-{descriptor}-{height}p.mp4`

### Explicitly NOT in the stack

- **Spline** — tried, runtime + WASM issues with Next 16 / Turbopack
- **React Three Fiber, Three.js** — overkill, no real-time 3D needed
- **Any browser-side WebGL** — all motion ships as pre-rendered video 
  or frame sequences
- **HTML5 `<video>` element for scroll-scrubbed content** — decoder 
  seek latency is unfixable even with all-I-frame MP4s; use frame 
  sequence + canvas (see "Hero rendering approach")
- **Component libraries:** Radix, shadcn/ui, Material UI, Chakra
- **CSS-in-JS**

Do not introduce new libraries without asking first.

## Design tokens (locked — do not change without discussion)

```
Colors:
  ink:      #0A0A0A   (primary background)
  bone:     #F5F1EA   (primary text, contrast surfaces)
  brass:    #8B6F47   (accents, CTAs, dividers, hover states)
  elevated: #1C1C1C   (cards, elevated sections)
  gold:     #D4AF37   (rare drop badges only — use sparingly)

Ratio rule: ~70% ink, ~25% bone, ~5% brass/gold accents.
```

### Typography

Per-locale font loading via `next/font/google`. Only load fonts 
needed for the active locale.

| Locale | Display          | Body                  | Mono           |
|--------|------------------|-----------------------|----------------|
| en     | Fraunces         | Inter                 | JetBrains Mono |
| he     | Frank Ruhl Libre | Assistant             | JetBrains Mono |
| ar     | Amiri            | IBM Plex Sans Arabic  | JetBrains Mono |

Mono is used for: labels, SKUs, prices, "LOT 001" style tags, and 
anything that should read as technical/archival.

(Noto Serif Arabic was the original spec but isn't in 
`next/font/google`'s registry; Amiri is the listed fallback.)

## Internationalization

Template default (and ORIS & ASH demo): **3 locales — `en`, `he`, 
`ar`**. English is LTR, Hebrew + Arabic are RTL. For other client 
projects, adjust `src/i18n/routing.ts` to the locales they need.

- **Routing:** `/en/`, `/he/`, `/ar/` — default locale detection 
  via Accept-Language header
- **Direction:** `<html>` must set `lang` and `dir` dynamically based 
  on locale (handled in `[locale]/layout.tsx`)
- **CRITICAL:** Use Tailwind logical properties only. Never use 
  `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`, `left-`, 
  `right-`. Always use `ms-`, `me-`, `ps-`, `pe-`, `text-start`, 
  `text-end`, `start-`, `end-`. These flip automatically in RTL.
- **Translation scope:** all visible UI text is translated through 
  next-intl. Intentional exceptions: brand wordmark ("ORIS & ASH"), 
  product names + maison names (perfume convention — they stay in 
  their canonical Latin form across locales), universal symbols and 
  units (`ml`, `₪`, `·`, `LOT`, numerical counts), and locale 
  switcher labels (each shown in its own native script: "EN" / 
  "עב" / "ع").
- **Hebrew copy is a draft** and flagged with a `_review` key in 
  `he.json`. It needs native speaker review before any pitch. Do not 
  remove the `_review` key.
- **Arabic copy** is from a fluent speaker and can be trusted.

## Animation principles

This site is luxury, not playful. Respect these rules:

- No bounces, no spring overshoots, no scale-up-then-down
- No exclamation-mark energy — everything is restrained
- Default easing: `ease-out` or custom cubic-bezier favoring slow 
  settles (e.g. `[0.16, 1, 0.3, 1]`)
- Default duration: 400-800ms for entrance, 200-300ms for hover
- Stagger child elements when appropriate — 60-100ms between items
- Scroll-triggered animations should feel earned, not trigger happy
- On mobile, reduce animation intensity (respect `prefers-reduced-motion`)

## Hero rendering approach

The hero centerpiece is a Kling-generated MP4, extracted to a JPEG 
frame sequence and scrubbed against scroll. The implementation lives 
in `src/components/hero/HeroScrollScrub.tsx`.

**Why frame sequence and not `<video>`:** scroll-scrubbing a `<video>` 
element via `currentTime` is choppy on most browsers (decoder seek 
latency), even with all-I-frame encoding. JPEG frames preloaded into 
memory and drawn to a canvas via `drawImage` is the production 
pattern (Apple, Stripe, etc.) and feels buttery.

Rules:

- **Format:** JPEG frame sequence (1080p desktop, 720p mobile), 
  ~120 frames for a 5-second hero loop
- **Display:** `<canvas>` at viewport size with `devicePixelRatio` 
  for retina sharpness; `drawImage` per scroll tick with cross-fade 
  between adjacent frames to mask discrete-frame stepping
- **Scrub driver:** GSAP ScrollTrigger (`scrub: true`) tweens a 
  fractional frame index across scroll progress. Lenis is wired into 
  `gsap.ticker` and forwards scroll to `ScrollTrigger.update` so the 
  scrub stays in sync with smooth scroll.
- **Preload:** all frames loaded on mount and primed via 
  `Image.decode()` so the first scrub never blocks on decode
- **Poster:** drawn to the canvas as a temporary frame 0 while the 
  sequence preloads — the hero must never look empty
- **Fixed positioning:** the canvas is `position: fixed` so it acts 
  as a backdrop that follows the user; opaque sections that come 
  after cover it as they scroll in
- **Mobile:** smaller frame variant via 
  `NEXT_PUBLIC_HERO_FRAMES_BASE_MOBILE`, swapped at the 768px 
  breakpoint
- **RTL:** the frame sequence renders as-is in every locale — the 
  bottle's orientation never flips. Only text and layout flow respond 
  to `dir` (via Tailwind logical properties). The gradient overlay is 
  biased toward the text's start side so the headline stays readable 
  even when it overlaps the bottle area in RTL.
- **Accessibility:** canvas is `aria-hidden`; `prefers-reduced-motion` 
  skips the preload + scrub entirely and just shows the poster

Asset URLs are environment variables so they can be swapped per 
environment or per client without code changes:

```
NEXT_PUBLIC_HERO_FRAMES_BASE          # desktop frames base URL
NEXT_PUBLIC_HERO_FRAMES_BASE_MOBILE   # mobile frames base URL
NEXT_PUBLIC_HERO_FRAME_COUNT          # total frame count (e.g. 121)
NEXT_PUBLIC_HERO_POSTER_URL           # poster image URL
```

In dev, defaults point at `/videos/hero-smoke-frames-1080p/`, 
`/videos/hero-smoke-frames-720p/`, and `/videos/hero-smoke-poster.jpg` 
so the component works without an `.env.local`.

## File structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        # sets lang, dir, fonts per locale
│   │   └── page.tsx          # home
│   └── globals.css           # Tailwind v4 imports + @theme tokens
├── components/
│   ├── hero/                 # canvas scroll-scrub hero + content overlay
│   ├── products/             # product grid, cards, detail (planned)
│   ├── quiz/                 # scent finder (planned)
│   ├── shared/               # nav, footer, locale switcher
│   ├── ui/                   # primitive UI primitives (planned)
│   └── providers/            # Lenis + GSAP provider
├── i18n/
│   ├── routing.ts            # next-intl defineRouting + locale helpers
│   ├── request.ts            # per-request message loading
│   └── messages/             # en.json, he.json, ar.json
├── lib/
│   ├── fonts.ts              # per-locale font loaders
│   └── utils.ts              # cn() and friends
├── data/                     # JSON catalog (planned; upgrade to
│                             # Sanity/Shopify only when a real client
│                             # signs and needs it)
└── proxy.ts                  # next-intl locale detection
                              # (Next 16: middleware.ts → proxy.ts)
```

## Conventions

- **TypeScript strict mode** — no `any`, no suppressions
- **Server components by default**; `"use client"` only when needed 
  (hooks, event handlers, Framer Motion, Lenis, canvas drawing, 
  scroll listeners)
- **Co-locate** component styles, animations, and types with the 
  component file
- **Keep components under ~150 lines** — split if growing past that
- **Use `cn()` utility** (from clsx/tailwind-merge) for conditional 
  classes
- **Image optimization:** Next.js `<Image>` for static images. Hero 
  uses canvas + frame sequence (not `<Image>`, not `<video>`).

## What to NOT do

- Do not install component libraries (Radix, shadcn, MUI, Chakra)
- Do not add real e-commerce checkout (Shopify embed comes later 
  per real client)
- Do not build auth, admin dashboard, or CMS integration for the 
  demo
- Do not use emoji in UI copy (breaks the luxury register)
- Do not add exclamation marks anywhere in copy
- Do not use `text-center` for body text (editorial feel = left/start aligned)
- Do not suggest refactors, architectural rewrites, or "cleaner" 
  approaches unless I ask
- Do not introduce browser-side 3D libraries (Three.js, R3F, Spline) 
  — all motion ships as pre-rendered video or frame sequences
- Do not use `<video>` for scroll-scrubbed content — decoder seek 
  latency is the bottleneck. Frame sequence + canvas is the only 
  reliable answer.
- Do not double-smooth scroll inputs — if both Lenis and a 
  downstream animation library smooth the same scroll, the result 
  lags input visibly. Lenis owns the smoothness; downstream tools 
  should follow scroll position 1:1 (`scrub: true`, not `scrub: 1`).

## Known traps (lessons that already cost time)

These are non-obvious and worth memorizing.

- **Lenis must drive ScrollTrigger.** Wire Lenis's rAF to 
  `gsap.ticker` (`gsap.ticker.add(time => lenis.raf(time * 1000))`) 
  and forward Lenis scroll events to ScrollTrigger 
  (`lenis.on("scroll", ScrollTrigger.update)`). Without this, scrub 
  animations feel laggy because smoothing happens in two layers.
- **Negative `z-index` disappears behind body bg.** A `position: 
  absolute` child at `-z-10` whose parent is just `position: 
  relative` (no explicit z-index) does *not* form a stacking context, 
  and the child paints behind the body's background-color. For 
  backdrop-style positioning, use `position: fixed` (creates its own 
  stacking context) at `z-0` and put overlay content at `z-10`.
- **Next 16 renamed `middleware.ts` → `proxy.ts`.** Functionality 
  identical; just the file name and named export changed. 
  `middleware.ts` is deprecated.
- **Next 16 made `params` async.** Page/layout `params` is 
  `Promise<{...}>` — must `await` it. `cookies()` and `headers()` 
  are also async.
- **`next/font/google` quirks:**
  - **Variable fonts** (Fraunces, Inter, JetBrains Mono, Frank Ruhl 
    Libre, Assistant) — omit `weight` to use the variable axis
  - **Static fonts** (Amiri, IBM Plex Sans Arabic) — must specify 
    `weight: [...]`
  - The `display` prop must be the literal `"swap"`. The shorthand 
    `display` (when a `const display = "swap"` is in scope) breaks 
    next/font's static analyzer.
  - Noto Serif Arabic is NOT in the registry; Amiri is the listed 
    fallback.
- **Tailwind v4 has no `tailwind.config.ts` by default.** Theme 
  tokens (colors, font variables) go in `globals.css` via `@theme {}` 
  and `@theme inline {}`. Use `@theme inline` for variables you'll 
  inject from elsewhere (like `next/font` classNames) so Tailwind 
  doesn't generate a default `:root` rule that conflicts.
- **Spline + Next 16 + Turbopack don't play nice.** WASM dynamic 
  imports fail silently. Don't reach for browser 3D as a fallback 
  for anything; we ship frame sequences instead.

## Business context (ORIS & ASH demo)

- **Target market:** Israeli perfume resellers (5 warm leads, all 
  currently Instagram-only, primarily use WhatsApp for sales)
- **Currency:** ILS (₪), approximately 400–2,500 ₪ range for fake 
  products
- **WhatsApp integration:** Use `wa.me` deep links with prefilled 
  messages. No WhatsApp Business API.
- **Pricing anchor for fake products:** Use "LOT 001", "LOT 002" 
  naming. Include "bottles remaining" counters on some products 
  to reinforce scarcity.

## How to work with me

- Ask clarifying questions before writing code when the spec is 
  ambiguous
- Make the call on trivia (exact timing, small breakpoint values) 
  and note what you chose — don't block
- Explain non-obvious choices in a one-line comment or in chat
- When a task is done, stop and tell me what to test before moving on
- If I'm about to overbuild, say so. If I'm wrong about a tech 
  decision, push back with reasoning.
- Assume I can code. Give me architecture and tradeoffs, not 
  tutorials.
- Prefer the scrappy-but-solid version over the perfect version.

## Current build status

**Built so far:**
- Project foundation (Next 16, TypeScript, Tailwind v4, App Router, 
  Turbopack)
- i18n scaffold: en/he/ar locales, RTL support, per-locale Google 
  fonts, locale switcher, `Accept-Language` redirect
- Smooth scroll: Lenis wired to GSAP ticker + ScrollTrigger
- Canvas-based scroll-scrub hero with JPEG frame sequence (1080p / 
  720p variants), cross-fade interpolation, RTL flip, reduced-motion 
  handling
- Nav with locale switcher
- Hero text overlay (label, headline with italic emphasis, CTA, 
  scroll hint) with Framer Motion entrance animation
- Collection placeholder section (transparent, hero scene continues 
  through it)

**Next up:**
- Product grid + cards + WhatsApp deep links

**No fixed timeline.** Depth and polish over speed. Don't skip ahead 
to later sections; finish current work to a high level first.
