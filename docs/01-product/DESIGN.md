---
name: Kinetic Precision
colors:
  surface: "#faf8ff"
  surface-dim: "#d9d9e6"
  surface-bright: "#faf8ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f2ff"
  surface-container: "#ededfb"
  surface-container-high: "#e7e7f5"
  surface-container-highest: "#e1e1ef"
  on-surface: "#191b25"
  on-surface-variant: "#434656"
  inverse-surface: "#2e303a"
  inverse-on-surface: "#f0f0fd"
  outline: "#737688"
  outline-variant: "#c3c5d9"
  surface-tint: "#004dea"
  primary: "#0041c8"
  on-primary: "#ffffff"
  primary-container: "#0055ff"
  on-primary-container: "#e3e6ff"
  inverse-primary: "#b6c4ff"
  secondary: "#5f5e5e"
  on-secondary: "#ffffff"
  secondary-container: "#e2dfde"
  on-secondary-container: "#636262"
  tertiary: "#972500"
  on-tertiary: "#ffffff"
  tertiary-container: "#c13301"
  on-tertiary-container: "#ffe1d9"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#dce1ff"
  primary-fixed-dim: "#b6c4ff"
  on-primary-fixed: "#001551"
  on-primary-fixed-variant: "#0039b3"
  secondary-fixed: "#e5e2e1"
  secondary-fixed-dim: "#c8c6c5"
  on-secondary-fixed: "#1c1b1b"
  on-secondary-fixed-variant: "#474746"
  tertiary-fixed: "#ffdbd1"
  tertiary-fixed-dim: "#ffb5a0"
  on-tertiary-fixed: "#3b0900"
  on-tertiary-fixed-variant: "#872100"
  background: "#faf8ff"
  on-background: "#191b25"
  surface-variant: "#e1e1ef"
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 34px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: "500"
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 20px
  stack-gap-sm: 8px
  stack-gap-md: 16px
  stack-gap-lg: 32px
  section-margin: 40px
---

## Brand & Style

The design system is rooted in **Modern Minimalism** with a focus on high-utility fintech operations. It targets a sophisticated user base that demands clarity, speed, and a premium "Command Center" experience. The aesthetic is intentionally sparse, using generous whitespace to reduce cognitive load during complex financial tasks.

The emotional response is one of **calculated confidence**. By stripping away ornamental textures and relying on precision-engineered layout logic, the UI feels like a high-end tool rather than a consumer toy. The "Command Center" feel is achieved through structural rigor, thin-stroke iconography, and a disciplined use of a single high-energy brand accent.

## Colors

The palette is strictly architectural.

- **Core Neutral:** Pure White (#FFFFFF) is the primary canvas, providing maximum "air" for the content. Light Gray (#F5F5F7) is reserved for background grouping and subtle surface differentiation.
- **Brand Accent:** Vibrant Electric Blue (#0055FF) is used surgically. It is the color of action, reserved for the central CTA and key navigation indicators.
- **Typography:** Charcoal Black (#1A1A1A) provides high-contrast legibility for data points.
- **Semantic Status:** Emerald Green and Soft Ruby are used exclusively for financial trends and status indicators (e.g., gains/losses), ensuring the user's focus is immediately drawn to performance metrics.

## Typography

The typography system uses **Geist** for its exceptional legibility and neutral, systematic tone.

- **Thai Support:** For Thai characters, the line-height is increased by 15% across all levels to prevent clipping of diacritics and ensure a comfortable reading rhythm.
- **Hierarchy:** Strong contrast between weights (Regular 400 vs. Semi-Bold 600) distinguishes between data labels and actual financial figures.
- **Numerical Precision:** All data-heavy views must enable `tabular figures` (tnum) to ensure columns of numbers align vertically for easier scanning.
- **Display:** Large display sizes use tight letter spacing to maintain a cohesive, "locked-in" look for account balances.

## Layout & Spacing

This design system employs a **Fluid Grid** with a 4px base unit.

- **Mobile Viewport:** Utilizes a 4-column grid with 20px outside margins and 16px gutters.
- **The "Safe Zone":** Content is heavily inset from the edges to evoke a premium feel.
- **Vertical Rhythm:** Components are spaced using a "Stack" model. Related items (labels and inputs) use 8px spacing; unrelated sections use 32px or 40px to create distinct visual groups without the need for heavy dividers.
- **Component Density:** Despite the "Command Center" theme, touch targets remain a minimum of 44x44px, with generous internal padding (16px) for cards and inputs.

## Elevation & Depth

This design system avoids heavy shadows, instead utilizing **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** The base layer is Pure White. Cards and secondary sections sit on this using a 1px border (#E5E5E7) or a subtle Light Gray (#F5F5F7) fill.
- **Subtle Depth:** A single, highly diffused "Ambient Shadow" (0px 4px 20px, 4% opacity Black) is used only for the main floating action button and primary modal sheets to suggest they are on a higher Z-index.
- **Interactions:** Upon press, elements do not "pop" up; they subtly dim or shrink (98% scale), reinforcing a tactile, responsive feel without breaking the minimalist aesthetic.

## Shapes

The shape language is defined by **Controlled Roundedness**.

- **Base Radius:** Most UI elements (cards, inputs, buttons) use a 10px or 12px radius (`rounded-lg`). This softens the brutalism of the minimalist grid while maintaining a professional, structured appearance.
- **Large Components:** Outer containers or full-screen modals use a 24px top radius (`rounded-xl`) to feel approachable.
- **Icons:** Icons must utilize a 1.5pt or 2pt stroke weight with rounded caps and joins to match the corner radii of the components.

## Components

- **Primary Action Button:** The central hub of the app. It is a solid Vibrant Electric Blue pill or rounded rectangle with white text/icon.
- **Data Cards:** Pure White backgrounds with a subtle #E5E5E7 border. No heavy shadows. Titles are in `label-caps` Gray, while balances are in `display-lg` Charcoal Black.
- **Input Fields:** Minimalist "Underline" or "Light Fill" style. Focus states are indicated by a 2px Electric Blue bottom border or a subtle stroke.
- **Chips:** Used for transaction categories. They use a Light Gray background with `body-sm` text. Active chips switch to Charcoal Black with white text.
- **List Items:** High-density rows with thin 0.5px dividers. Left-aligned icons in the brand color; right-aligned values in `numeric-data` style.
- **Positive/Negative Indicators:** Tiny 8px circles (pills) or arrows using the Emerald Green and Soft Ruby colors, placed immediately adjacent to the numerical data they describe.
