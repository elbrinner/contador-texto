export type TokenEstimationMethod = 'utf8' | 'bpe-lite' | 'gpt35-heuristic' | (string & {});

export interface TokenEstimate {
  readonly tokens: number;
  readonly method: TokenEstimationMethod;
  readonly confidence?: number;
}

export interface MetricExtension<TValue extends number | string | boolean = number> {
  readonly key: string;
  readonly label: string;
  readonly value: TValue;
  readonly description?: string;
}

export interface TextAnalysisMetrics {
  readonly characters: number;
  readonly charactersExcludingWhitespace: number;
  readonly words: number;
  readonly lines: number;
  readonly paragraphs: number;
  readonly estimatedTokens: TokenEstimate;
  readonly extensions: readonly MetricExtension[];
}
