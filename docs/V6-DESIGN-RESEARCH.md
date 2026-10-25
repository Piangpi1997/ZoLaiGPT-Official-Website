# ZOLAI GPT V6 — design investigation

Research date: 25 October 2026 (Malaysia). Reference: https://zomi.chat/ . This records public UI observations, not a source-code or backend audit.

## Observed interface

The public page combines a gradient hero, section navigation, feature cards, selectable generator demonstrations, a categorized template library, a three-step explanation, testimonials, pricing and FAQ. Feature selection changes the displayed example. Selecting Development reduces the visible template set. Clicking the first FAQ reveals its answer. Public registration and sign-in links are present; neither account flow nor AI generation was tested.

Navigation emphasizes same-page sections. Repeated CTAs invite entry to the product. Illustrations help explain otherwise abstract capabilities. Long template inventories favor discovery but increase scanning effort. Some public links point to generic destinations; marketing assertions were not verified.

## Measured separately from interpretation

| Measurement | Direct observation |
|---|---|
| Browser viewport | 1363 × 936 |
| Body background | rgb(249,249,251) |
| H1 computed type | Golos Text, 84px |
| H2 computed type | Onest, 53px |
| Initial nav position | relative |
| Horizontal overflow | none at the sampled desktop viewport |
| Category filtering | Development selection changed the visible template subset |
| FAQ | first item revealed answer on click |

No precise mobile breakpoint, spacing scale, border radius, hover timing, loading-state behavior, keyboard order, contrast compliance or scroll-sticky transition was measured on the reference. The browser interface did not expose a viewport-resize API; reference mobile behavior was not asserted. Screenshots were inspected internally. No reference artwork, branding or source files were imported.

## Design principles and original application

1. **Information architecture:** let visitors move from an understandable product promise to a concrete example, then capabilities, practical use, privacy and help. ZOLAI uses dedicated features, tools and support routes instead of one long inventory.
2. **Hierarchy:** a restrained display headline leads into short explanatory copy. One primary action opens the workspace; secondary navigation explains availability.
3. **Components:** use a shared header, footer, button hierarchy, feature status badges, example panels, filters and native disclosure controls.
4. **Navigation:** keep the header visible, mark the current route, and offer an accessible mobile menu with Escape and focus return.
5. **Composition:** alternate an asymmetric hero, detailed application preview, three feature cards, a bilingual editorial band and compact help sections. Each section has a distinct job.
6. **Responsive behavior:** use content-based grids that collapse at defined breakpoints. Code scrolls within its own panel. Myanmar headlines use a separate size and line-height scale.
7. **Interaction:** show real, modest interactions: sample replies, local utilities, filtering, theme switching and exports. Do not suggest a backend is connected when it is absent.
8. **Conversion:** the entry action needs neither an account nor payment. Explain the demo boundary before opening the workspace, rather than implying paid or general AI service availability.
9. **Accessibility:** the reference has semantic headings and button-driven controls. Its full keyboard flow and contrast were not audited. ZOLAI adds focus outlines, explicit labels, native details/dialog, reduced motion and locally hosted Myanmar fonts.
10. **Improvement opportunities:** clear feature availability; short, purposeful tool inventories; original copy; no unsupported social proof; usable empty states; actual destinations; transparent privacy and pricing.

## Original design decisions — selected values, not reference measurements

The ZOLAI system uses deep navy, soft violet, electric-blue accents, muted mint status indicators and the preserved orange universe orb. The original orb renderer and source artwork remain project assets. The layout, text, card system, status hierarchy and tools are new implementation work.

| Token | Dark | Light |
|---|---|---|
| Background | #080d19 | #f6f7fb |
| Surface | #101726 | #ffffff |
| Text | #f2f4fa | #161e32 |
| Secondary text | #a1adbf | #526078 |
| Border | #293146 | #d6dbe8 |
| Accent | #b5afff | #6452c8 |
| Status | #a8e6d5 | #267263 |

Archivo and Noto Sans Myanmar are served locally. Main content has a 1180px maximum at standard desktop widths, 20px card radii, 52px main actions and a 16px card gap. Responsive changes at 650, 800, 1100 and 1800px were chosen for this content, not copied from the reference.
