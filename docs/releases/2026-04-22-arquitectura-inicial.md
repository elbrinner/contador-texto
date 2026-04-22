# Release: Arquitectura Inicial — 2026-04-22

**Version**: 0.0.0  
**Milestone**: Architecture Baseline & MVP Shell  
**Status**: Ready for Review

## Overview

Inicial architecture and minimum viable shell for Contador Texto. Establishes a single-flow text analysis application with clear boundaries between UI, state management, computation, and models.

**What's included**:
- Angular 21 standalone application with single `/` route
- Signal-driven state management through `TextAnalysisStoreService`
- Pure utility functions for text normalization and metric computation
- Accessible UI shell composing input and metrics panels
- Complete type contracts and boundary documentation

**What ships next phase**:
- Multi-format output projections (Raw, Markdown, JSON)
- Smooth metric animations
- Advanced token estimation
- Feature flags for decoupled delivery

## Features

### User Story 1 ✅ — Establish Base Structure
- Analysis shell as root composition at `/` route
- Text input panel with accessible labeling
- Metrics panel displaying character, word, and token counts in real-time
- Signals-based state with single write entry point through store
- Responsive layout: stacked on mobile (360px+), split on desktop

### User Story 2 ✅ — Explicit Boundaries
- Clear separation: components cannot compute metrics
- Pure utilities in `src/app/utils/` for all calculation logic
- Service-to-utility contracts documented in types
- Metrics computation service as single orchestration point
- Extension rules defined for new metrics without reorganizing base

### User Story 3 ✅ — Operational Documentation
- Project structure documented in README
- Architecture Decision Record (ADR 0001) with principles and trade-offs
- Technical guide in `docs/architecture/`
- Release notes (this file)
- Implementation checklist and validation contracts in `specs/`

## Architecture Baseline

### Core Components

**Text Input Panel** – Captures and normalizes user input
- Emits `valueChange` event
- Accessible with `<label>` association
- No metric computation responsibility

**Analysis Shell** – Composes input and metrics panels
- Manages responsive layout
- Wires store to both panels
- Single routable component at `/`

**Metrics Panel** – Displays computed metrics
- Reads Signals (analysis, isPending)
- ARIA live region announces changes
- No direct access to computation logic

### Core Services

**TextAnalysisStoreService** – Signal-driven state container
```typescript
readonly analysis: Signal<TextAnalysisComputation>
readonly sourceText: Signal<string>
readonly metrics: Signal<TextAnalysisMetrics>
readonly normalizedText: Signal<string>
readonly isPending: Signal<boolean>

updateText(text: string): void  // Single write entry point
```

**MetricsComputationService** – Orchestrates the analysis flow
```typescript
compute(input: TextAnalysisInput): TextAnalysisComputation
computeText(text: string): TextAnalysisComputation
```

### Core Utilities

**text-normalizer.ts** – Normalizes input text
**token-estimator.ts** – Estimates token counts (GPT-3.5 heuristic by default)
**metrics-calculator.ts** – Computes character, word, and token metrics

### Models

**TextAnalysisInput** – User-provided text  
**TextAnalysisMetrics** – Computed results (characters, words, tokens)  
**ArchitecturalArea**, **FlowStage**, **EvolutionRule** – Design documentation contracts

## Quality Validation

### Tests Passing
- ✅ Unit tests for `MetricsComputationService` (metrics accuracy)
- ✅ Unit tests for `TextAnalysisStoreService` (state mutations)
- ✅ Component tests for shell composition and event flow
- ✅ Accessibility tests for ARIA landmarks and live regions

### Build & Lint
- ✅ `npm test` – All specs pass
- ✅ `npm lint` – ESLint compliance, no warnings
- ✅ `npm run build` – Production bundle succeeds

### Visual Validation
- ✅ Simple Browser – Responsive behavior confirmed (360px to 1920px)
- ✅ Text input captures user text
- ✅ Metrics update in real-time as text changes
- ✅ Mobile layout stacks panels, desktop uses 70/30 split

### Accessibility
- ✅ WCAG 2.1 Level AA – Color contrast, labels, live regions
- ✅ Screen reader tested – Metrics announced on change
- ✅ Keyboard navigation – All interactive elements accessible

## Documentation

**For users**:
- README.md – Quick start and project overview
- docs/adr/0001-arquitectura-inicial.md – Architecture principles and decisions

**For developers**:
- docs/architecture/contador-texto.md – Technical deep dive
- specs/001-arquitectura-inicial/ – Design, planning, and evolution rules

**For maintainers**:
- Quality gates documented (tests, lint, build, visual validation)
- Extension rules defined (new metrics, estimators, views)
- Documentation surfaces identified (README, ADR, release notes, guides)

## Known Limitations

1. **Single route only** – All interaction through `/`. Future phases will add secondary routes.
2. **In-memory state** – No persistence. Closing the tab clears analysis. Future: localStorage or server sync.
3. **Single token estimator** – Only GPT-3.5 heuristic available. Future: pluggable encoders.
4. **Static metrics display** – No animations. Future: Signal-driven transitions with Angular animations.
5. **No multi-format support** – Raw format only. Future: Markdown and JSON projections.

## Migration Path

Code that built against previous versions:
- N/A – This is the initial baseline.

For future extensions:
- New metrics: Add to `TextAnalysisMetrics` model and implement in `metrics-calculator.ts`
- New displays: Create components in `components/` that consume Signals from store
- New estimators: Implement `TokenEstimator` interface, provide via `TOKEN_ESTIMATOR` injection token
- New routes: Add to `app.routes.ts`, compose in `app.component.ts` layout

## Roadmap

### Phase 1B — Multi-Format & Polish
- [ ] Format projection (Raw, Markdown, JSON)
- [ ] Live metric animations
- [ ] Feature flags system
- [ ] Advanced token estimation (OpenAI, UTF-8, BPE variants)

### Phase 2 — Extensibility & Collaboration
- [ ] Shared workspace (save/load analysis)
- [ ] API integration for real token counts
- [ ] Plugin system for custom metrics
- [ ] Offline PWA capability

## Contributors

- **Pele** – Lead, architecture decisions, documentation
- **Messi** – Implementation lead, store wiring
- **Cruyff** – Service contracts and computation
- **Ronaldo** – Test authoring and quality validation
- **Maradona** – Layout and responsive design
- **Zidane** – Accessibility validation

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start
# Navigate to http://localhost:4200

# Run tests
npm test

# Run linter
npm lint

# Build for production
npm run build
```

## Feedback & Issues

- Architecture concerns: Open an issue in GitHub with label `architecture`
- Feature requests: Add to the roadmap discussion
- Bug reports: Include reproduction steps and Angular/environment details

---

**Released by**: Pele (Lead)  
**Date**: 2026-04-22  
**Next Review**: 2026-05-06
