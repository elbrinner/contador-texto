import { TokenEstimate, TokenEstimationMethod } from '../models/text-analysis-metrics.model';
import { countWords, getGraphemes, normalizeText } from './text-normalizer';

const CJK_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const WHITESPACE_GROUP_PATTERN = /\s+/gu;

export interface TokenEstimator {
  estimate(text: string): TokenEstimate;
}

export function createTokenEstimator(
  method: TokenEstimationMethod,
  estimateTokens: (text: string) => number,
  confidence?: number,
): TokenEstimator {
  return {
    estimate(text: string): TokenEstimate {
      return {
        tokens: estimateTokens(text),
        method,
        confidence,
      };
    },
  };
}

export function estimateTokensByUtf8(text: string): TokenEstimate {
  const normalizedText = normalizeText(text);

  if (!normalizedText.trim()) {
    return {
      tokens: 0,
      method: 'utf8',
      confidence: 1,
    };
  }

  return {
    tokens: Math.ceil(new TextEncoder().encode(normalizedText).length / 4),
    method: 'utf8',
    confidence: 0.42,
  };
}

export function estimateTokensHeuristically(text: string): TokenEstimate {
  const normalizedText = normalizeText(text);

  if (!normalizedText.trim()) {
    return {
      tokens: 0,
      method: 'gpt35-heuristic',
      confidence: 1,
    };
  }

  const graphemes = getGraphemes(normalizedText);
  const words = countWords(normalizedText);

  let cjkCharacters = 0;
  let emojiClusters = 0;

  for (const grapheme of graphemes) {
    if (CJK_PATTERN.test(grapheme)) {
      cjkCharacters += 1;
    }

    if (EMOJI_PATTERN.test(grapheme)) {
      emojiClusters += 1;
    }
  }

  const latinLikeCharacters = Math.max(graphemes.length - cjkCharacters - emojiClusters, 0);
  const whitespaceGroups = normalizedText.match(WHITESPACE_GROUP_PATTERN)?.length ?? 0;
  const baseEstimate = Math.max(words, Math.ceil(latinLikeCharacters / 4));
  const tokenCount =
    baseEstimate + cjkCharacters + Math.ceil(emojiClusters * 1.5) + Math.ceil(whitespaceGroups / 6);

  return {
    tokens: Math.max(tokenCount, 1),
    method: 'gpt35-heuristic',
    confidence: cjkCharacters > 0 || emojiClusters > 0 ? 0.68 : 0.78,
  };
}

export const defaultTokenEstimator: TokenEstimator = Object.freeze({
  estimate: estimateTokensHeuristically,
});
