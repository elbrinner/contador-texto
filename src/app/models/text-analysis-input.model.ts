export interface TextAnalysisInput {
  readonly text: string;
}

export interface NormalizedTextAnalysisInput extends TextAnalysisInput {
  readonly normalizedText: string;
}
