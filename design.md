# Design System — Antisocial

## 1. Visual Theme & Atmosphere
Balanced-density app UI (4/10), not gallery-airy, not cockpit-dense. Symmetric layout, restrained motion. Near-neutral cool palette carried by a single terracotta accent. Serif appears only in editorial/fanfare spots, sans everywhere functional. Flat, shadow-tinted surfaces, consistent 8px radius family.

## 2. Color Palette & Roles
(OKLCH tokens converted to hex. One accent, sat < 80%. No pure black.)

**Light mode**

- **Paper** — `#f7f8f9` — `--background`
- **Ink** — `#191b1e` — `--foreground`
- **Card Surface** — `#ffffff` — `--card`, `--popover`
- **Terracotta** — `#d24730` — `--primary`, `--destructive`, `--ring`, `--chart-1`
- **Terracotta Soft** — `#e68172` — `--chart-3`
- **Cool Gray** — `#838a93` — `--muted-foreground`
- **Faint Line** — `#dfe2e5` — `--border`, `--input`
- **Tinted Fill** — `#f0f2f3` — `--secondary`, `--accent`

**Dark mode**

- **Deep Slate** — `#131416` — `--background`
- **Pale Text** — `#edeef0` — `--foreground`
- **Elevated Card** — `#1b1d20` — `--card`, `--popover`
- **Terracotta** — `#d24730` — `--primary`, `--destructive`, `--ring`, `--chart-1` (same value both modes)
- **Cool Gray** — `#6a6f77` — `--muted-foreground`
- **Faint Line** — `#2b2e32` — `--border`, `--input`
- **Tinted Fill** — `#24262a` — `--secondary`, `--accent`

## 3. Typography
- Body `DM Sans`, 65ch prose width is fine; tracking −0.025em globally.
- Display `DM Serif Text` — decorative/editorial only, never dashboards.
- Code/meta `DM Mono`.
- Notebook-style accents use `Architects Daughter` (`--font-notebook`).

## 4. Component Stylings
- Buttons/Cards/Inputs: Tailwind class semantics (`bg-primary`, `text-primary-foreground`), never arbitrary values.
- Primary/accent states use Terracotta with matching `-foreground`; hovers swap `bg` + text as a pair.
- Radius tokens: `--radius-sm` = 4px, `--radius` = 8px, `--radius-lg`/`md`/`xl`/`2xl`/`3xl`/`4xl` derive from it.
- Shadows: soft, tinted to surface hue, small blur (0.5rem light / 0.6rem dark), no outer glow.

## 5. Layout Principles
- 3-column: left sidebar 18rem (`--width-sidebar-left: spacing-72`), right sidebar 20rem (`spacing-80`).
- Content columns min-width 320px (`--min-width-col`); side content capped at 420px (`--max-width-col-side`) or 30%.
- Page max-width 100rem, centered.
- Tailwind spacing base 0.25rem (`--spacing`).

## 6. Responsive
- Single-column collapse below 768px, all 3 columns stack, no horizontal scroll.
- Touch targets ≥ 44px.

## 7. Anti-Patterns
- No arbitrary Tailwind values (`text-[14px]`) — tokens only.
- Never pair a `bg-*` without its matching `-foreground`.
- No purple/neon gradients; one accent only (Terracotta).
- No pure black `#000000`; dark surfaces are `#131416`.
- No overriding radius/shadow/tracking with raw CSS values — always the token.
