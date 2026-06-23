# Sanctuary Editorial Design System

This document serves as the single source of truth for the Sanctuary visual identity and component architecture. All UI elements across the application must strictly adhere to these rules to maintain a cohesive, "Editorial" aesthetic.

## 1. Core Philosophy: The Editorial Aesthetic

Sanctuary is designed to feel like a high-end, thoughtfully curated magazine or personal journal. It avoids the cluttered, hyper-technical feel of traditional SaaS dashboards. 

*   **Content is King:** The data (people, notes, reflections) drives the form.
*   **Progressive Disclosure:** Secondary actions (edit, delete, share) are hidden until needed (e.g., revealed on hover or within focused views).
*   **Generous Negative Space:** Elements need room to breathe. Avoid dense, cramped layouts.
*   **High Contrast, Low Noise:** Use typography and whitespace for hierarchy, not a dozen varying shades of gray or heavy drop shadows.

## 2. Typography

We use an intentional pairing of Serif and Sans-Serif to evoke an editorial feel.

*   **Display & Primary Headings (`font-display` / `font-extrabold` / `tracking-tight`):**
    *   *Usage:* Page titles, large quotes, prominent contact names.
    *   *Styling:* Serif or specific display font provides elegance and a traditional reading experience. Often used with italics for quotes or meta-text. `max-w-3xl` max width usually. `text-4xl md:text-5xl leading-[0.98]`.
*   **Body & UI Text (`font-sans` / `font-serif`):**
    *   *Usage:* Navigation, button labels, descriptions, long-form reading text.
    *   *Styling:* Clean, legible `font-serif text-lg leading-relaxed` for paragraphs. `font-sans` for technical/actionable text like buttons.
*   **Meta & Microcopy (`text-[11px] font-bold uppercase tracking-widest`):**
    *   *Usage:* Timestamps, tags, small status indicators.
    *   *Styling:* Highly tracked (wide letter spacing), uppercase, usually faded (`text-on-surface/40`).

## 3. Color Palette

The palette is rooted in nature and high-contrast editorial print.

*   **Backgrounds (`--background`):** 
    *   Light mode: A warm, pristine paper-like off-white (`#fcfcfc`).
    *   Dark mode: A deep, rich, low-contrast charcoal/black (`#0a0a0a`).
*   **Surfaces (`--surface-bg`):**
    *   Slightly elevated paper colors to separate cards from the background without using heavy drop shadows. (`#f5f5f4` light, `#121212` dark).
*   **Text (`--foreground` / `text-on-surface`):**
    *   High contrast against backgrounds (`#0a0a0a` on light, `#fcfcfc` on dark).
    *   Use opacity for hierarchy: `text-on-surface` (primary), `text-on-surface/70` (secondary), `text-on-surface/40` (tertiary/meta).
*   **Accent (`botanical`):**
    *   An earthy, sage-inspired green (`#275239`). Used sparingly for primary actions, active states, and quiet highlights.

## 4. Spacing & Rhythm

*   **Page Margins:** Generous horizontal padding on the main container (`px-6 md:px-12`).
*   **Vertical Rhythm:** Open line heights (`leading-relaxed`) and significant spacing between sections (`space-y-12` or `mt-12`).
*   **Card Padding:** Ensure cards and containers have ample internal padding (at least `p-6`).

## 5. Component Patterns

### Borders & Shadows
*   **Borders over Shadows:** Rely on crisp, 1px borders (`border-border-subtle` or `border-border-medium`) to delineate areas, rather than soft drop shadows. This reinforces a flat, print-like aesthetic.
*   **Subtle Hover States:** Cards can gently change border color (e.g., `hover:border-botanical`) or surface background (`hover:bg-surface-hover`) on hover instead of lifting up with a shadow.

### Buttons & Interactive Elements
*   **Primary Actions:** Solid, muted background with contrasting text (e.g., `bg-on-surface text-white` or `bg-botanical text-white`). 
*   **Secondary Actions:** Pill shapes or subtle backgrounds (`bg-black/5` or `bg-border-subtle`).
*   **Hidden Actions:** Action buttons inside lists or tables should fade in on group hover (`opacity-0 group-hover:opacity-100`). Keep them out of view until the user inspects the item.

### Lists & Activity Logs
*   **Timeline over Table:** Replace dense tabular data with vertically rhythm-ed timelines or conversational lists.
*   **Avatars:** Use typographic avatars (the contact's initial in a beautiful display font) rather than generic user icons.

## 6. Layout Directives
*   **Max Width Constrained:** Main reading columns should rarely exceed `max-w-4xl` to maintain comfortable line lengths. The wrapper should be `main class="max-w-4xl mx-auto px-6 md:px-12 mt-8 md:mt-12 space-y-16 pb-24"`.
*   **Top Navigation:** Keep it scannable, horizontally scrollable on mobile (`hide-scrollbar`), and cleanly separated from the content.

---
*Note: Any new pages, components, or CSS changes must be cross-referenced with this document to ensure alignment with the overarching Sanctuary Editorial language.*
