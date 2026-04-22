# Squad Decisions

## Brainstorm Session Results — 2026-04-22

### 1. Format Projection — Multi-Format Analysis (Pele)

**Status:** Proposed  
**Owner:** Pele  
**Description:** Users paste text once and see character/token/word counts across three output formats:
- Raw (current input)
- Markdown (backticks/codeblock wrapped)
- JSON (quoted string value)

**Rationale:** Developers need to understand content size implications when moving text between systems (docs, APIs, chat models). Differentiates from commodity counters.

**Effort:** ~50 lines of code, uses existing signals  
**Priority:** Phase 1B (post-MVP)

---

### 2. Live Metric Transitions — Animation Feedback (Messi)

**Status:** Proposed  
**Owner:** Messi  
**Description:** Smooth Signal-driven transitions (200-300ms) on stat metric changes. Each metric gets enter/update/leave animation states. ARIA live regions for accessibility.

**Rationale:** Animations create presence and responsiveness. GPU-accelerated, non-blocking. Signal mutations detected granularly.

**Effort:** Uses `@angular/animations`  
**Priority:** MVP baseline (high polish feedback loop)

---

### 3. Split-Screen Focus Mode — Layout Design (Maradona)

**Status:** Proposed  
**Owner:** Maradona  
**Description:** Two-panel layout:
- Desktop: Left (70%) textarea, Right (30%) sticky stats
- Mobile: Stacked textarea + collapsible stats bar
- Micro-interactions: Subtle color pulse on metric changes

**Rationale:** Respects user focus state during writing. Metrics always visible without breaking flow state.

**Effort:** Component layout + responsive breakpoints  
**Priority:** MVP baseline

---

### 4. Live Semantic Region — A11y Announcements (Zidane)

**Status:** Proposed  
**Owner:** Zidane  
**Description:** `aria-live="polite"` region announcing metrics in plain language: "47 words, 256 characters, estimated 63 tokens". Updates every 500ms or on input pause.

**Rationale:** Screen reader + keyboard-only users need real-time feedback without sidebar attention. WCAG 2.1 Level AA compliance.

**Testing:** NVDA, JAWS screen reader validation  
**Priority:** MVP baseline (accessibility-first)

---

### 5. Token Estimation Contract — Pluggable Service (Cruyff)

**Status:** Proposed  
**Owner:** Cruyff  
**Description:** Service interface with pluggable encoders:
```typescript
interface TokenEstimator {
  estimate(text: string): TokenEstimate;
}
interface TokenEstimate {
  tokens: number;
  method: 'utf8' | 'bpe-lite' | 'gpt35-heuristic' | string;
  confidence?: number;
}
```

**Rationale:** Decouples UI from token logic. Enables testing without external APIs. Swappable encoders without UI changes.

**Default:** GPT-3.5 heuristic with unit tests  
**Priority:** MVP baseline (core feature)

---

### 6. Differential Count Verification Suite — Testing (Ronaldo)

**Status:** Proposed  
**Owner:** Ronaldo  
**Description:** Comprehensive test suite validating counts against OpenAI tokenizer + Unicode standards. User-facing confidence badge shows validation status.

**Test Coverage:** Non-Latin scripts, emoji, combining characters, HTML entities, multi-byte chars  
**Regression:** Automated baseline comparison on each PR

**Rationale:** User trust in accuracy is core product value. Visibility into verification is a feature, not a footnote.

**Priority:** MVP baseline → Phase 1A (confidence badge UX)

---

### 7. Feature Flag Stack — Decoupled Delivery (Ralph)

**Status:** Proposed  
**Owner:** Ralph  
**Description:** Lightweight feature flag system (environment variables + config) enabling feature merges to `develop` independent of release cycles. Each feature ships disabled by default.

**Architecture:**
- `feature-flags.ts` config file (dev/staging/prod profiles)
- Flag provider service
- Feature components wrapped in flag checks

**Rationale:** Keeps backlog flowing without release bottlenecks. Small PRs (feature + flag). QA can enable flags in staging builds.

**Benefits:** Parallel development, risk mitigation (disable without rollback), Scribe coordinates releases in parallel  
**Priority:** MVP baseline (process enabler)

---

## Task Allocation Record — 2026-04-22T21:47:14Z

**Requestor:** Elbrinner da Silva Fernandes  
**Orchestrator:** Scribe  
**Validator:** Pele (Lead), Ralph (Work Monitor)  

**Allocation Summary:**
- 34 tasks distributed across immediate MVP batch + deferred phases
- Immediate batch assigned to: Messi (T001-T003, T009), Cruyff (T004-T007), Ronaldo (T008, T010, T011), Maradona (T012-T014 review), Zidane (T011, T013, T014 a11y validation)
- Deferred phases begin after MVP checkpoint at T017
- All dependencies validated for safe parallel execution

---

## Backlog Sequencing & Execution Plan — 2026-04-22T22:15:00Z (Pele)

**Status:** Validated  
**Owner:** Pele (Lead)  
**Decision Type:** Execution strategy

### Four-Batch Sequence for T008-T034

#### Batch 1 (Immediate): T008 + T018-T019 — Test Authoring
- **T008:** Orchestration service unit tests (Ronaldo) — confidence gate on metrics-computation.service.ts
- **T018-T019:** US2 test contracts (Ronaldo) — test-first design
- **Duration:** ~1 day
- **Parallelization:** All three independent
- **Gate:** None (test-first; fail to guide implementation)

#### Batch 2 (Post-Tests): T020-T023 — US2 Implementation
- **T020:** Encode flow ownership and extension metadata (Cruyff)
- **T021:** Refine store API for single-write entry point (Messi)
- **T022:** Refine service-to-utility boundaries (Cruyff)
- **T023:** Add extension-ready metric structures (Cruyff)
- **Duration:** ~2 days
- **Parallelization:** Cruyff path (T020 → T022+T023) overlaps with Messi path (T021, gated on T020 clarity)
- **Gate:** Pele contract review on T020 before implementation begins

#### Batch 3 (Documentation): T024-T029 — Architecture Docs
- **T024:** Prepare architecture smoke-check checklist (Scribe/Messi)
- **T025:** Prepare documentation review assertions (Pele + Scribe)
- **T026:** Document project structure in README (Scribe)
- **T027:** Record architecture decision in ADR (Pele)
- **T028:** Write technical architecture guide (Scribe + Pele)
- **T029:** Add release-note entry (Scribe)
- **Duration:** ~1.5 days
- **Parallelization:** T024/T026/T029 parallel; T025/T027 review-gated; T028 waits on T026 draft
- **Gate:** Pele doc review (T025, T027) before merge; starts only when T020+ in-flight (mid-Batch 2)
- **Rationale:** Prevent documentation drift if architecture changes during refinement

#### Batch 4 (Validation): T030-T034 — CI + A11y + Sign-Off
- **T030-T032:** Run ng test, ng lint, ng build (Ronaldo) — ~4 hours total
- **T033:** Browser validation + accessibility testing (Zidane + Maradona)
- **T034:** Review updated documentation (Pele sign-off)
- **Gate:** T033/T034 depend on build success + Phase 5 completion

### Risk Guardrails

1. **T008 Confidence Gate:** If service tests reveal architectural issues, resolve before proceeding to US2. ~1 day max recovery.
2. **Reviewer Gate (T020):** Cruyff presents model/contract proposals to Pele; alignment checked before implementation.
3. **Documentation Accuracy Gate (T025, T027):** All Phase 5 docs must pass Pele review. Rewritten if inaccurate.
4. **Accessibility Sign-Off (T033):** Zidane validates WCAG 2.1 Level AA compliance. Failures logged for Phase 4B if not blocking.
5. **No Early Docs:** Do NOT start T026-T029 until T020+ in-flight. Prevents rework.

### Feature Flags Decision

Ralph's feature-flag stack deferred to Phase 1B (post-US2 checkpoint) unless product prioritizes multi-format delivery as immediate P1.

### Next Action

Launch Ronaldo on T008/T018-T019 immediately. Alert Cruyff/Messi to prepare T020-T023 scope.

---

## US1 Test Batch Decision — 2026-04-22 (Ronaldo)

**Status:** Proposed  
**Scope:** T010-T011

### Decision Rationale

US1 store and shell specs added as contract-first pending suites because `text-analysis-store.service.ts` and `analysis-shell.component.*` do not exist yet.

**Why this approach:**
- Keeps tests aligned with task rules (define tests before implementation)
- Does not invent public APIs; Messi still owns T012-T017 implementation
- Tests lock architectural boundaries: store-owned Signals state, single input flow, shell composition, no metric logic in visual components

### Follow-Up for Implementers

- **T015:** Store with predictable empty state, derived analysis from MetricsComputationService, one controlled text mutation path
- **T012/T017:** analysis-shell as `/` composition root composing text-input-panel + metrics-panel through store; no direct coupling between panels

---

## MVP Shell Handoff — 2026-04-22 (Messi)

**Status:** Delivered

### Changes

- **app.component.ts:** Now owns only page-level framing; delegates all interaction layout to `app-analysis-shell`
- **analysis-shell:** Composes `text-input-panel` and `metrics-panel` with placeholder-safe local state so T016-T017 can replace signals with store wiring without rewriting panel contracts
- **text-input-panel:** Emits single `valueChange` event
- **metrics-panel:** Consumes full `TextAnalysisMetrics` snapshot + lightweight pending flag (placeholder/loading states)

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- Cross-agent dependencies tracked in orchestration-log/
