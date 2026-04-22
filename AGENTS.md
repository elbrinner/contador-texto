# AGENTS.md — Contador Texto Agent Guide

This document helps AI agents understand the **contador-texto** codebase structure, runtime behavior, testing patterns, and safe extension points.

---

## Quick Orientation

**What is this?** A lightweight, accessible text analysis web app built with Angular 21. Users paste text; the app counts characters, words, and estimates tokens in real-time.

**Core product loop:**  
```
User text input → Normalization → Metric computation → Display
```

**Key principle:** One main flow. Clear boundaries between UI, services, and calculation logic. Extensions grow through model contracts, not by spreading logic across components.

---

## Getting Started: Runtime Commands

All commands are defined in `package.json` and run via npm.

### Development Server
```bash
npm start
# Starts development server at http://localhost:4200
# Watches for file changes; rebuilds automatically
```

### Testing
```bash
npm test
# Runs all unit tests with Vitest
# Tests organized by concern: services, components, utilities
# Covers edge cases: emoji, Unicode, non-Latin scripts, CJK characters
```

### Linting
```bash
npm run lint
# Runs ESLint across src/
# Catches async leaks, unused imports, naming inconsistencies
# Must pass before PR/commit
```

### Production Build
```bash
npm run build
# Outputs optimized bundle to dist/
# Called by CI/CD before deployment
# Must succeed as quality gate
```

### Quality Gates (all must pass)
```bash
npm test && npm run lint && npm run build
```

---

## Architecture Overview

### High-Level Structure

```
src/app/
├── components/              # UI composition and rendering
│   ├── analysis-shell/      # Root composition; owns layout
│   ├── text-input-panel/    # Text capture; emits changes
│   └── metrics-panel/       # Display computed metrics
│
├── services/                # State & orchestration
│   ├── text-analysis-store.service.ts     # Signal-driven state container
│   └── metrics-computation.service.ts     # Orchestration (does NOT compute)
│
├── utils/                   # Pure, testable functions
│   ├── text-normalizer.ts       # Input cleanup; handles Unicode
│   ├── token-estimator.ts       # Pluggable token estimation
│   └── metrics-calculator.ts    # Metric math logic
│
└── models/                  # Type contracts
    ├── text-analysis-input.model.ts      # Input shape
    └── text-analysis-metrics.model.ts    # Output shape + factories
```

### Design Principles

1. **Single Responsibility:** Each layer owns one job.
   - Components: Render and emit events
   - Services: Orchestrate and manage state
   - Utils: Calculate without side effects
   - Models: Define contracts and prevent implicit coupling

2. **Immutable Snapshots:** All derived state (metrics) is frozen at creation time.
   - Makes reasoning about state changes predictable
   - Prevents accidental mutations through derived projections
   - Tests can verify frozen boundaries

3. **Clear Boundaries:** Data flows one direction.
   - Components never call utils directly
   - Utils never import from services
   - Models are dependency-free
   - Services orchestrate between layers

4. **Extensible by Design:** New metrics, input formats, or estimation methods slot in without reorganizing the flow.

---

## The Main Route (`/`)

### Route Definition
**File:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', component: AnalysisShellComponent }
];
```

Single route. Everything happens here.

### Component Composition

**File:** `src/app/app.component.ts`
- Owns page-level framing (header, spacing, max-width)
- Delegates all interaction to `<app-analysis-shell>`
- Read-only presentation layer; no business logic

**File:** `src/app/components/analysis-shell/analysis-shell.component.ts`
- Composes `<app-text-input-panel>` and `<app-metrics-panel>`
- Wires state from `TextAnalysisStoreService` to children
- Manages layout responsiveness (desktop vs. mobile)
- Does **not** do metric computation (delegates to service)

### Data Flow in the Shell

```
User types in textarea
    ↓
<app-text-input-panel> (valueChange event)
    ↓
shell.updateText(nextText)
    ↓
textAnalysisStore.updateText(nextText)
    ↓
store calls MetricsComputationService.computeText(text)
    ↓
Service chains: normalizeTextAnalysisInput() → calculateTextMetrics()
    ↓
Frozen TextAnalysisMetrics snapshot stored
    ↓
Shell reads store.metrics Signal
    ↓
<app-metrics-panel> displays via Angular's change detection
```

---

## Service & State Architecture

### TextAnalysisStoreService
**File:** `src/app/services/text-analysis-store.service.ts`

**Responsibility:** Signal-driven state container. Single source of truth.

**Key signals (read-only from outside):**
- `sourceText` — Raw textarea draft
- `analysis` — Full computation snapshot (input + metrics)
- `normalizedText` — Derived: normalized input text
- `metrics` — Derived: computed metrics only
- `isPending` — Computation in flight (loading state)

**Single write entry point:**
```typescript
updateText(text: string): void
```

Sets pending flag, computes metrics synchronously, updates state. No async logic here.

**Why design this way?**
- One source of truth prevents state divergence
- Components can't mutate state directly
- Derived signals (`computed`) auto-update when source changes
- Easy to reason about state transitions

### MetricsComputationService
**File:** `src/app/services/metrics-computation.service.ts`

**Responsibility:** Orchestration only. Does NOT compute metrics directly.

**Public methods:**
```typescript
compute(input: TextAnalysisInput): TextAnalysisComputation
computeText(text: string): TextAnalysisComputation
```

**What it does:**
1. Normalizes input via `normalizeTextAnalysisInput(input)`
2. Computes metrics via `calculateTextMetrics(normalizedInput, tokenEstimator)`
3. Freezes the result object (`Object.freeze()`)
4. Returns immutable snapshot

**Key injection:**
- `TOKEN_ESTIMATOR` — Pluggable token estimation service
- Default: `defaultTokenEstimator` (GPT-3.5 heuristic)
- Can be swapped at provide level without changing service code

**Why design this way?**
- Service doesn't own calculation logic (it stays pure in utils)
- Computation is testable independently
- Token estimator is pluggable for future encoders (OpenAI, Anthropic, etc.)
- Frozen snapshots prevent silent mutations

---

## Utility Functions & Pure Computation

### Text Normalizer
**File:** `src/app/utils/text-normalizer.ts`

**Purpose:** Normalize raw input for consistent metric counting.

**Key functions:**
- `normalizeText(text)` — Remove BOM, fix newlines (CRLF → LF), apply NFC normalization
- `getGraphemes(text)` — Extract individual characters (handles emoji, combining marks)
- `countCharacters(text)` — Character count (uses grapheme segmentation for accuracy)
- `countWords(text)` — Word count (uses Intl.Segmenter if available; regex fallback)

**Unicode handling:**
- Supports non-Latin scripts (Arabic, CJK, Devanagari, etc.)
- Handles emoji and combining diacritical marks
- Uses `Intl.Segmenter` API for spec-compliant grapheme/word segmentation
- Falls back to regex patterns on older browsers

### Token Estimator
**File:** `src/app/utils/token-estimator.ts`

**Purpose:** Estimate token count for AI model input sizing.

**Key interface:**
```typescript
interface TokenEstimator {
  estimate(text: string): TokenEstimate;
}

interface TokenEstimate {
  readonly tokens: number;
  readonly method: 'utf8' | 'bpe-lite' | 'gpt35-heuristic' | string;
  readonly confidence?: number;
}
```

**Built-in estimators:**
- `estimateTokensHeuristically()` — Default; GPT-3.5 heuristic
  - Accounts for CJK (1 token each), emoji (1.5 each), whitespace
  - Confidence varies by script mix (0.68–0.78)
- `estimateTokensByUtf8()` — UTF-8 byte-based estimate (experimental)
  - Lower confidence (0.42); for comparison

**Default export:**
```typescript
export const defaultTokenEstimator: TokenEstimator
```

### Metrics Calculator
**File:** `src/app/utils/metrics-calculator.ts`

**Purpose:** Compute all metrics from normalized input.

**Key function:**
```typescript
export function calculateTextMetrics(
  input: NormalizedTextAnalysisInput,
  tokenEstimator: TokenEstimator
): TextAnalysisMetrics
```

**Calculated metrics:**
- **Primary:** Words, Characters, Tokens
- **Secondary:** Characters (excl. whitespace), Lines, Paragraphs
- **Extensions:** Future custom metrics (phase 1B+)

**Breakdown structure:**
```typescript
interface MetricBreakdown {
  readonly primary: readonly MetricEntry<number>[];
  readonly secondary: readonly MetricEntry<number>[];
  readonly extensions: readonly MetricExtension[];
}
```

Each entry includes `label`, `description`, `key`, and `value` — ready to display without UI-level mapping.

---

## Data Models & Contracts

### TextAnalysisInput
**File:** `src/app/models/text-analysis-input.model.ts`

```typescript
interface TextAnalysisInput {
  readonly text: string;
}

interface NormalizedTextAnalysisInput extends TextAnalysisInput {
  readonly normalizedText: string;
}
```

**Usage:**
- `TextAnalysisInput` — What components pass to services
- `NormalizedTextAnalysisInput` — What services pass to utils (has both raw and normalized)

**Why separate?** Keeps layers clear: components don't know about normalization; utils receive what they need.

### TextAnalysisMetrics & Related Types
**File:** `src/app/models/text-analysis-metrics.model.ts`

**Key types:**
```typescript
interface TokenEstimate {
  readonly tokens: number;
  readonly method: TokenEstimationMethod; // 'utf8' | 'bpe-lite' | 'gpt35-heuristic' | ...
  readonly confidence?: number;
}

interface MetricEntry<TValue = number> {
  readonly key: string;
  readonly label: string;
  readonly value: TValue;
  readonly description: string;
}

interface MetricBreakdown {
  readonly primary: readonly MetricEntry<number>[];
  readonly secondary: readonly MetricEntry<number>[];
  readonly extensions: readonly MetricExtension[];
}

interface TextAnalysisMetrics {
  readonly characters: number;
  readonly charactersExcludingWhitespace: number;
  readonly words: number;
  readonly lines: number;
  readonly paragraphs: number;
  readonly estimatedTokens: TokenEstimate;
  readonly breakdown: MetricBreakdown;
  readonly extensions: readonly MetricExtension[];
}
```

**Factory functions:**
```typescript
export function createMetricEntry<T>(entry: MetricEntry<T>): MetricEntry<T>
export function createMetricBreakdown(breakdown: MetricBreakdown): MetricBreakdown
export function createTextAnalysisMetrics(draft: TextAnalysisMetricsDraft, breakdown: MetricBreakdown): TextAnalysisMetrics
```

All return frozen objects (`Object.freeze()`) — snapshots, not mutable bags of data.

**Why immutable factories?**
- Prevents accidental mutations of derived state
- Makes unit tests able to verify snapshot integrity
- Clear API: "create" means "immutable copy returned"

---

## Testing Patterns

### Test Organization
- `*.service.spec.ts` — Service layer; mock dependencies, test orchestration
- `*.component.spec.ts` — Component layer; test composition, event flow, accessibility
- `*.ts` (no spec suffix) — Utils; test pure functions directly

### Example: Service Test
Services are tested with **stubs** for deep dependencies:
```typescript
// metrics-computation.service.spec.ts
it('should return frozen computation snapshot', () => {
  const result = service.computeText('hello world');
  expect(Object.isFrozen(result)).toBe(true);
});
```

### Example: Component Test
Components test **composition and event flow**, not business logic:
```typescript
// analysis-shell.component.spec.ts
it('should pass sourceText to text-input-panel', () => {
  // Arrange: inject real store service (mocked computation service)
  // Act: trigger store.updateText()
  // Assert: verify computed signal in panel reflects change
});
```

### Example: Utility Test
Utils test **pure functions with edge cases**:
```typescript
// token-estimator.spec.ts
it('should estimate tokens for emoji', () => {
  const result = estimateTokensHeuristically('Hello 👋 world');
  expect(result.tokens).toBeGreaterThan(0);
  expect(result.confidence).toBeLessThan(1);
});

it('should estimate tokens for CJK text', () => {
  const result = estimateTokensHeuristically('你好世界');
  expect(result.method).toBe('gpt35-heuristic');
});
```

### Accessibility Tests
All components have accessibility assertions:
```typescript
// analysis-shell.component.spec.ts
it('should announce metrics via aria-live region', () => {
  const liveRegion = fixture.debugElement.query(
    By.css('[aria-live="polite"]')
  );
  expect(liveRegion).toBeTruthy();
});
```

---

## Safe Extension Patterns

### Adding a New Metric

1. **Update `MetricEntry` in the breakdown** (`metrics-calculator.ts`):
```typescript
function createMetricBreakdownFromDraft(...) {
  return createMetricBreakdown({
    primary: [
      // ... existing entries
      createMetricEntry({
        key: 'myNewMetric',
        label: 'My New Metric',
        value: draft.myNewValue,
        description: 'What this measures.',
      }),
    ],
    // ...
  });
}
```

2. **Add the computed field to `TextAnalysisMetricsDraft`** (`text-analysis-metrics.model.ts`):
```typescript
interface TextAnalysisMetricsDraft {
  // ... existing fields
  readonly myNewValue?: number;
}
```

3. **Compute it in the calculator** (`metrics-calculator.ts`):
```typescript
export function calculateTextMetrics(...): TextAnalysisMetrics {
  const myNewValue = calculateMyMetric(input.normalizedText);
  const draft: TextAnalysisMetricsDraft = {
    // ... existing counts
    myNewValue,
  };
  // ...
}
```

4. **Never duplicate labels or descriptions** — metrics-panel receives the `breakdown` and renders entries as-is.

5. **Test edge cases** — emoji, Unicode, empty input, very long text.

### Swapping Token Estimators

Override the `TOKEN_ESTIMATOR` injection token in `main.ts`:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    // ... other providers
    {
      provide: TOKEN_ESTIMATOR,
      useValue: myCustomEstimator, // TokenEstimator interface
    },
  ],
});
```

Or use feature flags:
```typescript
const estimator = featureFlags.useOpenAITokenizer
  ? openAITokenEstimator
  : defaultTokenEstimator;
```

### Adding a New Input Format

1. Create a new parser util:
```typescript
export function parseMarkdownInput(markdown: string): TextAnalysisInput {
  const text = stripMarkdown(markdown);
  return { text };
}
```

2. Have the input panel call it:
```typescript
// text-input-panel.component.ts
onTextChange(event: any) {
  const parsedInput = this.activeFormat === 'markdown'
    ? parseMarkdownInput(event)
    : { text: event };
  this.store.updateText(parsedInput.text);
}
```

3. No service or model changes needed — the flow remains the same.

---

## Common Pitfalls to Avoid

### ❌ **Don't:**
- Call utils directly from components (breaks encapsulation; use service)
- Mutate metric objects after creation (they're frozen for a reason)
- Put normalization logic in components (it lives in utils)
- Compute metrics in components (service + utils own this)
- Create token estimators without the interface (breaks swappability)

### ❌ **Don't:**
- Add non-readonly fields to models (prevents immutable snapshot enforcement)
- Call service methods from utils (utils are dependency-free)
- Duplicate metric labels across components (use breakdown factory)
- Skip edge case tests (emoji, CJK, empty text, very long text matter)

### ❌ **Don't:**
- Modify `sourceText` signal directly (use `updateText()` only)
- Read `analysisState` from outside the store (read derived signals)
- Assume Intl.Segmenter is available (always have regex fallback)
- Skip Object.freeze() when creating snapshots (immutability is enforced)

---

## Documentation & Specifications

### Key Files to Know

| File | Purpose | When to Update |
|------|---------|-----------------|
| `README.md` | Project overview, quick start, principles | Architecture changes; new features |
| `.squad/decisions.md` | All decisions, design rationale, task log | Every significant architectural change |
| `specs/001-arquitectura-inicial/spec.md` | Feature requirements, user stories | Initial phase only (mostly frozen) |
| `specs/001-arquitectura-inicial/contracts/ui-architecture.md` | Component/service contracts | UI boundary changes |
| `docs/adr/0001-arquitectura-inicial.md` | Architecture Decision Record | Any architectural evolution |
| `docs/releases/` | Release notes and changelog | After completing feature phases |

### How Agents Should Update Docs

**When modifying architecture:**
1. Update relevant spec (if clarifying initial design)
2. Record decision in `.squad/decisions.md` with rationale
3. Update README.md if principles or structure change
4. Record ADR entry if evolution rule or constraint changes

**When adding features:**
1. Clarify requirements in spec (user story, scenarios)
2. Update contract docs (UI architecture, data models)
3. Record decision (why this approach, not alternatives)
4. Update release notes after delivery

**When fixing bugs:**
- No documentation update needed unless it reveals architectural issues
- Record in decisions.md only if pattern affects future work

### Squad Team & Routing

See `.squad/team.md` and `.squad/routing.md` for:
- Who owns what (Product, Frontend, UX, Accessibility, Backend, Testing)
- How to route changes for review
- Ceremony schedules and decision gates

---

## Project Metadata

**Version:** 0.0.0 (MVP Baseline)  
**Angular:** 21.2+  
**Node:** 18+ (npm 11+)  
**Language:** TypeScript 5.9+  
**Package Manager:** npm 11.12+  
**Styling:** Tailwind CSS 3.4  
**Testing:** Vitest 4.0 + Angular testing utilities  
**Linting:** ESLint 10 + TypeScript ESLint 8.56

---

## Final Notes

- **The app is signal-driven.** Signals (`@angular/core`) manage all state reactively.
- **All metrics are immutable.** No mutations after creation; helps tests catch bugs.
- **Extensions enter through models, not components.** New metrics go through calculator → breakdown → panel reads.
- **Pure functions are tested hard.** Emoji, Unicode, CJK, empty text, and very long inputs all have test cases.
- **One write path to state.** `textAnalysisStore.updateText()` is the only way to mutate.
- **Components compose, services orchestrate, utils calculate.** Each layer has one job.

For questions: Check `.squad/agents/{role}/charter.md` for role-specific context.
