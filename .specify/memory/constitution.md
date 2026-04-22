<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Angular Standalone Architecture
- [PRINCIPLE_2_NAME] -> II. Strict TypeScript and Tailwind Discipline
- [PRINCIPLE_3_NAME] -> III. Mandatory Quality Gates
- [PRINCIPLE_4_NAME] -> IV. GitFlow and Controlled Delivery
- [PRINCIPLE_5_NAME] -> V. Agent Accountability and Living Documentation
Added sections:
- Technical Standards
- Workflow and Review
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->
# Contador Texto Constitution

## Core Principles

### I. Angular Standalone Architecture
All user-facing code MUST target Angular 21 and MUST use standalone components.
Reactive behavior in components, services, and derived UI state MUST be modeled
with Signals instead of ad hoc state containers unless an external integration
requires an observable boundary. Source files MUST live within the agreed
`components/`, `services/`, `utils/`, and `models/` slices, or the
implementation plan MUST justify any additional slice before coding starts.
Rationale: the project is intentionally optimized for a simple, inspectable
frontend with predictable structure.

### II. Strict TypeScript and Tailwind Discipline
All code MUST compile under strict TypeScript settings. Implicit `any`, untyped
public interfaces, and shape-by-convention data objects are not allowed unless
the plan records a narrow justification. Styling MUST use TailwindCSS utilities
or project-level Tailwind abstractions; custom CSS is allowed only when Tailwind
cannot express the requirement cleanly. Generated code MUST remain modular,
readable, and small enough for focused review. Rationale: a single typing and
styling discipline reduces hidden coupling and rework.

### III. Mandatory Quality Gates
Every change set destined for review MUST pass `ng test`, `ng lint`, and
`ng build` before it is considered complete. Every service introduced or
modified MUST include unit tests that cover its public behavior, and plans and
tasks MUST make that coverage explicit. Review-sized changes MUST stay small and
independently understandable; if a feature is too large, it MUST be split into
reviewable increments. Rationale: deterministic validation and small PRs are the
default quality mechanism for this project.

### IV. GitFlow and Controlled Delivery
The repository lifecycle MUST preserve GitFlow roles: `main` is production,
`develop` is integration, `release/*` prepares releases, and `hotfix/*`
addresses urgent production corrections. Feature work MUST not land directly on
`main` and MUST flow toward `develop` through review first. Team-managed work
SHOULD use `feature/*` naming; when Spec Kit or other automation creates
numbered feature branches, those branches MUST be treated as feature branches
and follow the same merge discipline. Rationale: release control must stay
compatible with automation without weakening branch safety.

### V. Agent Accountability and Living Documentation
Copilot, Squad, Ralph, Scribe, and any other agent working in this repository
MUST respect SOLID design, run the required validations before handoff,
document meaningful changes in the review artifact, and open issues when they
detect material defects or follow-up improvements outside the approved scope.
Visual UI changes MUST be checked in Simple Browser before completion. Scribe or
the acting agent MUST update affected README content, ADRs, technical
documentation, and release notes whenever behavior, architecture, or operating
instructions change. Rationale: AI assistance is acceptable only when it leaves
an auditable trail and keeps project knowledge current.

## Technical Standards

- The default delivery target is a frontend-only web application running
	entirely in the browser.
- New plans MUST assume accessibility and responsive behavior are part of the
	baseline quality bar, not optional polish.
- Credentials and identities MUST remain separated when using GitHub CLI or
	related tooling; personal and EMU contexts MUST not be mixed in the same
	workflow.
- Any deviation from Angular 21, Signals, TailwindCSS, strict TypeScript, or
	the agreed structural slices MUST be justified in the Constitution Check
	before implementation begins.

## Workflow and Review

- Implementation plans MUST include a Constitution Check covering stack,
	structure, tests, documentation impact, and visual validation duties.
- Specifications MUST describe user-visible behavior, edge cases, and
	measurable outcomes without leaking implementation details, while still
	capturing accessibility or responsive constraints that affect acceptance.
- Task lists MUST include work for service unit tests, the
	`ng test`/`ng lint`/`ng build` validation cycle, Simple Browser visual review
	when UI is affected, and documentation updates when behavior or architecture
	changes.
- Review artifacts MUST state what changed, how it was validated, and which
	documents were updated.

## Governance

This constitution overrides conflicting local habits, ad hoc prompts, and
undocumented workflow shortcuts. Amendments MUST be proposed in writing,
reviewed by the project maintainers, and applied together with any required
template or guidance updates. Versioning follows semantic rules: MAJOR for
incompatible governance changes or removed principles, MINOR for new principles
or materially expanded obligations, and PATCH for clarifications that do not
change intent. Compliance MUST be checked at plan time, before review, and
during final handoff; any waiver MUST record its scope, reason, owner, and
expiry.

**Version**: 1.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22
