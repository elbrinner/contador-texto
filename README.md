# Contador Texto

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
