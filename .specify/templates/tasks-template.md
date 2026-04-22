---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Service unit tests and the `ng test`/`ng lint`/`ng build` validation
cycle are mandatory for this repository. Add broader tests when the feature
specification or design requires them.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular web app**: `src/app/components/`, `src/app/services/`,
  `src/app/utils/`, `src/app/models/`
- **Project assets**: `src/assets/`, `src/styles/`
- Adjust paths only when the implementation plan records a justified exception

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Angular 21 app structure per implementation plan
- [ ] T002 Configure TailwindCSS and strict TypeScript project defaults
- [ ] T003 [P] Scaffold `src/app/components/`, `src/app/services/`, `src/app/utils/`, and `src/app/models/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Establish the application shell and shared layout primitives
- [ ] T005 [P] Define Signals-based state boundaries and shared reactive utilities
- [ ] T006 [P] Configure linting, formatting, and repository validation scripts
- [ ] T007 Create base models and utilities shared across user stories
- [ ] T008 Setup service unit-test harness and testing conventions
- [ ] T009 Identify documentation surfaces and release-note requirements

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Add service unit tests in src/app/services/[feature].service.spec.ts
- [ ] T011 [P] [US1] Add component or integration-style UI test for the primary user journey

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create domain models in src/app/models/[feature].model.ts
- [ ] T013 [P] [US1] Create UI primitives in src/app/components/[feature]/
- [ ] T014 [US1] Implement feature service in src/app/services/[feature].service.ts
- [ ] T015 [US1] Wire Signals-based state and templates in src/app/components/[feature]/
- [ ] T016 [US1] Add validation and empty-state handling for the user journey
- [ ] T017 [US1] Verify accessibility and responsive behavior for the story

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Add service unit tests in src/app/services/[feature].service.spec.ts
- [ ] T019 [P] [US2] Add UI test coverage for the secondary user journey

### Implementation for User Story 2

- [ ] T020 [P] [US2] Extend domain models in src/app/models/[feature].model.ts
- [ ] T021 [US2] Implement feature service behavior in src/app/services/[feature].service.ts
- [ ] T022 [US2] Implement UI behavior in src/app/components/[feature]/
- [ ] T023 [US2] Integrate with User Story 1 components if needed

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 ⚠️

- [ ] T024 [P] [US3] Add service unit tests in src/app/services/[feature].service.spec.ts
- [ ] T025 [P] [US3] Add UI or integration-style coverage for the tertiary journey

### Implementation for User Story 3

- [ ] T026 [P] [US3] Extend models in src/app/models/[feature].model.ts
- [ ] T027 [US3] Implement service behavior in src/app/services/[feature].service.ts
- [ ] T028 [US3] Implement UI behavior in src/app/components/[feature]/

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Update README, ADRs, technical docs, and release notes as needed
- [ ] TXXX Run `ng test`, `ng lint`, and `ng build`
- [ ] TXXX Validate affected UI in Simple Browser
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX [P] Add any remaining unit or integration coverage required by the spec
- [ ] TXXX Review follow-up issues and record out-of-scope findings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Service unit tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify mandatory tests fail before implementing
- Include `ng test`, `ng lint`, `ng build`, and Simple Browser validation before handoff
- Update documentation whenever behavior or architecture changes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
