# Shell Store Contract Tests

## When to use

- A shell component composes input and presentation panels through a shared Angular Signals store.
- You need interaction coverage that proves real DOM input reaches a metrics-facing contract without direct child-to-child coupling.

## Pattern

1. Mount the real shell component.
2. Provide the real store service.
3. Stub only the computation/orchestration dependency that produces deterministic analysis snapshots.
4. Trigger a real textarea `input` event from the DOM.
5. Assert the store projection updates (`sourceText`, `metrics`) and that the presentation panel receives the new snapshot through its public inputs.
6. Assert the metrics surface does not render raw input text unless that is explicitly part of its contract.
7. If the store is the single write boundary, add one focused unit test proving the raw draft is owned by a private signal rather than copied back from a downstream computation snapshot.

## Local example

- `src/app/components/analysis-shell/analysis-shell.component.spec.ts`
