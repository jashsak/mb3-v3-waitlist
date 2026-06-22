# Material Bank V3 — Waitlist Hero

A responsive launch/waitlist hero for Material Bank V3, built from the
[Figma design](https://www.figma.com/design/DK4wOOacfNKaT1EL1IkorA/MaterialBank-Website?node-id=649-10731).

The hero reads as a desk-by-the-window at **dusk**. When a visitor joins the
waitlist, the input morphs into a success state and — a moment later — the whole
scene **breaks into daylight**.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **[`@material-bank/mb3-components`](https://github.com/Material-Bank/mb3-components)** — the shared base component library. The glass `InputGroup` / `Button` here are *modified variants* built on top of these base components and the mb3 design tokens.
- **`motion`** (v12) for the spring-first load-in and scene transitions.

## Getting started

```bash
npm install   # requires access to the @material-bank GitHub Packages registry
npm run dev    # http://localhost:5173
npm run build  # type-check + production build
```

> `@material-bank/mb3-components` is published to GitHub Packages. Authentication
> is read from your user-level `~/.npmrc` (`@material-bank:registry=https://npm.pkg.github.com`).

## How it works

| Concern | Where |
| --- | --- |
| Scene state machine (`night` → submit → `day`) | `src/App.tsx` |
| Composition, layout, motion storyboard | `src/components/Hero.tsx` |
| Scene copy + background sources | `src/lib/scene.ts` |
| Modified glass `InputGroup` / submit button | `src/components/glass/glass-input-group.tsx` |
| Wordmark + V3 badge | `src/components/Wordmark.tsx` |
| Social-proof avatar cluster | `src/components/WaitlistAvatars.tsx` |
| Design tokens + glass/scene CSS variables | `src/index.css` |

### Layout strategy

- **Desktop (wide):** a `1440×913` "poster stage" is scaled to cover the viewport
  so the live UI overlay stays pixel-locked to the photographic background — matching the Figma frame exactly.
- **Mobile / portrait:** a reflowed full-bleed layout (stacked copy, full-width pill, bottom frosted band).

### The glass effect

Taken straight from the Figma `Hero`:

- A full-width **frosted band** over the lower third — `backdrop-blur(16px)` on a
  `rgba(24,15,7,0)` → `rgba(31,18,11,0.5)` gradient.
- The **pill** is a flat `rgba(255,255,255,0.2)` fill (the band behind supplies the
  blur), with a hairline border and a top catchlight for the liquid-glass rim.

### Motion

Spring-first entrances (overshoot-free), a settling background (scale + de-blur),
and a slow dawn cross-fade with a warm light sweep. Honors `prefers-reduced-motion`.

## Assets

Background photos live in `public/scene/` (`night.webp`, `day.webp`).

They're produced by `scripts/optimize-bg.mjs` (Lanczos resize + unsharp mask →
WebP). For the sharpest result, export the two frames from Figma at **2x or 3x**,
drop them in `scripts/src/` as `night.png` and `day.png`, and run:

```bash
node scripts/optimize-bg.mjs
```

If no hi-res source is present it falls back to the original 1024px exports
(upscaled + sharpened). Avatars in `src/lib/scene.ts` are currently placeholders.
