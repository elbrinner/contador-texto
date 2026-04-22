import { NormalizedTextAnalysisInput } from '../models/text-analysis-input.model';
import { TextAnalysisMetrics } from '../models/text-analysis-metrics.model';
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

export const EMPTY_TEXT_ANALYSIS_METRICS: TextAnalysisMetrics = Object.freeze({
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
  extensions: [],
});

export function calculateTextMetrics(
  input: NormalizedTextAnalysisInput,
  tokenEstimator: TokenEstimator = defaultTokenEstimator,
): TextAnalysisMetrics {
  const text = input.normalizedText;

  if (!text.trim()) {
    return EMPTY_TEXT_ANALYSIS_METRICS;
  }

  return {
    characters: countCharacters(text),
    charactersExcludingWhitespace: countCharactersExcludingWhitespace(text),
    words: countWords(text),
    lines: countLines(text),
    paragraphs: countParagraphs(text),
    estimatedTokens: tokenEstimator.estimate(text),
    extensions: [],
  };
}
