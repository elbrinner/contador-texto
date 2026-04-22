export type TokenEstimationMethod = 'utf8' | 'bpe-lite' | 'gpt35-heuristic' | (string & {});
export type MetricValue = number | string | boolean;

export interface TokenEstimate {
  readonly tokens: number;
  readonly method: TokenEstimationMethod;
  readonly confidence?: number;
}

export interface MetricEntry<TValue extends MetricValue = number> {
  readonly key: string;
  readonly label: string;
  readonly value: TValue;
  readonly description: string;
}

export interface MetricExtension<TValue extends MetricValue = number> extends MetricEntry<TValue> {
  readonly stage?: string;
}

export interface MetricBreakdown {
  readonly primary: readonly MetricEntry<number>[];
  readonly secondary: readonly MetricEntry<number>[];
  readonly extensions: readonly MetricExtension[];
}

export interface TextAnalysisMetricTotals {
  readonly characters: number;
  readonly charactersExcludingWhitespace: number;
  readonly words: number;
  readonly lines: number;
  readonly paragraphs: number;
}

export interface TextAnalysisMetrics extends TextAnalysisMetricTotals {
  readonly estimatedTokens: TokenEstimate;
  readonly breakdown: MetricBreakdown;
  readonly extensions: readonly MetricExtension[];
}

export interface TextAnalysisMetricsDraft extends TextAnalysisMetricTotals {
  readonly estimatedTokens: TokenEstimate;
  readonly extensions?: readonly MetricExtension[];
}

export function createMetricEntry<TValue extends MetricValue>(
  entry: MetricEntry<TValue>,
): MetricEntry<TValue> {
  return Object.freeze({ ...entry });
}

export function createMetricExtension<TValue extends MetricValue>(
  extension: MetricExtension<TValue>,
): MetricExtension<TValue> {
  return Object.freeze({ ...extension });
}

export function createMetricBreakdown(breakdown: MetricBreakdown): MetricBreakdown {
  return Object.freeze({
    primary: Object.freeze(breakdown.primary.map((entry) => createMetricEntry(entry))),
    secondary: Object.freeze(breakdown.secondary.map((entry) => createMetricEntry(entry))),
    extensions: Object.freeze(breakdown.extensions.map((extension) => createMetricExtension(extension))),
  });
}

export function createTextAnalysisMetrics(
  draft: TextAnalysisMetricsDraft,
  breakdown: MetricBreakdown,
): TextAnalysisMetrics {
  const extensions = Object.freeze((draft.extensions ?? []).map((extension) => createMetricExtension(extension)));

  return Object.freeze({
    characters: draft.characters,
    charactersExcludingWhitespace: draft.charactersExcludingWhitespace,
    words: draft.words,
    lines: draft.lines,
    paragraphs: draft.paragraphs,
    estimatedTokens: Object.freeze({ ...draft.estimatedTokens }),
    breakdown: createMetricBreakdown({
      ...breakdown,
      extensions,
    }),
    extensions,
  });
}
