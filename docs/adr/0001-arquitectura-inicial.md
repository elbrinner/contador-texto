# ADR 0001: Initial Application Architecture

**Date**: 2026-04-22  
**Status**: Accepted  
**Deciders**: Pele (Lead), Team  

## Summary

Establish the initial architecture of Contador Texto as a single-flow Angular 21 application centered on text analysis. Define clear boundaries between components, services, utilities, and models to enable controlled extension without reorganizing the base structure.

## Problem Statement

The application needs a predictable structure from the start:
1. Where does new UI logic belong?
2. Where does metric computation happen?
3. How do components share data without tight coupling?
4. What rules prevent metric logic from leaking into the UI?

## Decision

Adopt a **layered, single-flow architecture** with four distinct areas:

### 1. Components (`src/app/components/`)
**Responsibility**: Visual composition and user interaction  
**What it does**:
- Capture and emit user input
- Render metrics from Signal-driven state
- Manage responsive layout

**What it cannot do**:
- Compute metrics directly
- Mutate shared state (only through store API)
- Store business logic

**Files**:
- `analysis-shell/` – Root composition, layout handoff
- `text-input-panel/` – Text capture with accessibility labels
- `metrics-panel/` – Output display with ARIA live regions

### 2. Services (`src/app/services/`)
**Responsibility**: State management and orchestration  
**What it does**:
- Manage Signal-driven state in `TextAnalysisStoreService`
- Orchestrate the text-to-metrics flow in `MetricsComputationService`
- Inject utility functions and apply them in sequence

**What it cannot do**:
- Implement metric calculation logic (delegate to utils)
- Couple directly between UI components (route through signals)

**Files**:
- `text-analysis-store.service.ts` – Signals state, single write entry point
- `metrics-computation.service.ts` – Frozen computation contracts

### 3. Utilities (`src/app/utils/`)
**Responsibility**: Pure, testable calculations  
**What it does**:
- Normalize text (whitespace, encoding)
- Estimate token counts
- Compute metrics (characters, words, etc.)

**What it cannot do**:
- Access Angular services
- Manage state
- Perform I/O

**Files**:
- `text-normalizer.ts` – Input sanitization
- `token-estimator.ts` – Token counting (pluggable)
- `metrics-calculator.ts` – Metric aggregation

### 4. Models (`src/app/models/`)
**Responsibility**: Type contracts and boundaries  
**What it does**:
- Define input and output shapes
- Document architectural areas and evolution rules
- Provide typed references for all major flows

**Files**:
- `text-analysis-input.model.ts` – Input contract
- `text-analysis-metrics.model.ts` – Output contract
- `architectural-area.model.ts` – Area definitions
- `flow-stage.model.ts` – Flow node documentation
- `evolution-rule.model.ts` – Extension rules
- `quality-gate.model.ts` – Validation gates

## Data Flow

```
[User Text Input]
        ↓
  text-input-panel
   (emits change)
        ↓
store.updateText(text)
        ↓
metrics-computation.computeText(text)
  • normalizeTextAnalysisInput()
  • calculateTextMetrics()
        ↓
[Frozen TextAnalysisComputation]
        ↓
store.analysis (Signal)
  ├─ store.metrics (computed)
  ├─ store.normalizedText (computed)
  └─ store.isPending (signal)
        ↓
  metrics-panel
 (reads signals)
        ↓
[Display metrics]
```

## Key Constraints

1. **Single Entry Point**: All text updates go through `store.updateText()`. No direct service-to-component communication.

2. **No Metric Logic in Components**: Components never call `calculateTextMetrics()` or `normalizeText()`. All logic flows through the store.

3. **Immutable Contracts**: Computation results are frozen. Components receive read-only Signal snapshots.

4. **Extension Points Defined**: New metrics enter through `TextAnalysisMetrics` model and `metrics-calculator` utility. No authorization needed beyond design review.

5. **Accessibility First**: All public UI surfaces include ARIA landmarks, labels, and live regions. No visual feedback without semantic announcement.

## Why This Shape

### Simplicity
A single flow with clear stages is easier to test, reason about, and extend than a multi-domain architecture at this stage.

### Extensibility
Each area can grow independently:
- Add metrics without touching components
- Add new token estimators via dependency injection
- Add displays without changing the store
- Add routes without rewriting the shell

### Reviewability
Boundaries are explicit in code structure. "Where does this responsibility live?" has a clear answer.

### Testability
- Utils are pure functions – unit test with simple inputs/outputs
- Services are tested via Signals mutations
- Components are tested for composition and event flow, not business logic
- No mocking of metric logic needed in UI tests

## Trade-Offs

### What We Sacrifice
- **Multi-domain complexity** – Not needed for v0
- **Advanced state management** (NgRx, etc.) – Signals are sufficient
- **Multiple route structures** – Single `/` route for now
- **Lazy loading** – All code loads together (acceptable for feature size)

### What We Gain
- **Clear ownership** – Every responsibility has a home
- **Low cognitive load** – New contributors know where to look
- **Fast validation** – No architectural drift, fast reviews
- **Controlled growth** – Extensions follow documented rules

## Evolution Rules

Architectural changes that require ADR review:
1. Adding a new major component area (not just a component in `components/`)
2. Creating a new service type (storage, caching, etc.)
3. Changing the data flow (adding middleware, transformers, etc.)
4. Refactoring layers (merging services, splitting utilities, etc.)

Allowed extensions without ADR review:
- New metrics in `metrics-calculator.ts`
- New UI components in `components/` following the same Signal contracts
- New token estimators implementing `TokenEstimator` interface
- New utility functions in `utils/` (pure calculations only)

## Validation & Documentation

### Quality Gates
All changes require:
1. `npm test` – Service and component unit tests pass
2. `npm lint` – ESLint compliance
3. `npm run build` – Production build succeeds
4. Simple Browser validation – Responsive and accessible behavior verified
5. Documentation updates – README, ADR, and release notes aligned with implementation

### Documentation Surfaces
- **README.md** – Project structure and quick start
- **This ADR** – Architecture principles and decisions
- **docs/architecture/contador-texto.md** – Technical deep dive
- **docs/releases/** – Baseline changelog and future roadmap
- **specs/001-arquitectura-inicial/** – Design and planning artifacts

## References

- Specification: `specs/001-arquitectura-inicial/spec.md`
- Plan: `specs/001-arquitectura-inicial/plan.md`
- Data Model: `specs/001-arquitectura-inicial/data-model.md`
- Contracts: `specs/001-arquitectura-inicial/contracts/`

---

**Co-authored-by**: Team  
**Decision Authority**: Pele (Lead)
