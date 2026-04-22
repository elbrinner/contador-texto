# Backlog Allocation: Phases 4–6
**Date:** 2026-04-22  
**Requestor:** Elbrinner da Silva Fernandes  
**Coordinator:** Ralph (Work Monitor)  
**Status:** Proposed for immediate team launch

---

## Executive Summary

Remaining 17 tasks (T008, T018–T034) grouped into 4 dependency-safe batches with max parallelism. Single owner per task; secondary support noted for a11y and testing gates.

---

## Batch 1: Complete Foundation & Start Phase 4 Tests (Launch NOW)
*Prerequisite: T001–T017 done. No dependencies between these tasks.*

| Task | Title | Owner | Support | Status |
|------|-------|-------|---------|--------|
| T008 | Metrics service unit tests (orchestration-service.spec.ts) | **Ronaldo** | — | IMMEDIATE |
| T018 | [P] Extend store tests for single-write & projections | **Ronaldo** | — | IMMEDIATE |
| T019 | [P] Add input-to-metrics interaction coverage | **Messi** | Ronaldo | IMMEDIATE |

**Rationale:**
- T008 is the last foundational blocker (service layer tests). Ronaldo owns all testing.
- T018–T019 extend Phase 3 test coverage into Phase 4 scope. Parallel execution.
- Messi leads T019 (component interaction) with Ronaldo's testing support.

---

## Batch 2: Phase 4 Implementation (Launch after Batch 1 passes)
*Prerequisite: Batch 1 complete and passing. T018–T019 tests FAIL first, then implementation fixes them.*

| Task | Title | Owner | Support | Status |
|------|-------|-------|---------|--------|
| T020 | [P] Encode flow ownership & extension metadata in models | **Cruyff** | — | BLOCKED |
| T021 | Refine store API to enforce single text update entry point | **Messi** | — | BLOCKED |
| T022 | Refine service-to-utility boundaries in metrics service | **Cruyff** | — | BLOCKED |
| T023 | Add extension-ready metric structures & calculator | **Cruyff** | — | BLOCKED |

**Rationale:**
- T020: Models & contracts are service/data layer (Cruyff domain). Parallelizable.
- T021: Store refinement driven by T019 test feedback (Messi). Tests → implementation.
- T022–T023: Metric structures and utilities follow T018 test findings (Cruyff). Together they tighten boundaries.

**Validation Gate:** ng test passes on updated specs before T024 launch.

---

## Batch 3: Phase 5 Documentation (Launch after Batch 2 passes)
*Prerequisite: Phase 4 complete. All architectural decisions stable. Tests passing.*

| Task | Title | Owner | Support | Status |
|------|-------|-------|---------|--------|
| T024 | [P] Prepare architecture smoke-check checklist (quickstart.md) | **Pele** | — | BLOCKED |
| T025 | [P] Prepare documentation review assertions (ui-architecture.md) | **Zidane** | — | BLOCKED |
| T026 | [P] Document project structure & flow in README.md | **Pele** | — | BLOCKED |
| T027 | [P] Record architectural decision in ADR 0001 | **Pele** | — | BLOCKED |
| T028 | [P] Write technical architecture guide (contador-texto.md) | **Cruyff** | — | BLOCKED |
| T029 | Add release-note entry for baseline (docs/releases/) | **Messi** | — | BLOCKED |

**Rationale:**
- T024: Smoke-check & validation (Pele leads as architect). Parallel docs work starts.
- T025: A11y assertions in contracts (Zidane). Validates Phase 3 & 4 a11y contracts.
- T026–T027: Architecture narrative & decision log (Pele). Parallelizable documentation.
- T028: Technical guide for service/utility layer (Cruyff).
- T029: Release notes (Messi) summarize delivered Phase 3 & 4 scope.

**Validation Gate:** Documentation snapshot review by Pele before Phase 6.

---

## Batch 4: Polish & Validation (Launch after Batch 3 passes)
*Prerequisite: All feature code complete. All documentation drafted.*

| Task | Title | Owner | Support | Status |
|------|-------|-------|---------|--------|
| T030 | [P] Run `ng test` for service, metrics, shell specs | **Ronaldo** | — | BLOCKED |
| T031 | [P] Run `ng lint` against shell & store code | **Messi** | — | BLOCKED |
| T032 | [P] Run `ng build` using app config & main.ts | **Messi** | — | BLOCKED |
| T033 | Validate shell, a11y, responsive layout in Simple Browser | **Zidane** | Maradona | BLOCKED |
| T034 | Review updated documentation (final sign-off) | **Pele** | — | BLOCKED |

**Rationale:**
- T030–T032: Mandatory CI/CI gates (unit, lint, build). Ronaldo owns tests; Messi owns lint/build config.
- T033: A11y validation with visual layout review (Zidane primary, Maradona secondary for UX sign-off).
- T034: Lead architect final documentation review (Pele).

**Validation Gate:** All gates pass; code ready for merge and release.

---

## Immediate Next Launch (NOW)

### Primary Batch (3 agents, parallel launch):

```
1. Ronaldo: T008 (complete metrics service unit tests)
2. Ronaldo: T018 (extend store tests — write failing tests first)
3. Messi: T019 (add interaction coverage — write failing tests first)
```

### Why Now:
- T008 is the last foundation blocker.
- T018–T019 are test-first (TDD pattern): write failures, then Batch 2 impl fixes them.
- All three are independent; zero blocking dependencies.
- Tests establish acceptance criteria for Phase 4 implementation.

### Success Criteria:
- T008 passes: `ng test` on metrics-computation.service.spec.ts
- T018 FAILS as expected: new assertions on store single-write & projection behavior
- T019 FAILS as expected: new assertions on component–service interaction
- All three ready for handoff by EOD session

---

## Team Coordination Notes

### Owner Assignments Summary:
- **Pele:** T024, T026, T027, T034 (Architecture lead & sign-off)
- **Messi:** T019, T021, T029, T031, T032 (Frontend & build)
- **Maradona:** T033 support (Layout validation)
- **Zidane:** T025, T033 (A11y gates & semantic validation)
- **Cruyff:** T020, T022, T023, T028 (Data layer & service refinement)
- **Ronaldo:** T008, T018, T030 (All testing & validation)

### Dependency Chain:
1. **Batch 1** → Tests establish Phase 4 scope
2. **Batch 2** → Implementation satisfies test contracts
3. **Batch 3** → Documentation follows stable architecture
4. **Batch 4** → Validation & sign-off gates

### Known Constraints:
- Constitution requires `ng test`, `ng lint`, `ng build` before merge.
- A11y validation is non-negotiable (WCAG 2.1 AA).
- Small PRs preferred (GitHub convention). Batch 2 & 3 may split across multiple PRs.
- Feature flags remain available for decoupled delivery (Ralph's T016–T017 baseline).

### Risk Mitigation:
- **Test-first pattern:** Batch 1 failures inform Batch 2 design.
- **Documentation lag:** Batch 3 follows Batch 2 completion, not assumption.
- **A11y regression:** Zidane validates Batch 4 before release.
- **Build failures:** Messi owns lint/build gates; fast feedback loop.

---

## Sign-Off

- [ ] Pele reviews and approves allocation
- [ ] Elbrinner accepts launch sequence
- [ ] Scribe logs decision and team dispatch

**Ready to spawn Batch 1 agents.**
