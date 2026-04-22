# Decisions Log

## 2026-04-22T23:15:11+02:00: User directive (Copilot)

**By:** Elbrinner da Silva Fernandes (via Copilot)

**What:** Mantener `tasks.md` y las issues de GitHub sincronizados.

**Why:** User request — captured for team memory

---

## 2026-04-22T22:10:09Z: Cruyff — Metrics Orchestration Architecture

**By:** Cruyff (Backend Dev)

**What:** Metrics orchestration now normalizes text once in `MetricsComputationService` and hands a `NormalizedTextAnalysisInput` to pure helpers.

**Key Details:**
- Token estimation is pluggable through the `TOKEN_ESTIMATOR` injection token
- `defaultTokenEstimator` uses a browser-safe GPT-3.5 heuristic
- `TextAnalysisMetrics` stays flat for UI consumption
- `extensions` field reserved as entry point for future derived values without breaking component contracts

**Why:** Protects frontend UX through stable contracts; decouples UI from token logic; enables testing without external APIs.

---

## 2026-04-22T22:10:09Z: Messi — Angular 21 Bootstrap Architecture

**By:** Messi (Frontend Dev)

**What:** Established the repo root as a standalone Angular 21 workspace instead of nesting the app under a secondary folder.

**Key Details:**
- Added TailwindCSS through PostCSS pipeline + Angular ESLint
- Baseline already supports `ng build`, `ng test`, and `ng lint`
- `src/app/app.component.ts` is a thin bootstrap host with temporary placeholder
- Real shell/layout handoff reserved for T009 and route composition for T016

**Why:** Keeps architecture coherent under one owner's vision; allows component parallelization in Phase 3.

---

## 2026-04-22T22:10:09Z: Ronaldo — Orchestration Service Test-First Posture

**By:** Ronaldo (QA/Tester)

**What:** Land a contract-first pending spec in `src/app/services/metrics-computation.service.spec.ts` instead of inventing a concrete service API.

**Key Details:**
- T008 was assigned before Cruyff's `metrics-computation.service.ts`, models, and helpers existed
- Pending spec keeps expected orchestration responsibilities explicit
- Preserves intended architecture boundary
- Avoids baking fake public surface into tests before implementation contract is real
- Follow-up: Cruyff will replace pending cases with executable unit tests once service, models, and helpers are available

**Why:** Test-first prevents rework; early test failures guide better design; maintains architectural intent.

---

## 2026-04-22T22:10:09Z: Pele — Phase-Sequenced Task Distribution Plan

**By:** Pele (Team Lead)

**What:** Dependency-safe task sequencing with ownership fit for 5 team members across 6 phases.

**Key Allocation:**
- **Phase 1 (Setup):** Messi (T001–T003) — Angular workspace initialization
- **Phase 2 (Foundation):** Cruyff (T004–T007) — Models, contracts, services (critical path blocker)
- **Phase 3 (MVP Components):** Messi (T009, T012–T014), Ronaldo (T010–T011) — Parallel user story work
- **Phases 4–6:** Post-MVP boundary refinement, documentation, validation

**Cross-Phase Principles:**
- Dependency-first sequencing: Phase 1 unblocks Phase 2; Phase 2 unblocks Phase 3
- Test-first for core services (Ronaldo in parallel with implementation)
- Small initial batch focuses on Phase 1 → early Phase 2 only
- No component work until models and services defined

**Why:** Prevents coupling bleed; protects frontend stability; enables parallelization once foundation is locked.

---

