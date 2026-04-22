import { TestBed } from '@angular/core/testing';

import { TextAnalysisInput } from '../models/text-analysis-input.model';
import { createMetricBreakdown } from '../models/text-analysis-metrics.model';
import { EMPTY_TEXT_ANALYSIS_METRICS, calculateTextMetrics } from '../utils/metrics-calculator';
import { normalizeText } from '../utils/text-normalizer';
import { TokenEstimator } from '../utils/token-estimator';
import { MetricsComputationService, TOKEN_ESTIMATOR } from './metrics-computation.service';

describe('MetricsComputationService', () => {
  let estimate: ReturnType<typeof vi.fn>;
  let tokenEstimator: TokenEstimator;
  let service: MetricsComputationService;

  beforeEach(() => {
    tokenEstimator = {
      estimate(text: string) {
        return Object.freeze({
          tokens: Math.max(text.length, 1),
          method: 'spec-estimator',
          confidence: 0.5,
        });
      },
    };
    estimate = vi.spyOn(tokenEstimator, 'estimate');

    TestBed.configureTestingModule({
      providers: [
        MetricsComputationService,
        {
          provide: TOKEN_ESTIMATOR,
          useValue: tokenEstimator,
        },
      ],
    });

    service = TestBed.inject(MetricsComputationService);
  });

  it('provides one orchestration entry point from the text-analysis input contract to the text-analysis metrics contract', () => {
    const text = 'Hola\r\nmundo';
    const fromText = service.computeText(text);
    const fromInput = service.compute({ text });

    expect(fromText).toEqual(fromInput);
    expect(fromText.input).toEqual({
      text,
      normalizedText: 'Hola\nmundo',
    });
    expect(fromText.metrics).toEqual(
      calculateTextMetrics(
        {
          text,
          normalizedText: 'Hola\nmundo',
        },
        tokenEstimator,
      ),
    );
  });

  it('delegates text normalization, token estimation, and metric calculation to pure helpers instead of re-implementing that logic in the service', () => {
    const input: TextAnalysisInput = {
      text: '\uFEFFAme\u0301lie\r\n🙂',
    };
    const normalizedText = normalizeText(input.text);
    const computation = service.compute(input);

    expect(computation.input.normalizedText).toBe(normalizedText);
    expect(estimate).toHaveBeenCalledOnce();
    expect(estimate).toHaveBeenCalledWith(normalizedText);
    expect(computation.metrics).toEqual(calculateTextMetrics(computation.input, tokenEstimator));
  });

  it('returns a stable zeroed metrics result for empty or whitespace-only text so the metrics panel stays predictable', () => {
    const emptyComputation = service.computeText('');
    const whitespaceComputation = service.computeText(' \r\n\t ');

    expect(emptyComputation.input).toEqual({
      text: '',
      normalizedText: '',
    });
    expect(whitespaceComputation.input).toEqual({
      text: ' \r\n\t ',
      normalizedText: ' \n\t ',
    });
    expect(emptyComputation.metrics).toBe(EMPTY_TEXT_ANALYSIS_METRICS);
    expect(whitespaceComputation.metrics).toBe(EMPTY_TEXT_ANALYSIS_METRICS);
    expect(estimate).not.toHaveBeenCalled();
  });

  it('treats the incoming analysis input as immutable so store updates remain a single controlled write path', () => {
    const computation = service.computeText('Hola');

    expect(Object.isFrozen(computation)).toBe(true);
    expect(Object.isFrozen(computation.input)).toBe(true);
    expect(Object.isFrozen(computation.metrics)).toBe(true);
    expect(Object.isFrozen(computation.metrics.estimatedTokens)).toBe(true);
    expect(Object.isFrozen(computation.metrics.breakdown)).toBe(true);
    expect(Object.isFrozen(computation.metrics.breakdown.primary)).toBe(true);
    expect(Object.isFrozen(computation.metrics.breakdown.secondary)).toBe(true);
    expect(Object.isFrozen(computation.metrics.extensions)).toBe(true);
    expect(Reflect.set(computation as unknown as Record<string, unknown>, 'metrics', EMPTY_TEXT_ANALYSIS_METRICS)).toBe(
      false,
    );
    expect(Reflect.set(computation.input as unknown as Record<string, unknown>, 'normalizedText', 'otro')).toBe(false);
    expect(Reflect.set(computation.metrics as unknown as Record<string, unknown>, 'words', 99)).toBe(false);
  });

  it('supports extension-ready metric fields through the shared models and utilities without pushing computation into components', () => {
    const computation = service.computeText('Hola mundo');

    expect(computation.metrics).toMatchObject({
      estimatedTokens: {
        tokens: 10,
        method: 'spec-estimator',
        confidence: 0.5,
      },
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
            value: 10,
            description: 'Todos los caracteres, incluidos espacios.',
          },
          {
            key: 'tokens',
            label: 'Tokens',
            value: 10,
            description: 'Estimación heurística para modelos de IA.',
          },
        ],
        secondary: [
          {
            key: 'charactersExcludingWhitespace',
            label: 'Caracteres sin espacios',
            value: 9,
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
    expect(Array.isArray(computation.metrics.extensions)).toBe(true);
    expect(Object.isFrozen(computation.metrics.extensions)).toBe(true);
  });
});
