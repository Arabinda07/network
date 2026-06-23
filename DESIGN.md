---
name: Sanctuary
description: A personal CRM and relationship reflection space
colors:
  botanical: "oklch(0.47 0.18 135)"
  sky: "oklch(0.54 0.16 245)"
  honey: "oklch(0.59 0.13 80)"
  clay: "oklch(0.53 0.13 35)"
  paper: "oklch(0.985 0.012 135)"
  sage: "oklch(0.965 0.022 135)"
  on-surface: "#252525"
typography:
  display:
    fontFamily: "\"Manrope\", ui-sans-serif, system-ui, sans-serif"
    fontWeight: "800"
  sans:
    fontFamily: "\"Manrope\", ui-sans-serif, system-ui, sans-serif"
    fontWeight: "700"
  serif:
    fontFamily: "\"Spectral\", ui-serif, Georgia, serif"
    fontWeight: "400"
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  full: "9999px"
---

# Design System: Sanctuary

## 1. Overview

**Creative North Star: "The Digital Greenhouse"**

Sanctuary is designed as a calm, reflective space for maintaining personal relationships. It embraces organic shapes, a sophisticated earth-toned palette, and distinct typographic pairing to create a sense of focused, quiet introspection. Rather than looking like a generic SaaS CRM, the interface relies on generous whitespace and soft, warm hues reminiscent of an arboretum or notebook. Dark mode creates an intimate, starlit ambiance without sacrificing clarity.

**Key Characteristics:**
- **Organic and Grounded.** Heavily utilizing natural color names (botanical, sage, clay, honey) alongside soft shapes.
- **Reflective Tone.** High focus on journaling, memory capture, and unhurried interactions.
- **Typographic Depth.** Strong structural contrast between heavy sans-serif display text and elegant, readable serif body text.
- **Subtle Layering.** Uses depth, outlines, and dashed borders instead of heavy drop shadows to define boundaries.

## 2. Colors

The palette is rooted in terrestrial textures. The dark mode maintains warmth, dimming the intense saturation in favor of rich, shadow-like neutral tones.

### Primary
- **Botanical** (oklch(0.47 0.18 135)): The primary verdant accent used for dominant CTAs, selection rings, and meaningful interface focus states. 

### Secondary
- **Sky** (oklch(0.54 0.16 245)): Used for specific workflow sections or refreshing highlights, like the "Winter Audit".
- **Honey** (oklch(0.59 0.13 80)): A warm glow used for context hooks and warnings. 
- **Clay** (oklch(0.53 0.13 35)): Provides error emphasis and destructive state awareness without being a harsh traffic-light red.

### Neutral
- **Paper** (oklch(0.985 0.012 135) / dark: 20% lightness): The foundational surface color for resting pages, exuding subtle tint.
- **Sage** (oklch(0.965 0.022 135) / dark: 25% lightness): Sub-surface variant to highlight cards or inputs against the paper background.
- **On-Surface** (#252525 / dark: 95% lightness): High-contrast typography and deep interface elements.

## 3. Typography

**Display Font:** Manrope (with system-ui)
**Body Font:** Spectral (with Georgia)

**Character:** A sharp contrast between the structural, dense, tracking-tight appearance of Manrope for headers and the flowing, sophisticated, classical tone of Spectral for body text.

### Hierarchy
- **Display** (800, clamp/large, tight tracking): Used uniquely as page headers and primary entry points to give immediate structural anchor.
- **Title / Form Labels** (700, sans-serif): Strict, uppercase tracking for form tags, metadata, and structural headers.
- **Body** (400, serif, relaxed line-height): The main reading experience. Used for journaling notes, hook descriptions, and deep reading to give a literary, thoughtful vibe.

## 4. Elevation

Sanctuary does not employ heavy geometric shadows to achieve depth. Rather, sections are demarcated by flat-styled rounded containers with subtle 1px transluscent borders (`border-black/5` or `border-black/10`).

### Shadow Vocabulary
- **None/Flat:** Default resting state for cards and blocks.
- **Layering Borders:** Defines container groups.
- **Subtle Shadow:** A delicate `shadow-sm` or `shadow-md` is only used when items must clearly float (like floating UI, context taggers, or sticky action bars), or gently applied to focused primary buttons.

## 5. Components

### Buttons
- **Shape:** Softly curved (12px or 16px radius, occasionally fully rounded for icon buttons).
- **Primary:** Filled Botanical to draw eye, using contrasting light text.
- **Hover / Focus:** Clear focus rings outline the action; slight background darkening. 

### Cards / Containers
- **Corner Style:** Large, organic border radii (`rounded-[24px]` to `rounded-[32px]`) for a welcoming card aesthetic.
- **Background:** Usually flat, matching a sub-surface layer.
- **Border:** Occasional dashed borders for empty state indicators; solid subtle borders for filled information blocks.
- **Internal Padding:** Scaled generously to let the Spectral body font breathe.

### Inputs / Fields
- **Style:** Understated and deeply embedded. Text areas for "Reflections" completely drop outer borders and rely solely on focus rings and spacing to define input boundaries. 

### Navigation
- **Style:** Compact top bar navigation.
- **Active State:** Subtly heavy underline highlighting the current page.

## 6. Do's and Don'ts

### Do:
- **Do** favor ample white space over grid cramping; memory capture needs breathing room.
- **Do** use the established color scope layers for cards to provide subtle visual variety without chaos.
- **Do** ensure every interactive element clearly displays focus and hover feedback (e.g. `focus-visible:ring-2`, `hover:bg-black/5`).
- **Do** use the dark mode toggle to adjust the ambiance immediately via `.dark` toggling. 

### Don't:
- **Don't** use standard SaaS blue gradients or corporate illustrations. Retain the personal, quiet identity of the app.
- **Don't** apply massive dropshadows where flat borders or layer backgrounds will suffice.
- **Don't** use sans-serif fonts for long-form reflections. Writing should remain in the `serif` designated layer for a literary touch.
- **Don't** introduce hard 0px layout edges; use the rounded variables on distinct segments.
