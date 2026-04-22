# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript strict, Angular 21 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Angular standalone APIs, Signals, TailwindCSS or NEEDS CLARIFICATION]  
**Storage**: [e.g., browser-only state, localStorage, IndexedDB, or N/A]  
**Testing**: [e.g., `ng test`, service unit tests, component tests or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., modern browsers, mobile + desktop responsive web or NEEDS CLARIFICATION]
**Project Type**: [e.g., frontend SPA, browser-only web app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., near-real-time UI updates, sub-second feedback or NEEDS CLARIFICATION]  
**Constraints**: [Angular 21, standalone components, Signals, TailwindCSS, strict TypeScript, Simple Browser validation]  
**Scale/Scope**: [domain-specific, e.g., single-screen utility, multi-panel UI, shared component surface]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Uses Angular 21 with standalone components only, or documents a waiver.
- [ ] Uses Signals for reactive state unless an integration boundary requires a
  different primitive.
- [ ] Keeps code inside the agreed `components/`, `services/`, `utils/`, and
  `models/` slices, or justifies additions.
- [ ] Preserves strict TypeScript and TailwindCSS as defaults.
- [ ] Plans explicit validation for `ng test`, `ng lint`, and `ng build`.
- [ ] Includes unit-test coverage for every changed service.
- [ ] Identifies UI surfaces that require Simple Browser validation.
- [ ] Identifies README, ADR, technical-doc, and release-note impact.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── models/
├── assets/
└── styles/
```

**Structure Decision**: [Document the selected Angular structure, list any
feature-specific folders, and justify any slice beyond `components/`,
`services/`, `utils/`, and `models`.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
