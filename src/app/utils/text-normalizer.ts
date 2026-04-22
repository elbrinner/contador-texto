import { NormalizedTextAnalysisInput, TextAnalysisInput } from '../models/text-analysis-input.model';

const WINDOWS_NEWLINE_PATTERN = /\r\n?/gu;
const BYTE_ORDER_MARK_PATTERN = /^\uFEFF/u;
const WHITESPACE_SEGMENT_PATTERN = /^\s$/u;
const WORD_PATTERN =
  /[\p{L}\p{N}]+(?:['’`-][\p{L}\p{N}]+)*/gu;

function hasSegmenterSupport(): boolean {
  return typeof Intl !== 'undefined' && 'Segmenter' in Intl;
}

function createSegmenter(granularity: Intl.SegmenterOptions['granularity']): Intl.Segmenter | null {
  return hasSegmenterSupport() ? new Intl.Segmenter(undefined, { granularity }) : null;
}

const graphemeSegmenter = createSegmenter('grapheme');
const wordSegmenter = createSegmenter('word');

export function normalizeText(text: string): string {
  return text.replace(BYTE_ORDER_MARK_PATTERN, '').replace(WINDOWS_NEWLINE_PATTERN, '\n').normalize('NFC');
}

export function normalizeTextAnalysisInput(
  input: TextAnalysisInput,
): NormalizedTextAnalysisInput {
  return Object.freeze({
    text: input.text,
    normalizedText: normalizeText(input.text),
  });
}

export function getGraphemes(text: string): readonly string[] {
  if (!text) {
    return [];
  }

  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

export function countCharacters(text: string): number {
  return getGraphemes(text).length;
}

export function countCharactersExcludingWhitespace(text: string): number {
  return getGraphemes(text).filter((grapheme) => !WHITESPACE_SEGMENT_PATTERN.test(grapheme)).length;
}

export function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  if (wordSegmenter) {
    return Array.from(wordSegmenter.segment(text)).filter((segment) => segment.isWordLike).length;
  }

  return text.match(WORD_PATTERN)?.length ?? 0;
}
