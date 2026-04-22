# Quickstart: Arquitectura Inicial de la Aplicacion

## Objective

Validar que la implementación presente respeta la arquitectura inicial definida
para Contador Texto, con énfasis en estructura de código, flujo de datos,
responsividad y accesibilidad bajo restricciones reales (teclado, lectores de
pantalla, moviles).

## Preconditions

1. Usar una versión de Node compatible con Angular 21.
2. Instalar dependencias del workspace (`npm install`).
3. Tener disponible el navegador integrado de VS Code (Simple Browser) para validación visual y de teclado.
4. Estar familiarizado con pruebas de accesibilidad: navegación por teclado, focus visible, y semántica ARIA.

## Implementation Validation Flow

1. Crear la estructura Angular inicial respetando `src/app/components/`,
   `src/app/services/`, `src/app/utils/` y `src/app/models/`.
2. Implementar una sola ruta `/` que renderice un `analysis-shell`.
3. Conectar la entrada de texto a un store con Signals (single source of truth).
4. Delegar normalización y cálculo de métricas a utilidades puras y a un
   servicio orquestador.
5. Mostrar resultados en un panel de métricas desacoplado del panel de entrada.
6. Validar accesibilidad: navegación por teclado, semántica ARIA, contraste y
   responsividad.

## Required Validation Commands

```bash
ng test
ng lint
ng build
```

## Architecture Smoke-Check Checklist (T024)

### Part 1: Code Structure & Architecture Boundaries

**Composition & Ownership**
- [ ] `analysis-shell.component.ts` imports and composes `TextInputPanelComponent` and `MetricsPanelComponent`
- [ ] `analysis-shell.component.ts` injects `TextAnalysisStoreService` (single state owner)
- [ ] `TextInputPanelComponent` **does NOT** import `MetricsPanelComponent` (decoupled)
- [ ] `MetricsPanelComponent` **does NOT** import `TextInputPanelComponent` (decoupled)
- [ ] `analysis-shell.component.ts` exposes `sourceText`, `metrics`, and `isPending` signals from store
- [ ] `text-input-panel` calls `updateText()` only (single write entry point through shell)

**Data Flow Contract**
- [ ] `TextAnalysisStoreService` holds `sourceTextState` and `analysisState` as private signals
- [ ] Store exposes read-only computed signals: `sourceText`, `metrics`, `isPending`, `normalizedText`
- [ ] Metrics panel receives full `TextAnalysisMetrics` snapshot via input, **no computation** in template
- [ ] No metric logic lives in component templates (validation: `metrics-panel.component.html` does not contain complex arithmetic or string manipulation)

### Part 2: Visual & Responsive Review (Simple Browser)

**Desktop (1200px+) Layout**
1. Open the app at `/` in Simple Browser
2. Verify two-panel layout: left side ≥70% textarea, right side ≥30% metrics
3. Verify textarea placeholder visible: "Pega o escribe tu texto aquí."
4. Verify metrics panel shows: "Resumen de métricas" heading + metric cards
5. Verify metrics update in real-time as text is typed or pasted
6. Verify `statusMessage` updates appropriately:
   - Empty: "Escribe o pega texto para ver un resumen…"
   - With text: "Las métricas se mantienen sincronizadas…"

**Mobile (375px - 667px) Layout**
1. Resize Simple Browser to mobile viewport
2. Verify layout stacks: textarea **above** metrics panel (single column)
3. Verify textarea remains usable (not cut off, resize handles visible)
4. Verify metrics panel scrolls into view if needed (no fixed overflow)
5. Verify metric values remain readable (no text truncation)

**Tablet (768px - 1024px) Layout**
1. Resize to tablet viewport
2. Verify layout adjusts smoothly between mobile and desktop breakpoints
3. Verify no orphaned or misaligned content

### Part 3: Keyboard & Accessibility Review

**Keyboard Navigation**
- [ ] Focus management:
  - [ ] Tab into textarea → textarea receives focus (blue/visible outline)
  - [ ] Type text in textarea → metrics panel updates without stealing focus
  - [ ] Tab out of textarea → next focusable element receives focus (e.g., body or skip link if present)
- [ ] No keyboard traps: user can always Tab away from any interactive element
- [ ] Textarea is the only interactive element in the flow (no clickable metric cards for MVP)

**Semantic HTML & ARIA**
- [ ] Textarea has visible `<label>` associated by `for` attribute (id: "analysis-text")
- [ ] Textarea has `aria-label="Texto a analizar"` or equivalent
- [ ] Textarea has `aria-describedby` pointing to description and footer elements
- [ ] Metrics panel is a `<section>` or `<div role="region">` with `aria-label="Resumen de métricas"`
- [ ] Live region (aria-live) should announce metric updates without stealing focus (validation: will be verified in T033 with screen reader)
- [ ] No unlabeled form controls
- [ ] Headings follow logical order (h1 → h2 → h3, no gaps)

**Screen Reader Readability** (Validation Target for T033)
- [ ] All interactive elements announce their purpose when focused
- [ ] Metric values announce in plain language (e.g., "Palabras: 42, Caracteres: 256, Tokens: 63")
- [ ] Status changes announced without user needing to re-read the page

**Color Contrast** (Validation Target for T033)
- [ ] All text meets WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- [ ] Metric cards have sufficient contrast between text and background
- [ ] No information conveyed by color alone (e.g., red error state also has text or icon)

**Motion & Reduced-Motion Preferences**
- [ ] Animations (if any) respect `prefers-reduced-motion: reduce`
- [ ] Core functionality works without JavaScript animations
- [ ] No auto-playing animations on page load

### Part 4: Command Validation

**Automated Checks**
```bash
# Unit tests for store, shell, components
ng test --include='**/*store.service.spec.ts' --include='**/*analysis-shell.component.spec.ts'

# Lint check for TypeScript and template compliance
ng lint

# Build check for production-ready output
ng build
```

### Part 5: Sign-Off Criteria

- [ ] All Part 1 (Code Structure) checks pass
- [ ] All Part 2 (Visual & Responsive) checks verified in Simple Browser at three breakpoints
- [ ] All Part 3 (Keyboard & Accessibility) checks verified with keyboard-only navigation
- [ ] All Part 4 (Command Validation) checks pass with no errors
- [ ] Architecture boundaries remain intact (no cross-component imports, single store ownership)
- [ ] Next step: T025 (documentation review assertions) + T033 (full browser & screen reader validation)

## Documentation Follow-through

1. Actualizar README con la estructura base del proyecto.
2. Registrar la decisión arquitectónica inicial en un ADR.
3. Reflejar cambios estructurales y de accesibilidad en documentación técnica y release notes.
4. Usar esta quickstart como base para T033 (validación en navegador con foco en accesibilidad).