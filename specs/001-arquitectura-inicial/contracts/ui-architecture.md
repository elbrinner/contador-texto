# UI Architecture Contract: Arquitectura Inicial de la Aplicacion

## Purpose

Definir el contrato visible de la arquitectura inicial para que cualquier
implementacion futura mantenga el mismo reparto de responsabilidades entre shell,
entrada, calculo y presentacion.

---

## T025: Documentation Review Assertions

**Status:** Ready for human review  
**Scope:** Verify current implementation aligns with contracts below

### Route Contract ✓

**Assertion 1:** Root route `/` MUST exist and MUST render `AnalysisShellComponent`
- **Verification:** `src/app/app.routes.ts` line 5-9 — `{ path: '', component: AnalysisShellComponent }`

**Assertion 2:** `AppComponent` MUST own only page-level framing (header + router outlet)
- **Verification:** `src/app/app.component.ts` lines 8-21 — single `<header>` block + `<router-outlet />`

**Assertion 3:** No nav, auth, or layout logic resides in `AppComponent`
- **Verification:** `AppComponent` is ChangeDetectionStrategy.OnPush with zero injected services or state

---

### Composition Contract ✓

**Assertion 4:** `AnalysisShellComponent` MUST import and render exactly two child components
- **Verification:** `src/app/components/analysis-shell/analysis-shell.component.ts` line 9 — `imports: [TextInputPanelComponent, MetricsPanelComponent]`

**Assertion 5:** `TextInputPanelComponent` MUST expose a single `valueChange` output emitting `string`
- **Verification:** `src/app/components/text-input-panel/text-input-panel.component.ts` line 30 — `readonly valueChange = output<string>()`

**Assertion 6:** `TextInputPanelComponent` MUST NOT import `MetricsPanelComponent` or any metrics models
- **Verification:** `src/app/components/text-input-panel/text-input-panel.component.ts` — zero imports from `../metrics-panel/` or `models/`

**Assertion 7:** `MetricsPanelComponent` MUST accept `metrics` (required input) and `isPending` (optional input)
- **Verification:** `src/app/components/metrics-panel/metrics-panel.component.ts` lines 14-15 — `readonly metrics = input.required<TextAnalysisMetrics>()` + `readonly isPending = input(false)`

**Assertion 8:** `MetricsPanelComponent` MUST NOT import `TextInputPanelComponent` or emit text changes
- **Verification:** `src/app/components/metrics-panel/metrics-panel.component.ts` — zero `output()` declarations, no import of text-input-panel

---

### State Ownership Contract ✓

**Assertion 9:** `TextAnalysisStoreService` MUST be the single write boundary for source text
- **Verification:** `src/app/services/text-analysis-store.service.ts` line 20-29 — `updateText()` is the only public mutator

**Assertion 10:** `sourceText` MUST be exposed as readonly signal
- **Verification:** `src/app/services/text-analysis-store.service.ts` line 15 — `readonly sourceText = this.sourceTextState.asReadonly()`

**Assertion 11:** `metrics` MUST be a computed projection, never mutated directly
- **Verification:** `src/app/services/text-analysis-store.service.ts` line 17 — `readonly metrics = computed(() => this.analysis().metrics)`

**Assertion 12:** `AnalysisShellComponent` MUST call store's `updateText()` on panel input change
- **Verification:** `src/app/components/analysis-shell/analysis-shell.component.ts` lines 29-31 — `updateText(nextText: string)` delegates to `this.textAnalysisStore.updateText(nextText)`

---

### Domain Computation Contract ✓

**Assertion 13:** Text normalization and token estimation MUST NOT live in components
- **Verification:** No `normalize()`, `estimateTokens()`, or computation logic in `text-input-panel.component.ts` or `metrics-panel.component.ts`

**Assertion 14:** Computation MUST be owned by `MetricsComputationService`
- **Verification:** `src/app/services/text-analysis-store.service.ts` line 9 — `private readonly metricsComputation = inject(MetricsComputationService)` + line 25 — `this.metricsComputation.computeText(text)`

---

### Extension Contract ✓

**Assertion 15:** New metrics MUST enter via models + store projection before appearing in templates
- **Verification:** `TextAnalysisMetrics` model contract in `src/app/models/` defines shape; store exposes as `computed()` projection; panels consume via inputs

**Assertion 16:** Data flow MUST be unidirectional: store → shell → panels
- **Verification:** `AnalysisShellComponent` reads store signals and passes data to panels via inputs; no panel-to-panel or panel-to-store back-references