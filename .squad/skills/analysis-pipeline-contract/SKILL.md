---
name: "analysis-pipeline-contract"
description: "Model a browser-side text analysis pipeline with pure helpers and a pluggable orchestration boundary."
domain: "api-design"
confidence: "high"
source: "earned"
tools:
  - name: "powershell"
    description: "Run Angular validation after adding contracts, helpers, and service wiring."
    when: "When implementing or verifying the analysis pipeline."
---

## Context
Use this when a frontend-only application needs stable domain contracts and deterministic text-analysis logic without coupling components to calculation details.

## Patterns
- Keep `models/` as the stable contract boundary and make metrics payloads flat enough for direct UI consumption.
- Normalize text once in an orchestration service, then pass a `NormalizedTextAnalysisInput` into pure utilities.
- Keep tokenizer logic swappable through an injected `TokenEstimator` contract instead of binding components to one heuristic.
- Leave future growth behind explicit extension points such as `extensions` on the metrics contract.

## Examples
- `src/app/models/text-analysis-input.model.ts`
- `src/app/models/text-analysis-metrics.model.ts`
- `src/app/services/metrics-computation.service.ts`
- `src/app/utils/metrics-calculator.ts`

## Anti-Patterns
- Re-normalizing text in components, stores, and utilities separately.
- Letting Angular services own text math that could stay as pure functions.
- Baking one tokenizer choice directly into UI or store code.
