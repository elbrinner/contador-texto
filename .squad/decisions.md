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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- Cross-agent dependencies tracked in orchestration-log/
