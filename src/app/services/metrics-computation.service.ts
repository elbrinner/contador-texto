import { inject, Injectable, InjectionToken } from '@angular/core';

import {
  NormalizedTextAnalysisInput,
  TextAnalysisInput,
} from '../models/text-analysis-input.model';
import { TextAnalysisMetrics } from '../models/text-analysis-metrics.model';
import { calculateTextMetrics } from '../utils/metrics-calculator';
import { normalizeTextAnalysisInput } from '../utils/text-normalizer';
import { defaultTokenEstimator, TokenEstimator } from '../utils/token-estimator';

export interface TextAnalysisComputation {
  readonly input: NormalizedTextAnalysisInput;
  readonly metrics: TextAnalysisMetrics;
}

export const TOKEN_ESTIMATOR = new InjectionToken<TokenEstimator>('TOKEN_ESTIMATOR', {
  providedIn: 'root',
  factory: () => defaultTokenEstimator,
});

function freezeComputation(
  input: NormalizedTextAnalysisInput,
  metrics: TextAnalysisMetrics,
): TextAnalysisComputation {
  return Object.freeze({
    input,
    metrics,
  });
}

@Injectable({
  providedIn: 'root',
})
export class MetricsComputationService {
  private readonly tokenEstimator = inject(TOKEN_ESTIMATOR);

  compute(input: TextAnalysisInput): TextAnalysisComputation {
    const normalizedInput = normalizeTextAnalysisInput(input);
    const metrics = calculateTextMetrics(normalizedInput, this.tokenEstimator);

    return freezeComputation(normalizedInput, metrics);
  }

  computeText(text: string): TextAnalysisComputation {
    return this.compute({ text });
  }
}
