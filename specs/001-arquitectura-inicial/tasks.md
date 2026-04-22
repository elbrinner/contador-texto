---

description: "Task list for initial application architecture implementation"
---

# Tasks: Arquitectura Inicial de la Aplicacion

**Input**: Design documents from `/specs/001-arquitectura-inicial/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Esta feature requiere pruebas unitarias de servicios y validacion obligatoria con `ng test`, `ng lint` y `ng build` por constitucion del repositorio.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular app**: `src/app/components/`, `src/app/services/`, `src/app/utils/`, `src/app/models/`
- **Project config**: `package.json`, `angular.json`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`
- **Documentation**: `README.md`, `docs/adr/`, `docs/architecture/`, `docs/releases/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar el workspace Angular y la base de estilos/configuracion que toda la arquitectura necesita.

- [ ] T001 Initialize Angular 21 workspace configuration in `package.json`, `angular.json`, `tsconfig.json`, and `tsconfig.app.json` (GitHub: #1)
- [ ] T002 Configure TailwindCSS pipeline in `tailwind.config.js`, `postcss.config.js`, and `src/styles.css` (GitHub: #2)
- [ ] T003 [P] Bootstrap the standalone application entry in `src/main.ts`, `src/app/app.config.ts`, and `src/app/app.routes.ts` (GitHub: #3)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Crear las piezas base que bloquean cualquier implementación por historia de usuario.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create domain input and metrics contracts in `src/app/models/text-analysis-input.model.ts` and `src/app/models/text-analysis-metrics.model.ts` (GitHub: #4)
- [ ] T005 [P] Create architecture boundary contracts in `src/app/models/architectural-area.model.ts`, `src/app/models/flow-stage.model.ts`, `src/app/models/evolution-rule.model.ts`, and `src/app/models/quality-gate.model.ts` (GitHub: #5)
- [ ] T006 [P] Implement pure text-analysis helpers in `src/app/utils/text-normalizer.ts`, `src/app/utils/token-estimator.ts`, and `src/app/utils/metrics-calculator.ts` (GitHub: #6)
- [ ] T007 Implement the metrics orchestration service in `src/app/services/metrics-computation.service.ts` (GitHub: #7)
- [ ] T008 [P] Add unit tests for the orchestration service in `src/app/services/metrics-computation.service.spec.ts` (GitHub: #8)
- [ ] T009 Establish the root app host and layout handoff in `src/app/app.component.ts` (GitHub: #9)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Establecer Base Estructural (Priority: P1) 🎯 MVP

**Goal**: Materializar una base estructural clara con un flujo principal de entrada y visualizacion de metricas.

**Independent Test**: Ejecutar `ng test` sobre store y shell, abrir la ruta `/` y comprobar que la shell separa entrada, procesamiento y presentacion sin ambiguedad.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Add unit tests for the Signals store in `src/app/services/text-analysis-store.service.spec.ts` (GitHub: #10)
- [ ] T011 [P] [US1] Add shell composition tests in `src/app/components/analysis-shell/analysis-shell.component.spec.ts` (GitHub: #11)

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create the shell component with responsive layout handoff in `src/app/components/analysis-shell/analysis-shell.component.ts`, `src/app/components/analysis-shell/analysis-shell.component.html`, and `src/app/components/analysis-shell/analysis-shell.component.css` (GitHub: #12)
- [ ] T013 [P] [US1] Create the text input component with accessible labeling and focus behavior in `src/app/components/text-input-panel/text-input-panel.component.ts`, `src/app/components/text-input-panel/text-input-panel.component.html`, and `src/app/components/text-input-panel/text-input-panel.component.css` (GitHub: #13)
- [ ] T014 [P] [US1] Create the metrics panel component with accessible output semantics in `src/app/components/metrics-panel/metrics-panel.component.ts`, `src/app/components/metrics-panel/metrics-panel.component.html`, and `src/app/components/metrics-panel/metrics-panel.component.css` (GitHub: #14)
- [ ] T015 [US1] Implement the Signals store service in `src/app/services/text-analysis-store.service.ts` (GitHub: #15)
- [ ] T016 [US1] Wire the `/` route and root composition in `src/app/app.routes.ts` and `src/app/app.component.ts` (GitHub: #16)
- [ ] T017 [US1] Connect `text-input-panel` and `metrics-panel` through the store in `src/app/components/analysis-shell/analysis-shell.component.ts` (GitHub: #17)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Facilitar Revision y Escalado (Priority: P2)

**Goal**: Hacer explícitos los límites entre capas y el recorrido de datos para soportar extensiones futuras sin acoplamiento innecesario.

**Independent Test**: Verificar por tests e inspección de código que la UI no calcula métricas complejas, que el store ofrece un único punto de escritura y que una nueva métrica puede entrar por modelos y utilidades sin tocar la composición base.

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Extend store behavior tests for single-write and read-only projections in `src/app/services/text-analysis-store.service.spec.ts` (GitHub: #18)
- [ ] T019 [P] [US2] Add input-to-metrics interaction coverage in `src/app/components/analysis-shell/analysis-shell.component.spec.ts` (GitHub: #19)

### Implementation for User Story 2

- [ ] T020 [P] [US2] Encode flow ownership and extension metadata in `src/app/models/architectural-area.model.ts`, `src/app/models/flow-stage.model.ts`, and `src/app/models/evolution-rule.model.ts` (GitHub: #20)
- [ ] T021 [US2] Refine the store API to enforce a single text update entry point in `src/app/services/text-analysis-store.service.ts` (GitHub: #21)
- [ ] T022 [US2] Refine service-to-utility boundaries in `src/app/services/metrics-computation.service.ts` (GitHub: #22)
- [ ] T023 [US2] Add extension-ready metric structures in `src/app/models/text-analysis-metrics.model.ts` and `src/app/utils/metrics-calculator.ts` (GitHub: #23)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Guiar la Documentacion Operativa (Priority: P3)

**Goal**: Dejar trazabilidad documental y operativa para que la arquitectura inicial sea entendible y verificable al crecer.

**Independent Test**: Revisar que README, ADR, guía técnica y nota de release describan la estructura base y que la quickstart permita validar la implementación y la revisión visual.

### Validation for User Story 3 ⚠️

- [ ] T024 [P] [US3] Prepare an architecture smoke-check checklist in `specs/001-arquitectura-inicial/quickstart.md` (GitHub: #24)
- [ ] T025 [P] [US3] Prepare documentation review assertions in `specs/001-arquitectura-inicial/contracts/ui-architecture.md` (GitHub: #25)

### Implementation for User Story 3

- [ ] T026 [P] [US3] Document the project structure and flow in `README.md` (GitHub: #26)
- [ ] T027 [P] [US3] Record the initial architecture decision in `docs/adr/0001-arquitectura-inicial.md` (GitHub: #27)
- [ ] T028 [P] [US3] Write the technical architecture guide in `docs/architecture/contador-texto.md` (GitHub: #28)
- [ ] T029 [US3] Add the release-note entry for the architectural baseline in `docs/releases/2026-04-22-arquitectura-inicial.md` (GitHub: #29)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ejecutar validaciones obligatorias y asegurar la entrega revisable.

- [ ] T030 [P] Run `ng test` from `package.json` for `src/app/services/text-analysis-store.service.spec.ts`, `src/app/services/metrics-computation.service.spec.ts`, and `src/app/components/analysis-shell/analysis-shell.component.spec.ts` (GitHub: #30)
- [ ] T031 [P] Run `ng lint` from `package.json` against `angular.json`, `src/app/components/analysis-shell/analysis-shell.component.ts`, and `src/app/services/text-analysis-store.service.ts` (GitHub: #31)
- [ ] T032 [P] Run `ng build` from `package.json` using `angular.json`, `src/main.ts`, and `src/app/app.config.ts` (GitHub: #32)
- [ ] T033 Validate the shell, accessibility behavior, and responsive layout in Simple Browser against `specs/001-arquitectura-inicial/quickstart.md` (GitHub: #33)
- [ ] T034 Review updated documentation in `README.md`, `docs/adr/0001-arquitectura-inicial.md`, `docs/architecture/contador-texto.md`, and `docs/releases/2026-04-22-arquitectura-inicial.md` (GitHub: #34)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - establishes the minimum viable architecture shell
- **User Story 2 (P2)**: Depends on User Story 1 artifacts because it tightens boundaries around the same flow
- **User Story 3 (P3)**: Depends on User Stories 1 and 2 so the documentation reflects the implemented architecture accurately

### Within Each User Story

- Service unit tests MUST be written and fail before implementation
- Models and contracts precede service refinement
- Services precede shell wiring and component interaction
- Documentation changes follow the implemented architecture, not assumptions

### Parallel Opportunities

- `T003`, `T005`, `T006`, and `T008` can run in parallel once their prerequisites exist
- `T012`, `T013`, and `T014` can run in parallel after the foundational phase
- `T018` and `T019` can run in parallel during User Story 2
- `T026`, `T027`, and `T028` can run in parallel during User Story 3
- `T030`, `T031`, and `T032` can run in parallel in the polish phase

---

## Parallel Example: User Story 1

```bash
# Launch the shell and panel scaffolding together:
Task: "Create the shell component in src/app/components/analysis-shell/analysis-shell.component.ts, src/app/components/analysis-shell/analysis-shell.component.html, and src/app/components/analysis-shell/analysis-shell.component.css"
Task: "Create the text input component in src/app/components/text-input-panel/text-input-panel.component.ts, src/app/components/text-input-panel/text-input-panel.component.html, and src/app/components/text-input-panel/text-input-panel.component.css"
Task: "Create the metrics panel component in src/app/components/metrics-panel/metrics-panel.component.ts, src/app/components/metrics-panel/metrics-panel.component.html, and src/app/components/metrics-panel/metrics-panel.component.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test the route `/` and confirm shell composition

### Incremental Delivery

1. Ship the architectural shell and primary flow first
2. Add explicit boundaries and extension rules next
3. Close with documentation and review artifacts
4. Run mandatory validation and visual review before handoff

### Parallel Team Strategy

1. One engineer prepares Angular/Tailwind setup while another drafts foundational models and utilities
2. After foundation, component scaffolding can proceed in parallel with store tests
3. Documentation work starts once the architecture is visible in code and contracts are stable

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2]/[US3] labels map directly to the specification stories
- Every changed service requires a unit test task
- `ng test`, `ng lint`, `ng build`, and Simple Browser validation are mandatory before handoff
- Avoid placing metric computation directly in components or templates
