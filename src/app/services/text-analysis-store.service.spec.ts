import { TestBed } from '@angular/core/testing';

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
      extensions: [],
    }),
  });

  const updatedAnalysis: TextAnalysisComputation = Object.freeze({
    input: Object.freeze({
      text: '  Hola\nAngular  ',
      normalizedText: 'Hola\nAngular',
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
      extensions: [],
    }),
  });

  beforeEach(() => {
    computeText = vi.fn((text: string) => (text.length === 0 ? emptyAnalysis : updatedAnalysis));

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
    store.updateText('  Hola\nAngular  ');

    expect(computeText).toHaveBeenNthCalledWith(2, '  Hola\nAngular  ');
    expect(store.analysis()).toBe(updatedAnalysis);
  });

  it('preserves the user-entered source text while also exposing the normalized computation result needed by downstream metrics consumers', () => {
    store.updateText(updatedAnalysis.input.text);

    expect(store.sourceText()).toBe('  Hola\nAngular  ');
    expect(store.normalizedText()).toBe('Hola\nAngular');
  });

  it('keeps the write boundary inside the store so upcoming shell and panel composition can mutate analysis text through one controlled entry point', () => {
    expect('set' in (store.sourceText as object)).toBe(false);
    expect('set' in (store.metrics as object)).toBe(false);
    expect('set' in (store.analysis as object)).toBe(false);
    expect('set' in (store.isPending as object)).toBe(false);

    store.updateText(updatedAnalysis.input.text);

    expect(store.sourceText()).toBe(updatedAnalysis.input.text);
    expect(store.isPending()).toBe(false);
  });
});
