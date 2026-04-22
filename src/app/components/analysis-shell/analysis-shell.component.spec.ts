import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { createMetricBreakdown, TextAnalysisMetrics } from '../../models/text-analysis-metrics.model';
import { MetricsComputationService, TextAnalysisComputation } from '../../services/metrics-computation.service';
import { TextAnalysisStoreService } from '../../services/text-analysis-store.service';
import { MetricsPanelComponent } from '../metrics-panel/metrics-panel.component';
import { TextInputPanelComponent } from '../text-input-panel/text-input-panel.component';
import { AnalysisShellComponent } from './analysis-shell.component';

describe('AnalysisShellComponent', () => {
  let computeText: ReturnType<typeof vi.fn>;
  let fixture: ComponentFixture<AnalysisShellComponent>;
  let store: TextAnalysisStoreService;

  const emptyAnalysis = createAnalysis('', {
    characters: 0,
    charactersExcludingWhitespace: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    estimatedTokens: Object.freeze({
      tokens: 0,
      method: 'gpt35-heuristic',
      confidence: 1,
    }),
    breakdown: createMetricBreakdown({
      primary: [
        {
          key: 'words',
          label: 'Palabras',
          value: 0,
          description: 'Conteo de palabras normalizadas.',
        },
        {
          key: 'characters',
          label: 'Caracteres',
          value: 0,
          description: 'Todos los caracteres, incluidos espacios.',
        },
        {
          key: 'tokens',
          label: 'Tokens',
          value: 0,
          description: 'Estimación heurística para modelos de IA.',
        },
      ],
      secondary: [
        {
          key: 'charactersExcludingWhitespace',
          label: 'Caracteres sin espacios',
          value: 0,
          description: 'Útil para revisar contenido neto.',
        },
        {
          key: 'lines',
          label: 'Líneas',
          value: 0,
          description: 'Cada salto de línea cuenta.',
        },
        {
          key: 'paragraphs',
          label: 'Párrafos',
          value: 0,
          description: 'Bloques separados por líneas en blanco.',
        },
      ],
      extensions: [],
    }),
    extensions: [],
  });

  const firstDraftAnalysis = createAnalysis('Hola Angular desde shell', {
    characters: 24,
    charactersExcludingWhitespace: 21,
    words: 4,
    lines: 1,
    paragraphs: 1,
    estimatedTokens: Object.freeze({
      tokens: 6,
      method: 'gpt35-heuristic',
      confidence: 0.75,
    }),
    breakdown: createMetricBreakdown({
      primary: [
        {
          key: 'words',
          label: 'Palabras',
          value: 4,
          description: 'Conteo de palabras normalizadas.',
        },
        {
          key: 'characters',
          label: 'Caracteres',
          value: 24,
          description: 'Todos los caracteres, incluidos espacios.',
        },
        {
          key: 'tokens',
          label: 'Tokens',
          value: 6,
          description: 'Estimación heurística para modelos de IA.',
        },
      ],
      secondary: [
        {
          key: 'charactersExcludingWhitespace',
          label: 'Caracteres sin espacios',
          value: 21,
          description: 'Útil para revisar contenido neto.',
        },
        {
          key: 'lines',
          label: 'Líneas',
          value: 1,
          description: 'Cada salto de línea cuenta.',
        },
        {
          key: 'paragraphs',
          label: 'Párrafos',
          value: 1,
          description: 'Bloques separados por líneas en blanco.',
        },
      ],
      extensions: [],
    }),
    extensions: [],
  });

  const secondDraftAnalysis = createAnalysis('Acoplamiento directo jamás', {
    characters: 27,
    charactersExcludingWhitespace: 25,
    words: 3,
    lines: 1,
    paragraphs: 1,
    estimatedTokens: Object.freeze({
      tokens: 8,
      method: 'bpe-lite',
      confidence: 0.68,
    }),
    breakdown: createMetricBreakdown({
      primary: [
        {
          key: 'words',
          label: 'Palabras',
          value: 3,
          description: 'Conteo de palabras normalizadas.',
        },
        {
          key: 'characters',
          label: 'Caracteres',
          value: 27,
          description: 'Todos los caracteres, incluidos espacios.',
        },
        {
          key: 'tokens',
          label: 'Tokens',
          value: 8,
          description: 'Estimación heurística para modelos de IA.',
        },
      ],
      secondary: [
        {
          key: 'charactersExcludingWhitespace',
          label: 'Caracteres sin espacios',
          value: 25,
          description: 'Útil para revisar contenido neto.',
        },
        {
          key: 'lines',
          label: 'Líneas',
          value: 1,
          description: 'Cada salto de línea cuenta.',
        },
        {
          key: 'paragraphs',
          label: 'Párrafos',
          value: 1,
          description: 'Bloques separados por líneas en blanco.',
        },
      ],
      extensions: [],
    }),
    extensions: [],
  });

  const analysesByText = new Map<string, TextAnalysisComputation>([
    [emptyAnalysis.input.text, emptyAnalysis],
    [firstDraftAnalysis.input.text, firstDraftAnalysis],
    [secondDraftAnalysis.input.text, secondDraftAnalysis],
  ]);

  beforeEach(async () => {
    computeText = vi.fn((text: string) => analysesByText.get(text) ?? emptyAnalysis);

    await TestBed.configureTestingModule({
      imports: [AnalysisShellComponent],
      providers: [
        TextAnalysisStoreService,
        {
          provide: MetricsComputationService,
          useValue: {
            computeText,
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(TextAnalysisStoreService);
    fixture = TestBed.createComponent(AnalysisShellComponent);
    fixture.detectChanges();
  });

  it('renders the shell as the `/` composition root for the text-input-panel and metrics-panel flow', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-text-input-panel')).not.toBeNull();
    expect(host.querySelector('app-metrics-panel')).not.toBeNull();
    expect(host.textContent).toContain('Flujo principal');
  });

  it('routes textarea edits through the shared store and updates the metrics-facing contract with the resulting snapshot', async () => {
    await enterText(firstDraftAnalysis.input.text);

    const textInput = getTextInput();
    const metricsPanel = getMetricsPanel();

    expect(computeText).toHaveBeenNthCalledWith(2, firstDraftAnalysis.input.text);
    expect(store.sourceText()).toBe(firstDraftAnalysis.input.text);
    expect(textInput.value()).toBe(firstDraftAnalysis.input.text);
    expect(store.metrics()).toBe(firstDraftAnalysis.metrics);
    expect(metricsPanel.metrics()).toBe(firstDraftAnalysis.metrics);
    expect(metricsPanel.isPending()).toBe(false);
    expect(fixture.componentInstance.metrics()).toBe(firstDraftAnalysis.metrics);
  });

  it('keeps the shell as composition only by reflecting store-driven updates back into both child contracts', () => {
    store.updateText(secondDraftAnalysis.input.text);
    fixture.detectChanges();

    expect(getTextInput().value()).toBe(secondDraftAnalysis.input.text);
    expect(getMetricsPanel().metrics()).toBe(secondDraftAnalysis.metrics);
    expect(fixture.componentInstance.sourceText()).toBe(secondDraftAnalysis.input.text);
  });

  it('does not leak raw textarea content into the metrics panel, which stays bound to metrics snapshots instead of panel-to-panel text coupling', async () => {
    await enterText(secondDraftAnalysis.input.text);

    const metricsPanelHost = fixture.debugElement.query(By.css('app-metrics-panel')).nativeElement as HTMLElement;

    expect(metricsPanelHost.textContent).toContain(String(secondDraftAnalysis.metrics.words));
    expect(metricsPanelHost.textContent).toContain(String(secondDraftAnalysis.metrics.characters));
    expect(metricsPanelHost.textContent).toContain(secondDraftAnalysis.metrics.estimatedTokens.method);
    expect(metricsPanelHost.textContent).not.toContain(secondDraftAnalysis.input.text);
    expect(getTextarea().value).toBe(secondDraftAnalysis.input.text);
  });

  function getTextInput(): TextInputPanelComponent {
    return fixture.debugElement.query(By.directive(TextInputPanelComponent)).componentInstance as TextInputPanelComponent;
  }

  function getMetricsPanel(): MetricsPanelComponent {
    return fixture.debugElement.query(By.directive(MetricsPanelComponent)).componentInstance as MetricsPanelComponent;
  }

  function getTextarea(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
  }

  async function enterText(value: string): Promise<void> {
    const textarea = getTextarea();

    textarea.value = value;
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
});

function createAnalysis(text: string, metrics: TextAnalysisMetrics): TextAnalysisComputation {
  return Object.freeze({
    input: Object.freeze({
      text,
      normalizedText: text.trim(),
    }),
    metrics: Object.freeze({
      ...metrics,
      breakdown: createMetricBreakdown(metrics.breakdown),
      extensions: Object.freeze([...metrics.extensions]),
    }),
  });
}
