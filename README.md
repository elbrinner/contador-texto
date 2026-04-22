# Contador Texto

> **Proof of Concept:** This repository demonstrates how to use [Spec Kit](https://github.com/github/copilot-cli) to define features through structured artifacts, and [Squad](https://github.com/github/copilot-cli) to implement them as a coordinated team of AI agents.

A lightweight, accessible text analysis application built with Angular 21. Analyze character counts, word counts, and token estimates in real-time as you write.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start
# Open http://localhost:4200

# Run tests
npm test

# Lint code
npm lint

# Build for production
npm run build
```

---

## How This Project Works

This proof of concept uses two key methodologies:

1. **[Spec Kit](https://github.com/github/copilot-cli)** — Define features through structured design artifacts (specifications, plans, tasks, research documents)
2. **[Squad](https://github.com/github/copilot-cli)** — Implement via a coordinated team of AI agents (each with specialized expertise) that follow the design

### The Workflow

```
Spec Kit (Design)           Squad (Implementation)
├─ spec.md                  ├─ Pele (Lead)
├─ plan.md          ───→    ├─ Messi (Frontend)
├─ tasks.md                 ├─ Cruyff (Backend)
├─ data-model.md            ├─ Maradona (UX)
└─ research.md              ├─ Zidane (A11y)
                            ├─ Ronaldo (Testing)
                            ├─ Scribe (Logging)
                            └─ Ralph (Monitoring)
```

---

## Squad: Team Structure & Files

The `.squad/` folder contains agent charters, decisions, and coordination artifacts.

### Core Files

| File | Purpose |
|------|---------|
| `.squad/config.json` | Squad version and configuration metadata |
| `.squad/team.md` | Team roster: agent names, roles, and charter locations |
| `.squad/routing.md` | Work routing table: which agent handles which type of task |
| `.squad/ceremonies.md` | Team ceremonies: design reviews, retrospectives |
| `.squad/decisions.md` | Decision log: architectural choices, task allocations, feature decisions |

### Agent Directories

| Agent | Role | Files |
|-------|------|-------|
| **Pele** | Lead | `.squad/agents/pele/history.md` — Context, learnings, approvals |
| **Messi** | Frontend Dev | `.squad/agents/messi/charter.md` — Angular components, state, routes |
| **Cruyff** | Backend Dev | `.squad/agents/cruyff/charter.md` — Data contracts, services, APIs |
| **Maradona** | UX/UI Designer | `.squad/agents/maradona/charter.md` — User flows, layout, interaction |
| **Zidane** | Accessibility | `.squad/agents/zidane/charter.md` — WCAG compliance, semantic markup |
| **Ronaldo** | Tester | `.squad/agents/ronaldo/charter.md` — Unit tests, edge cases, coverage |
| **Scribe** | Session Logger | `.squad/agents/scribe/charter.md` — Automatic session documentation |
| **Ralph** | Work Monitor | `.squad/agents/ralph/charter.md` — Backlog tracking, task sequencing |

### Key Artifacts

- **`.squad/log/`** — Timestamped logs of each work session
- **`.squad/orchestration-log/`** — Cross-agent dependency tracking and handoff records
- **`.squad/identity/now.md`** — Current project state (status, phase, blockers)
- **`.squad/casting/`** — Agent casting decisions for complex features

---

## Spec Kit: Design Artifacts

The `specs/001-arquitectura-inicial/` folder contains the complete design for the initial application architecture.

### Purpose

Before any code is written, Spec Kit ensures the team aligns on *what* to build, *why*, and *how*. Each artifact serves a specific purpose in the design process.

### Core Design Files

| File | Purpose |
|------|---------|
| **`spec.md`** | Feature specification: clarifications, user stories, acceptance scenarios, and testing strategy |
| **`plan.md`** | Implementation plan: technical context, design summary, and phase breakdown |
| **`tasks.md`** | Actionable task list: 34 tasks organized by user story, dependency-ordered, assigned to agents |
| **`data-model.md`** | Data contracts: input/output models, state structure, signal dependencies |
| **`research.md`** | Research findings: token estimation analysis, performance baselines, similar projects |
| **`quickstart.md`** | Validation checklist: smoke-test procedures, visual & keyboard verification steps |

### Supporting Contracts

| File | Purpose |
|------|---------|
| **`contracts/ui-architecture.md`** | UI-specific contracts: component responsibility, composition rules, data flow |
| **`checklists/`** | Feature-specific validation checklists (smoke tests, accessibility, responsive design) |

---

## Project Structure

The application follows a single-responsibility architecture centered on one main flow: capturing text and computing analysis metrics.

```
src/app/
├── components/          # UI layers and composition
│   ├── analysis-shell/          # Root layout composition
│   ├── text-input-panel/        # Text capture and normalization
│   └── metrics-panel/           # Analysis output display
├── services/            # State management and orchestration
│   ├── text-analysis-store.service.ts       # Signal-driven state container
│   └── metrics-computation.service.ts       # Orchestration and contracts
├── utils/               # Pure calculation functions
│   ├── text-normalizer.ts       # Input normalization
│   ├── token-estimator.ts       # Token count estimation
│   └── metrics-calculator.ts    # Metric computation logic
└── models/              # Type contracts
    ├── text-analysis-input.model.ts        # Input contract
    └── text-analysis-metrics.model.ts      # Output contract
```

## Architecture Principles

### 1. **Single Flow**  
Text flows from input → normalization → computation → display. Each stage owns its data and transformation.

### 2. **Clear Boundaries**  
- **Components** consume state but never compute metrics directly
- **Services** orchestrate flow and manage Signal-driven state
- **Utils** contain pure, testable calculation functions
- **Models** define type contracts and prevent implicit coupling

### 3. **Extensibility**  
New metrics, input formats, or display modes can be added without reorganizing the base flow. Extensions enter through defined areas:
- New metrics: add to `metrics-calculator` and `TextAnalysisMetrics` model
- New views: compose components in the shell
- New estimation methods: implement the `TokenEstimator` interface

### 4. **No Leaky Abstractions**  
The UI has no awareness of metric computation logic. The store provides read-only Signals. Services communicate through frozen immutable contracts.

## Core Components

### Text Input Panel  
Captures user text and emits normalized content to the store.

### Analysis Shell  
Composes input and metrics panels. Manages the layout and wiring between data flows.

### Metrics Panel  
Displays computed metrics in real-time. Accessible via ARIA live regions for screen readers.

## Data Flow

```
User Text Input
    ↓
text-input-panel (emits valueChange)
    ↓
store.updateText()
    ↓
metrics-computation.computeText()
    ├─ normalizeTextAnalysisInput()
    └─ calculateTextMetrics()
    ↓
store.analysis (Signal)
    ↓
metrics-panel (reads and displays)
```

## Testing

Unit tests cover:
- **Services**: State mutations, computation accuracy
- **Components**: Composition, event flow, accessibility contracts
- **Utils**: Normalization and metric accuracy across edge cases (non-Latin, emoji, combining marks)

Run tests:
```bash
npm test
```

## Accessibility

All components follow WCAG 2.1 Level AA:
- Metrics panel announces changes via `aria-live="polite"`
- Text input has associated `<label>`
- Interactive elements have sufficient color contrast
- Responsive layout supports mobile (360px+) and desktop views

## Quality Gates

All changes require:
- `npm test` – All suites pass
- `npm lint` – No linting errors
- `npm run build` – Production build succeeds
- Simple Browser validation – Visual and responsive behavior verified
- Documentation updates – Architecture changes reflected in ADR and release notes

## Documentation

- **[ADR 0001](./docs/adr/0001-arquitectura-inicial.md)** – Initial architecture decision and rationale
- **[Technical Guide](./docs/architecture/)** – Deep dive into design, evolution rules, and extension points
- **[Release Notes](./docs/releases/)** – Feature and architecture baseline changelog

## Future Extensions

Phase 1B and beyond will introduce:
- Multi-format output (Raw, Markdown, JSON)
- Live metric animations
- Advanced token estimation (pluggable encoders)
- Feature flags for decoupled delivery

See `specs/001-arquitectura-inicial/` for design documents and implementation plans.

---

**Version**: 0.0.0  
**Angular**: 21.2  
**Last Updated**: 2026-04-22
