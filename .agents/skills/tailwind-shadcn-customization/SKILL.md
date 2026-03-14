---
name: tailwind-shadcn-customization
description: "Enforce Tailwind CSS and shadcn/ui styling rules: ban arbitrary values, ensure foreground/background contrast in all states including hover, and use only design-token-based classes."
---

# tailwind-shadcn-customization

## Purpose

Enforce consistent, accessible, and maintainable styling across the antisocial codebase by preventing arbitrary Tailwind values and guaranteeing foreground/background color contrast in every visual state.

## Rules

### Rule 1: No Arbitrary Values

**NEVER use arbitrary value syntax** (square bracket notation) in Tailwind classes. Every value must come from the design system's defined scale or custom theme tokens.

#### ❌ Forbidden patterns

```
text-[11px]       text-[0.875rem]   text-[14px]
w-[300px]         h-[48px]          p-[7px]
m-[13px]          gap-[6px]         top-[50%]
rounded-[5px]     opacity-[0.85]    leading-[1.3]
tracking-[0.02em] max-w-[640px]     min-h-[100dvh]
bg-[#1a1a1a]      text-[hsl(0,0%,50%)]
border-[2px]      shadow-[0_4px_8px_rgba(0,0,0,0.1)]
translate-x-[50%] duration-[250ms]
```

#### ✅ Required alternatives

| Instead of | Use |
|---|---|
| `text-[11px]`, `text-[0.625rem]` | `text-2xs` (custom token defined in `globals.css`) |
| `text-[12px]` | `text-xs` |
| `text-[14px]` | `text-sm` |
| `text-[16px]` | `text-base` |
| `text-[18px]` | `text-lg` |
| `w-[300px]` | `w-72` or `w-80` (nearest scale value) |
| `h-[48px]` | `h-12` |
| `p-[7px]` | `p-2` (8px) or `p-1.5` (6px) |
| `gap-[6px]` | `gap-1.5` |
| `rounded-[5px]` | `rounded` or `rounded-md` |
| `max-w-[640px]` | `max-w-xl` or `max-w-2xl` |
| `opacity-[0.85]` | `opacity-80` or `opacity-90` |
| `bg-[#1a1a1a]` | A design token like `bg-card` or `bg-muted` |
| `duration-[250ms]` | `duration-200` or `duration-300` |

#### When exact values are truly needed

If the design system scale does not cover a required value, **extend the theme in `globals.css`** under `@theme inline` instead of using an arbitrary value inline:

```css
/* globals.css — @theme inline block */
--font-size-2xs: 0.625rem;          /* already defined */
--spacing-sidebar-left: var(--spacing-72);
--max-width-layout: 100rem;
```

Then use the token in components:

```tsx
// ✅ Uses the custom token
<div className="max-w-layout">
```

### Rule 2: Foreground/Background Contrast

Every element that sets a **background color** must pair it with a **foreground (text) color** that has sufficient visual contrast. This applies to:

- Default (resting) state
- Hover state
- Focus state
- Active/pressed state
- Disabled state (if visually distinct)

#### The Pairing Principle

The design system defines paired semantic tokens. **Always use the matching pair:**

| Background | Foreground |
|---|---|
| `bg-background` | `text-foreground` |
| `bg-card` | `text-card-foreground` |
| `bg-popover` | `text-popover-foreground` |
| `bg-primary` | `text-primary-foreground` |
| `bg-secondary` | `text-secondary-foreground` |
| `bg-muted` | `text-muted-foreground` |
| `bg-accent` | `text-accent-foreground` |
| `bg-destructive` | `text-destructive-foreground` |
| `bg-sidebar` | `text-sidebar-foreground` |
| `bg-sidebar-primary` | `text-sidebar-primary-foreground` |
| `bg-sidebar-accent` | `text-sidebar-accent-foreground` |

#### ❌ Broken contrast examples

```tsx
// WRONG: primary background with no foreground set (inherits parent text color)
<div className="bg-primary">Click me</div>

// WRONG: background token mismatched with unrelated foreground
<div className="bg-primary text-muted-foreground">Click me</div>

// WRONG: hover changes background but doesn't update text color
<button className="bg-secondary text-secondary-foreground hover:bg-primary">
  Submit
</button>
```

#### ✅ Correct contrast examples

```tsx
// Correct pair
<div className="bg-primary text-primary-foreground">Click me</div>

// Correct hover pair
<button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
  Submit
</button>

// Correct with opacity modifier (same token family — contrast preserved)
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</button>

// Correct ghost pattern (no resting bg → hover adds both bg and text)
<button className="hover:bg-accent hover:text-accent-foreground">
  Ghost
</button>
```

#### Opacity Modifiers Are Safe Within the Same Token

Using an opacity modifier like `hover:bg-primary/90` on the **same** background token is acceptable because the contrast ratio decreases only marginally. Do NOT cross token families with opacity (e.g., `hover:bg-secondary/80` while text remains `text-primary-foreground`).

#### Rules for Hover States

1. **Same-token opacity is fine:** `bg-primary hover:bg-primary/90` — no text change needed.
2. **Cross-token hover requires both:** if hover switches the background to a different semantic token, the hover must ALSO switch the foreground.
3. **Ghost/transparent resting state:** if the element has no resting background, the hover state must set **both** `hover:bg-*` and `hover:text-*-foreground`.

### Rule 3: Border & Ring Contrast

When applying `border` or `ring` classes, use the design system tokens:

```tsx
// ✅ 
<div className="border border-border" />
<input className="border border-input ring-ring" />

// ❌
<div className="border border-[#ccc]" />
<input className="border border-gray-300" />
```

## Quick Reference Checklist

Before writing or reviewing any `className`:

- [ ] **No square brackets** — zero arbitrary values (`[...]`) in any Tailwind class
- [ ] **Background has foreground** — every `bg-*` is paired with a matching `text-*-foreground`
- [ ] **Hover contrast holds** — if `hover:bg-*` changes tokens, `hover:text-*-foreground` is also set
- [ ] **Same-token opacity only** — opacity modifiers stay within the same semantic token family
- [ ] **Ghost elements are paired** — `hover:bg-accent` always comes with `hover:text-accent-foreground`
- [ ] **Borders use tokens** — `border-border`, `border-input`, not arbitrary hex or scale colors
- [ ] **Custom values go in theme** — if a value isn't in the scale, add it to `@theme inline` in `globals.css`

## Project-Specific Tokens

This project uses Tailwind CSS v4 with `@theme inline` in `src/app/globals.css`. Key custom tokens already defined:

| Token | Value | Usage |
|---|---|---|
| `text-2xs` | `0.625rem` (10px) | Smallest text size allowed |
| `max-w-layout` | `100rem` (1600px) | Main layout max-width |
| `spacing-sidebar-left` | `--spacing-72` | Left sidebar width |
| `spacing-sidebar-right` | `--spacing-80` | Right sidebar width |
| `tracking-super-wide` | `0.2em` | Extra-wide letter spacing |
| `font-notebook` | Architects Daughter | Notebook-style font |

## Color System

Colors use OKLCH in `globals.css` with full light/dark mode support via `next-themes`. The `.dark` class toggles all semantic tokens. The shadcn/ui `new-york` style is used with `neutral` base color.
