---
name: "angular-shell-handoff"
description: "Split a standalone Angular screen into a thin app host, a composition shell, and presentational panels that are ready for later store wiring."
domain: "frontend-architecture"
confidence: "high"
source: "earned"
tools:
  - name: "powershell"
    description: "Run Angular validation commands after scaffold changes."
    when: "After adding or reshaping standalone components."
---

## Context
Use this when an Angular app needs visible MVP scaffolding before the real store or route composition is ready.

## Patterns
- Keep `app.component.ts` focused on page chrome and hand off the feature area to a dedicated shell component.
- Let the shell own temporary local state only when it preserves later contracts instead of inventing business logic.
- Give the input panel a single text-change output and keep the metrics panel on a snapshot-style input contract.
- Add `aria-live="polite"` and semantic `<dl>` output early so accessibility survives later wiring.

## Examples
- `src/app/app.component.ts`
- `src/app/components/analysis-shell/analysis-shell.component.ts`
- `src/app/components/text-input-panel/text-input-panel.component.ts`
- `src/app/components/metrics-panel/metrics-panel.component.ts`

## Anti-Patterns
- Recomputing metrics inside templates or presentational components.
- Letting the root app host absorb feature-level layout or store concerns.
- Hiding accessibility work until after the store is connected.
