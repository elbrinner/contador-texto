import { NormalizedTextAnalysisInput } from '../models/text-analysis-input.model';
import {
  createMetricBreakdown,
  createMetricEntry,
  createTextAnalysisMetrics,
  MetricBreakdown,
  MetricExtension,
  TextAnalysisMetrics,
  TextAnalysisMetricsDraft,
} from '../models/text-analysis-metrics.model';
import {
  countCharacters,
  countCharactersExcludingWhitespace,
  countWords,
} from './text-normalizer';
import { defaultTokenEstimator, TokenEstimator } from './token-estimator';

function countLines(text: string): number {
  return text.length === 0 ? 0 : text.split('\n').length;
}

function countParagraphs(text: string): number {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  return trimmedText.split(/\n\s*\n+/u).filter((paragraph) => paragraph.trim().length > 0).length;
}

function createMetricBreakdownFromDraft(
  draft: TextAnalysisMetricsDraft,
  extensions: readonly MetricExtension[] = [],
): MetricBreakdown {
  return createMetricBreakdown({
    primary: [
      createMetricEntry({
        key: 'words',
        label: 'Palabras',
        value: draft.words,
        description: 'Conteo de palabras normalizadas.',
      }),
      createMetricEntry({
        key: 'characters',
        label: 'Caracteres',
        value: draft.characters,
        description: 'Todos los caracteres, incluidos espacios.',
      }),
      createMetricEntry({
        key: 'tokens',
        label: 'Tokens',
        value: draft.estimatedTokens.tokens,
        description: 'Estimación heurística para modelos de IA.',
      }),
    ],
    secondary: [
      createMetricEntry({
        key: 'charactersExcludingWhitespace',
        label: 'Caracteres sin espacios',
        value: draft.charactersExcludingWhitespace,
        description: 'Útil para revisar contenido neto.',
      }),
      createMetricEntry({
        key: 'lines',
        label: 'Líneas',
        value: draft.lines,
        description: 'Cada salto de línea cuenta.',
      }),
      createMetricEntry({
        key: 'paragraphs',
        label: 'Párrafos',
        value: draft.paragraphs,
        description: 'Bloques separados por líneas en blanco.',
      }),
    ],
    extensions,
  });
}

function finalizeMetrics(
  draft: TextAnalysisMetricsDraft,
  extensions: readonly MetricExtension[] = [],
): TextAnalysisMetrics {
  return createTextAnalysisMetrics(draft, createMetricBreakdownFromDraft(draft, extensions));
}

export const EMPTY_TEXT_ANALYSIS_METRICS: TextAnalysisMetrics = finalizeMetrics({
  characters: 0,
  charactersExcludingWhitespace: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
  estimatedTokens: {
    tokens: 0,
    method: 'gpt35-heuristic',
    confidence: 1,
  },
});

export function calculateTextMetrics(
  input: NormalizedTextAnalysisInput,
  tokenEstimator: TokenEstimator = defaultTokenEstimator,
): TextAnalysisMetrics {
  const text = input.normalizedText;

  if (!text.trim()) {
    return EMPTY_TEXT_ANALYSIS_METRICS;
  }

  return finalizeMetrics({
    characters: countCharacters(text),
    charactersExcludingWhitespace: countCharactersExcludingWhitespace(text),
    words: countWords(text),
    lines: countLines(text),
    paragraphs: countParagraphs(text),
    estimatedTokens: tokenEstimator.estimate(text),
  });
}
