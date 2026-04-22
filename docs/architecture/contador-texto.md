# Contador Texto — Technical Architecture Guide

**Version:** 1.0  
**Date:** 2026-04-23  
**Scope:** Phase 1 — Initial Architecture (User Stories 1 & 2)  
**Owner:** Backend Dev (Cruyff)

---

## Overview

This document defines the technical architecture of **Contador Texto**, an Angular 21 web application for real-time text analysis. The design prioritizes clear ownership boundaries, deterministic computation flow, and safe extension paths for future metrics.

The architecture divides the codebase into four **ownership areas** (Component, Service, Utility, Model) that communicate through explicit contracts organized in a four-stage **flow pipeline** (Capture → Normalize → Compute → Present). Each area owns specific artifacts and flow stages, with no cross-area coupling beyond defined dependencies.

---

## Directory Structure

```
src/app/
├── models/                          # Shared contracts and enums
│   ├── architectural-area.model.ts  # Ownership boundaries and extension rules
│   ├── evolution-rule.model.ts      # Documented extension paths
│   ├── flow-stage.model.ts          # Flow pipeline definitions
│   ├── quality-gate.model.ts        # Validation gates for architecture changes
│   ├── text-analysis-input.model.ts # Domain input contracts
│   └── text-analysis-metrics.model.ts # Metrics and breakdown contracts
│
├── utils/                           # Framework-free text analysis helpers
│   ├── text-normalizer.ts           # Pure normalization (counting, whitespace handling)
│   ├── token-estimator.ts           # Pluggable token estimation (GPT-3.5 heuristic default)
│   └── metrics-calculator.ts        # Metric assembly and breakdown factory
│
├── services/                        # Application-level orchestration and state
│   ├── metrics-computation.service.ts    # Orchestrates input → normalized → metrics
│   ├── metrics-computation.service.spec.ts
│   ├── text-analysis-store.service.ts    # Single-write state management (Signals)
│   └── text-analysis-store.service.spec.ts
│
├── components/                      # UI surfaces and interaction dispatch
│   ├── analysis-shell/              # Root composition and layout handoff
│   │   ├── analysis-shell.component.ts
│   │   ├── analysis-shell.component.html
│   │   ├── analysis-shell.component.css
│   │   └── analysis-shell.component.spec.ts
│   │
│   ├── text-input-panel/            # Text capture and event emission
│   │   ├── text-input-panel.component.ts
│   │   ├── text-input-panel.component.html
│   │   ├── text-input-panel.component.css
│   │   └── text-input-panel.component.spec.ts
│   │
│   └── metrics-panel/               # Metrics presentation (read-only)
│       ├── metrics-panel.component.ts
│       ├── metrics-panel.component.html
│       ├── metrics-panel.component.css
│       └── metrics-panel.component.spec.ts
│
├── app.component.ts                 # Page-level framing (delegates to shell)
├── app.config.ts                    # Dependency injection setup
└── app.routes.ts                    # Router configuration (single route: /)
```

---

## Ownership Areas & Boundaries

### 1. **Model Area** — Stable Contracts

| Aspect | Definition |
|--------|-----------|
| **Artifacts** | `src/app/models/**/*` |
| **Purpose** | Define stable contracts shared across layers |
| **Flow Stages** | *None* (contracts, not computation) |
| **Allowed Dependencies** | *None* |
| **Extension Guideline** | Introduce or refine shared contracts first so downstream areas extend against explicit types, not implicit shapes |
| **Forbidden Responsibilities** | Runtime side effects, derived computation, Angular-specific behavior |

**Key Exports:**

- `TextAnalysisInput` — Raw text from user (may include metadata in future)
- `NormalizedTextAnalysisInput` — Text after normalization pass (raw + normalized variants)
- `TextAnalysisMetrics` — Aggregated metrics snapshot (characters, words, tokens, paragraphs)
- `MetricEntry`, `MetricExtension` — Reusable metric building blocks for UI card rendering
- `ArchitecturalArea`, `FlowStage`, `EvolutionRule` — Self-documenting architecture contracts

**Contract Freezing:** All exported metrics and entries are frozen (immutable) to prevent accidental mutation in downstream layers.

---

### 2. **Utility Area** — Pure Text Helpers

| Aspect | Definition |
|--------|-----------|
| **Artifacts** | `src/app/utils/**/*` |
| **Purpose** | Provide deterministic, framework-free text helpers |
| **Flow Stage Owned** | `normalize-text` |
| **Allowed Dependencies** | `model` only |
| **Extension Guideline** | Grow reusable text or metric helpers here before considering service or component changes |
| **Forbidden Responsibilities** | Angular imports, mutable state, UI orchestration |

**Key Functions:**

- `normalizeTextAnalysisInput(input: TextAnalysisInput): NormalizedTextAnalysisInput`
  - Preserves raw text
  - Computes normalized variant (trimmed, line counts, paragraph detection)
  - No side effects; pure function

- `countWords(text: string): number` — Split on Unicode word boundaries
- `countCharacters(text: string): number` — Full character count (includes whitespace)
- `countCharactersExcludingWhitespace(text: string): number` — Content-only count

- `TokenEstimator` interface and `defaultTokenEstimator`
  - Pluggable token estimation via injection token
  - Default: GPT-3.5 heuristic (1 token ≈ 4 characters for ASCII, adjusted for Unicode)
  - Swappable for testing or production strategies without changing service/component APIs

- `calculateTextMetrics(input: NormalizedTextAnalysisInput, estimator?: TokenEstimator): TextAnalysisMetrics`
  - Assembles all counts into final metrics snapshot
  - Builds `MetricBreakdown` (primary: words/characters/tokens; secondary: lines/paragraphs)
  - Frozen and immutable; ready for store or component consumption

**Testing Strategy:** Utilities are unit-tested in isolation (no Angular runtime required). Token estimation is tested against known corpus samples.

---

### 3. **Service Area** — Orchestration & State

| Aspect | Definition |
|--------|-----------|
| **Artifacts** | `src/app/services/**/*` |
| **Purpose** | Coordinate flow stages, expose application APIs, compose pure helpers |
| **Flow Stage Owned** | `compute-metrics` |
| **Allowed Dependencies** | `utility`, `model` |
| **Extension Guideline** | Add orchestration entry points only when a new flow must coordinate existing contracts and helpers |
| **Forbidden Responsibilities** | Template rendering, DOM manipulation, implicit shared state outside service APIs |

#### MetricsComputationService

**Responsibility:** Orchestrate the text analysis pipeline: Input → Normalize → Compute.

```typescript
interface TextAnalysisComputation {
  readonly input: NormalizedTextAnalysisInput;
  readonly metrics: TextAnalysisMetrics;
}

compute(input: TextAnalysisInput): TextAnalysisComputation
computeText(text: string): TextAnalysisComputation
```

**Key Details:**

- Receives raw `TextAnalysisInput` from the store
- Delegates normalization to `normalizeTextAnalysisInput()` utility
- Injects `TOKEN_ESTIMATOR` at construction (swappable via DI)
- Delegates metric assembly to `calculateTextMetrics()` utility
- Returns frozen computation result (input + metrics together for consistency)

**Token Estimator Injection:**

```typescript
export const TOKEN_ESTIMATOR = new InjectionToken<TokenEstimator>('TOKEN_ESTIMATOR', {
  providedIn: 'root',
  factory: () => defaultTokenEstimator,
});
```

This enables:
- Swapping estimation strategies via `providers` in app config
- Testing with predictable mock estimators
- Future feature flag control over encoding method

#### TextAnalysisStoreService

**Responsibility:** Single-write state management using Angular Signals.

```typescript
readonly analysis: Signal<TextAnalysisComputation>;      // Full computation result
readonly sourceText: Signal<string>;                     // User's raw input
readonly normalizedText: Signal<string>;                 // After normalization
readonly metrics: Signal<TextAnalysisMetrics>;           // Derived metrics snapshot
readonly isPending: Signal<boolean>;                     // Computation flag

updateText(text: string): void  // Only write method
```

**Key Details:**

- **Single Entry Point:** Only `updateText()` modifies state; ensures predictable data flow
- **Read-Only Projections:** All signals exposed as read-only via `.asReadonly()`
- **Derived Signals:** `normalizedText` and `metrics` computed from the `analysis` signal (no redundant storage)
- **Error Handling:** Wraps `computeText()` in try-finally to ensure `isPending` resets even on exceptions
- **Initial State:** Empty string with pre-computed empty metrics

**Data Flow:**
```
User Input (from text-input-panel)
    ↓
updateText(text: string)
    ↓
MetricsComputationService.computeText(text)
    ↓
TextAnalysisComputation { input, metrics }
    ↓
Stored in analysisState Signal
    ↓
Derived: sourceText, normalizedText, metrics
    ↓
Components consume read-only signals
```

---

### 4. **Component Area** — UI Surfaces

| Aspect | Definition |
|--------|-----------|
| **Artifacts** | `src/app/components/**/*` |
| **Purpose** | Compose UI surfaces and emit user interactions without owning domain rules |
| **Flow Stages Owned** | `capture-input`, `present-results` |
| **Allowed Dependencies** | `service`, `model` |
| **Extension Guideline** | Extend presentation by consuming read-only contracts from the store or router, never by re-implementing metric logic |
| **Forbidden Responsibilities** | Complex metric calculation, token estimation, cross-panel imports |

#### analysis-shell (Root Composition)

**Responsibility:** Layout orchestration and panel composition.

- Imports store service and subscribes to `analysis` signal
- Renders `text-input-panel` and `metrics-panel` side-by-side (desktop) or stacked (mobile)
- Passes store's read-only signals to child panels
- No metric logic; purely compositional

**Responsive Layout:**
- **Desktop (≥768px):** Two-column layout (70% textarea, 30% metrics)
- **Mobile (<768px):** Single column, metrics collapsed or collapsible

#### text-input-panel (Capture Stage)

**Responsibility:** Text input and user event dispatch.

- Renders textarea with accessible label
- Listens to input events (text change)
- Calls store's `updateText()` on every keystroke
- No calculations; no metric reading

**Accessibility:**
- ARIA labels for input field
- Clear placeholder text
- Focus management compatible with screen readers

#### metrics-panel (Presentation Stage)

**Responsibility:** Read-only metric visualization.

- Consumes `metrics` Signal from store (read-only)
- Renders `MetricBreakdown` (primary and secondary groups)
- Renders individual `MetricEntry` cards with label + value + description
- No calculations; purely presentational

**Key Details:**
- Reuses metric entry/breakdown factories from models
- Safe to extend with new layouts without duplicating metric logic
- Supports extensions via the `extensions` array in `TextAnalysisMetrics`

---

## Flow Pipeline: Four Stages

The text analysis process follows a deterministic four-stage pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Capture Input                                      │
│ Owner: Component (text-input-panel)                         │
│ Trigger: User types or pastes text                          │
│ Input Contract: Raw browser text event payload              │
│ Output Contract: TextAnalysisInput { text: string }         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Normalize Text                                     │
│ Owner: Utility (text-normalizer.ts)                         │
│ Trigger: Service accepts new source text                    │
│ Input Contract: TextAnalysisInput                           │
│ Output Contract: NormalizedTextAnalysisInput                │
│ { text: string, normalizedText: string, ... }              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: Compute Metrics                                    │
│ Owner: Service (metrics-computation.service.ts)             │
│ Trigger: Normalized text enters computation                 │
│ Input Contract: NormalizedTextAnalysisInput                 │
│ Output Contract: TextAnalysisMetrics                        │
│ { characters: number, words: number, ... }                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: Present Results                                    │
│ Owner: Component (metrics-panel)                            │
│ Trigger: Computed metrics projected back to shell           │
│ Input Contract: TextAnalysisMetrics                         │
│ Output Contract: Read-only view model rendered              │
│ Rendered metrics cards with labels and descriptions         │
└─────────────────────────────────────────────────────────────┘
```

**Key Invariant:** No stage skips or branches. Data flows unidirectionally from capture through presentation.

---

## Data Model Summary

### TextAnalysisInput

```typescript
interface TextAnalysisInput {
  readonly text: string;  // User-provided raw text
}
```

### NormalizedTextAnalysisInput

```typescript
interface NormalizedTextAnalysisInput {
  readonly text: string;           // Original raw input (preserved)
  readonly normalizedText: string; // Normalized variant (trimmed, cleaned)
}
```

### TextAnalysisMetrics (Complete Snapshot)

```typescript
interface TextAnalysisMetrics {
  // Totals
  readonly characters: number;
  readonly charactersExcludingWhitespace: number;
  readonly words: number;
  readonly lines: number;
  readonly paragraphs: number;
  
  // Token estimation with method metadata
  readonly estimatedTokens: TokenEstimate;
  
  // Organized metric groups (primary, secondary, custom)
  readonly breakdown: MetricBreakdown;
  
  // Future extension slot for custom metrics
  readonly extensions: readonly MetricExtension[];
}

interface MetricBreakdown {
  readonly primary: readonly MetricEntry<number>[];    // Words, characters, tokens
  readonly secondary: readonly MetricEntry<number>[]; // Lines, paragraphs, etc.
  readonly extensions: readonly MetricExtension[];     // Pluggable additions
}

interface MetricEntry<T = number> {
  readonly key: string;           // Identifier (e.g., 'words')
  readonly label: string;          // Display label (e.g., 'Palabras')
  readonly value: T;              // Numeric or string value
  readonly description: string;   // Tooltip/help text
}
```

---

## Extensibility Paths

The architecture defines three evolution rules that guide safe extension:

### Rule 1: Adding a New Metric

**Scenario:** Add a new metric (e.g., reading time, syllable count).

**Entry Point:** Model area  
**Path:**

1. Define the metric contract in `TextAnalysisMetrics` or as a `MetricExtension`
2. Add calculation logic to `metrics-calculator.ts` utility
3. Update `MetricsComputationService.compute()` to invoke the new utility
4. Update `metrics-panel` component to render the new entry (via `breakdown` or `extensions`)
5. No changes to service APIs or component contracts needed

**Quality Gates:** `ng test`, `ng lint`, `ng build`

**Documentation Updates:** Technical architecture guide, UI architecture contract

### Rule 2: Swapping Token Estimation Strategy

**Scenario:** Replace GPT-3.5 heuristic with a different encoder (BPE, actual tokenizer API).

**Entry Point:** Service area (compute-metrics)  
**Path:**

1. Create a new `TokenEstimator` implementation
2. Register in app config via `providers: [{ provide: TOKEN_ESTIMATOR, useValue: myEstimator }]`
3. Service automatically uses the new estimator; no component changes needed

**Quality Gates:** `ng test`, `ng lint`, `ng build`

**Documentation Updates:** ADR (Architecture Decision Record), technical guide

### Rule 3: Adding a New Layout or Presentation Variant

**Scenario:** Create a new dashboard view or export format for metrics.

**Entry Point:** Component area (present-results)  
**Path:**

1. Create a new component consuming the same `TextAnalysisMetrics` contract
2. Reuse `MetricBreakdown` and `MetricEntry` from the store
3. Register new route in `app.routes.ts` if a new view is needed
4. No changes to computation or state required

**Quality Gates:** `ng test`, `ng lint`, `ng build`, visual browser validation, documentation update

**Documentation Updates:** README, technical guide, release notes

---

## Validation Gates

The architecture enforces four validation gates for all changes:

| Gate | Trigger | Owner | Evidence |
|------|---------|-------|----------|
| **ng test** | Service or store changes | All tests pass locally | `npm test -- --watch=false` |
| **ng lint** | Code quality | ESLint passes | `npm run lint` |
| **ng build** | Compilation and bundling | Build succeeds | `npm run build` |
| **simple-browser-review** | Layout or presentation changes | Visual verification in browser | Manual check against specs/quickstart.md |
| **docs-update** | Architecture changes | Documentation reflects code | README, ADR, this guide updated |

**Enforcement:** Gate failures block merge. Architectural changes require all five gates to pass.

---

## Testing Strategy

### Unit Tests (Mandatory for T030)

**Utilities:** Tested in isolation without Angular runtime.
- `text-normalizer.spec.ts`: Word/character counts against known inputs
- `token-estimator.spec.ts`: Token counts vs. known corpus samples
- `metrics-calculator.spec.ts`: Metric assembly and breakdown factories

**Services:** Tested with dependency injection and mock estimators.
- `metrics-computation.service.spec.ts`: Input → normalized → metrics pipeline
- `text-analysis-store.service.spec.ts`: Single-write semantics, signal updates, error handling

**Components:** Tested with store service mocks.
- `analysis-shell.component.spec.ts`: Composition, layout logic, state wiring
- `text-input-panel.component.spec.ts`: Input capture, event emission
- `metrics-panel.component.spec.ts`: Metric rendering, breakdown presentation

### Integration Validation

- **Route `/`:** Opens to analysis-shell, captures input, displays metrics
- **Text Update:** Input change triggers computation and metric update within 50ms
- **Accessibility:** Screen reader announces metric changes; keyboard navigation works
- **Responsive Layout:** Desktop (2-column) and mobile (stacked) render correctly

---

## Dependency Graph

```
                    ┌─ text-analysis-input.model.ts
                    │
    ┌──────────────┬┴──┬──────────────┬────────────────┐
    │              │   │              │                │
    ▼              ▼   ▼              ▼                ▼
text-normalizer  quality-gate  evolution-rule  architectural-area
    │            (model)        (model)           (model)
    │
    └─────┬──────────────┬─────────────────┐
          │              │                 │
          ▼              ▼                 ▼
    metrics-calculator  token-estimator   text-analysis-metrics.model.ts
    (utility)           (utility)         (model — shared factories)
          │              │                 │
          └──────┬───────┴─────────┬───────┘
                 │                 │
                 ▼                 ▼
        metrics-computation.service.ts  (service — orchestration)
                 │
                 ▼
        text-analysis-store.service.ts  (service — state)
                 │
                 ▼
        analysis-shell.component.ts  (component — composition)
         /                          \
        ▼                            ▼
text-input-panel.component.ts   metrics-panel.component.ts
(component — capture)           (component — presentation)
```

**Rule:** Components depend on services (indirectly on utilities). Services depend only on utilities and models. Utilities depend only on models. No circular dependencies.

---

## Performance & Memory Considerations

1. **Computation Latency:** Text analysis happens synchronously in the service. For texts >50KB, consider offloading to a Web Worker in phase 2.

2. **Token Estimation:** Default heuristic is O(n) in text length. Pluggable interface allows replacement with cached/precomputed strategies.

3. **Signal Reactivity:** Store uses Angular Signals for automatic change detection. Components subscribe to derived signals; no manual subscriptions.

4. **Immutability:** All metrics are frozen (Object.freeze). Prevents accidental mutations; enables safe sharing across layers.

---

## Future Phases & Deferred Decisions

### Phase 1B: Feature Flags

Introduce a feature-flag system to enable decoupled delivery of format projections and token strategy swaps.

### Phase 2: Backend Integration

Add backend API for:
- Persistent analysis history
- Cloud-based token validation (OpenAI, etc.)
- Real-time collaborative editing

### Phase 2A: Web Workers

Offload metric computation to a Web Worker for texts >50KB to keep the main thread responsive.

### Phase 3: Multi-Format Output

Extend `MetricExtension` to support:
- Markdown: Backtick-wrapped text with metrics
- JSON: Quoted string with metrics metadata
- Raw metrics export (CSV, API format)

---

## References

- **Input Artifacts:**
  - `specs/001-arquitectura-inicial/data-model.md` — Entity definitions
  - `specs/001-arquitectura-inicial/contracts/ui-architecture.md` — UI contracts
  - `specs/001-arquitectura-inicial/research.md` — Architecture decisions

- **Source Code:**
  - `src/app/models/` — All contracts and types
  - `src/app/services/` — Orchestration and state
  - `src/app/utils/` — Pure helpers
  - `src/app/components/` — UI surfaces

- **Tests:**
  - Unit tests: `*.spec.ts` alongside implementation
  - Coverage: `npm test -- --watch=false`

- **Quality Validation:**
  - Linting: `npm run lint` (ESLint + TypeScript strict mode)
  - Build: `npm run build`
  - Browser: Manual validation against `specs/001-arquitectura-inicial/quickstart.md`

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-23 | Cruyff | Initial technical architecture guide for Phase 1 baseline |

---

**Status:** Approved for Phase 1 implementation (User Stories 1 & 2).  
**Next Review:** After T034 (documentation sign-off) and T030-T032 (validation gates).
