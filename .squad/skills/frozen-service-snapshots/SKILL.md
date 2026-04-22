# Frozen Service Snapshots

## Use when

- A store or component exposes derived projections from a service result.
- Tests need to prove there is only one real write path and consumers cannot mutate read models.

## Pattern

1. Freeze the service snapshot at runtime, not just through TypeScript readonly types.
2. Freeze nested payloads that callers could still mutate (`estimatedTokens`, `extensions`, arrays, nested objects).
3. In tests, assert both API shape (single public mutator) and mutation resistance with `Reflect.set(...) === false`.
4. If UI cards come from a shared metrics contract, freeze the grouped breakdown (`primary`, `secondary`, `extensions`) in the model/calculator layer so components only render snapshots.

## Applied in

- `src/app/utils/metrics-calculator.ts`
- `src/app/models/text-analysis-metrics.model.ts`
- `src/app/services/metrics-computation.service.spec.ts`
- `src/app/services/text-analysis-store.service.spec.ts`
