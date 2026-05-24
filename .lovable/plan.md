# MondayOS — Revenue DNA Onboarding v2

Rebuild the onboarding to match the new 7-step strategic debrief and the final "Revenue DNA Activated" executive dashboard. Keep the existing premium dark/glassmorphism aesthetic, components, and design tokens — extend, don't replace.

## Scope

Frontend-only. All state lives in `Onboarding.tsx`. No backend, no persistence.

## Flow (7 steps)

1. **Founder** — company, what it does, problem, why it matters
2. **Commercial Reality** — how customers buy, pricing, customer count, sales cycle
3. **What's Been Tried** — efforts, what worked, what didn't, where deals stall
4. **Competitive Landscape** — competitors, why chosen, why hesitate
5. **Thought Leadership Thesis** — misunderstood, ignored truth, lesson
6. **Communication Style** — 4 selectable cards (Analytical Operator, Contrarian Builder, Visionary Category Creator, Tactical Problem Solver)
7. **Business Objectives** — 90-day outcome, qualified meetings/mo, success picture

After each step the AI bubble shows the specified acknowledgement line with a typing-dots animation, then auto-advances (~1.1s).

## Header

- Title: **Build Your Revenue DNA**
- Subtitle: *Let's understand how your business wins so your AI Revenue Coach can build your strategic growth engine.*
- ProgressRail updated to 7 steps (compact labels so it still fits at 889px viewport — short labels on md+, numbered dots only on small screens).

## Final screen — "Revenue DNA Activated"

Executive dashboard layout (replaces current SummaryScreen):

- Top bar: brand + "Onboarding complete" pill
- Hero: **Revenue DNA Activated** (gradient) + subtitle
- Grid of 7 summary cards (2-col on md, 1-col mobile), each with icon + label + synthesized value:
  - Company Positioning (company + what it does)
  - Commercial Reality (pricing + customers + cycle)
  - Growth Friction Points (didn't work + stuck)
  - Competitive Edge (why chosen)
  - Core Market Thesis (truth/misunderstood)
  - Founder Communication Style (selected card)
  - 90-Day Revenue Objective (outcome + meetings target)
- **AI Strategic Summary** panel — a single intelligent paragraph composed from the answers using a template that weaves: positioning → friction → competitive wedge → thesis → voice → 90-day focus. Tone matches the example given.
- Final message: *Your AI Revenue Coach is now trained and ready to build your first strategic growth sprint.*
- CTA: **Activate MondayOS** (premium gradient button with shimmer + loading spinner → success state with checkmark)

## Files to edit

- `src/components/onboarding/Onboarding.tsx` — rewrite step config, State type, step renderers, advance logic, SummaryScreen, AI summary generator
- `src/components/onboarding/ProgressRail.tsx` — tighten layout so 7 steps fit (hide labels below md, smaller connector width)

No new files needed; existing `AiBubble`, `Field`, `StyleCard` components are reused as-is.

## Technical notes

- `State` becomes a flat object with all ~22 answers; `canAdvance` checks required fields per step (require all text fields filled to keep the "strategic debrief" feel intentional).
- AI summary generator is a pure function `synthesize(data): string` that builds one paragraph with sensible fallbacks when fields are short.
- Acknowledgement messages live in the `steps` array per spec.
- Reuse existing tokens: `glass-strong`, `bg-gradient-primary`, `shadow-glow`, `text-gradient`, `animate-fade-up`, `animate-pulse-soft`.
- CTA loading: 2.2s spinner ("Calibrating your Revenue Coach…") → checkmark success state.
