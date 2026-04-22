import { TestBed } from '@angular/core/testing';

import { createMetricBreakdown } from '../models/text-analysis-metrics.model';
import { TextAnalysisComputation, MetricsComputationService } from './metrics-computation.service';
import { TextAnalysisStoreService } from './text-analysis-store.service';

describe('TextAnalysisStoreService', () => {
  let computeText: ReturnType<typeof vi.fn>;
  let store: TextAnalysisStoreService;

  const emptyAnalysis: TextAnalysisComputation = Object.freeze({
    input: Object.freeze({
      text: '',
      normalizedText: '',
    }),
    metrics: Object.freeze({
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
      extensions: Object.freeze([]),
    }),
  });

  const updatedAnalysis: TextAnalysisComputation = Object.freeze({
    input: Object.freeze({
      text: '  Hola\r\nAngular  ',
      normalizedText: '  Hola\nAngular  ',
    }),
    metrics: Object.freeze({
      characters: 16,
      charactersExcludingWhitespace: 11,
      words: 2,
      lines: 2,
      paragraphs: 1,
      estimatedTokens: Object.freeze({
        tokens: 4,
        method: 'gpt35-heuristic',
        confidence: 0.75,
      }),
      breakdown: createMetricBreakdown({
        primary: [
          {
            key: 'words',
            label: 'Palabras',
            value: 2,
            description: 'Conteo de palabras normalizadas.',
          },
          {
            key: 'characters',
            label: 'Caracteres',
            value: 16,
            description: 'Todos los caracteres, incluidos espacios.',
          },
          {
            key: 'tokens',
            label: 'Tokens',
            value: 4,
            description: 'Estimación heurística para modelos de IA.',
          },
        ],
        secondary: [
          {
            key: 'charactersExcludingWhitespace',
            label: 'Caracteres sin espacios',
            value: 11,
            description: 'Útil para revisar contenido neto.',
          },
          {
            key: 'lines',
            label: 'Líneas',
            value: 2,
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
      extensions: Object.freeze([]),
    }),
  });

  const whitespaceAnalysis: TextAnalysisComputation = Object.freeze({
    input: Object.freeze({
      text: '\r\n  ',
      normalizedText: '\n  ',
    }),
    metrics: emptyAnalysis.metrics,
  });

  beforeEach(() => {
    computeText = vi.fn((text: string) => {
      switch (text) {
        case '':
          return emptyAnalysis;
        case '\r\n  ':
          return whitespaceAnalysis;
        case updatedAnalysis.input.text:
          return updatedAnalysis;
        default:
          return updatedAnalysis;
      }
    });

    TestBed.configureTestingModule({
      providers: [
        TextAnalysisStoreService,
        {
          provide: MetricsComputationService,
          useValue: {
            computeText,
          },
        },
      ],
    });

    store = TestBed.inject(TextAnalysisStoreService);
  });

  it('starts with an empty-text snapshot and predictable zero-state analysis data so the shell can render before any input arrives', () => {
    expect(computeText).toHaveBeenCalledOnce();
    expect(computeText).toHaveBeenCalledWith('');
    expect(store.sourceText()).toBe('');
    expect(store.normalizedText()).toBe('');
    expect(store.metrics()).toEqual(emptyAnalysis.metrics);
    expect(store.analysis()).toEqual(emptyAnalysis);
    expect(store.isPending()).toBe(false);
  });

  it('owns the source text state for the single analysis flow and publishes the current derived analysis as Signals-backed read models', () => {
    store.updateText(updatedAnalysis.input.text);

    expect(store.sourceText()).toBe(updatedAnalysis.input.text);
    expect(store.normalizedText()).toBe(updatedAnalysis.input.normalizedText);
    expect(store.metrics()).toEqual(updatedAnalysis.metrics);
    expect(store.analysis()).toBe(updatedAnalysis);
  });

  it('recomputes derived analysis through MetricsComputationService when source text changes instead of re-implementing normalization or metric math in the store', () => {
    store.updateText(updatedAnalysis.input.text);

    expect(computeText).toHaveBeenNthCalledWith(2, updatedAnalysis.input.text);
    expect(store.analysis()).toBe(updatedAnalysis);
  });

  it('preserves the user-entered source text while also exposing the normalized computation result needed by downstream metrics consumers', () => {
    store.updateText(updatedAnalysis.input.text);

    expect(store.sourceText()).toBe('  Hola\r\nAngular  ');
    expect(store.normalizedText()).toBe('  Hola\nAngular  ');
  });

  it('keeps the write boundary inside the store so upcoming shell and panel composition can mutate analysis text through one controlled entry point', () => {
    const publicMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(store)).filter(
      (member) => member !== 'constructor',
    );

    expect(publicMethods).toEqual(['updateText']);
    expect('set' in (store.sourceText as object)).toBe(false);
    expect('set' in (store.metrics as object)).toBe(false);
    expect('set' in (store.analysis as object)).toBe(false);
    expect('set' in (store.isPending as object)).toBe(false);

    store.updateText(updatedAnalysis.input.text);

    expect(store.sourceText()).toBe(updatedAnalysis.input.text);
    expect(store.isPending()).toBe(false);
  });

  it('projects whitespace-only recomputations as read-only zero-state analysis while preserving the original user input at the single write boundary', () => {
    store.updateText('\r\n  ');

    expect(computeText).toHaveBeenNthCalledWith(2, '\r\n  ');
    expect(store.sourceText()).toBe('\r\n  ');
    expect(store.normalizedText()).toBe('\n  ');
    expect(store.metrics()).toBe(emptyAnalysis.metrics);
    expect(store.analysis()).toBe(whitespaceAnalysis);
  });

  it('exposes analysis and metrics projections as read-only snapshots rather than extra write paths', () => {
    store.updateText(updatedAnalysis.input.text);

    expect(Object.isFrozen(store.analysis())).toBe(true);
    expect(Object.isFrozen(store.metrics())).toBe(true);
    expect(Object.isFrozen(store.metrics().breakdown)).toBe(true);
    expect(Object.isFrozen(store.metrics().breakdown.primary)).toBe(true);
    expect(Object.isFrozen(store.metrics().extensions)).toBe(true);
    expect(Reflect.set(store.analysis() as unknown as Record<string, unknown>, 'input', emptyAnalysis.input)).toBe(
      false,
    );
    expect(Reflect.set(store.metrics() as unknown as Record<string, unknown>, 'words', 99)).toBe(false);
    expect(store.metrics().words).toBe(updatedAnalysis.metrics.words);
  });

  it('keeps the write boundary owned by the store even when downstream analysis snapshots reshape their own input payload', () => {
    const originalText = 'Hola\r\nstore';
    const downstreamSnapshot = Object.freeze({
      input: Object.freeze({
        text: 'normalizado-por-servicio',
        normalizedText: 'Hola\nstore',
      }),
      metrics: updatedAnalysis.metrics,
    });

    computeText.mockImplementation((text: string) => {
      if (text === '') {
        return emptyAnalysis;
      }

      if (text === originalText) {
        return downstreamSnapshot;
      }

      return updatedAnalysis;
    });

    store.updateText(originalText);

    expect(store.sourceText()).toBe(originalText);
    expect(store.normalizedText()).toBe('Hola\nstore');
    expect(store.analysis()).toBe(downstreamSnapshot);
  });
});
