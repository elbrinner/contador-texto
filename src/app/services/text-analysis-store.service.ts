import { computed, inject, Injectable, signal } from '@angular/core';

import { MetricsComputationService, TextAnalysisComputation } from './metrics-computation.service';

@Injectable({
  providedIn: 'root',
})
export class TextAnalysisStoreService {
  private readonly metricsComputation = inject(MetricsComputationService);
  private readonly analysisState = signal<TextAnalysisComputation>(this.metricsComputation.computeText(''));
  private readonly pendingState = signal(false);

  readonly analysis = this.analysisState.asReadonly();
  readonly sourceText = computed(() => this.analysis().input.text);
  readonly normalizedText = computed(() => this.analysis().input.normalizedText);
  readonly metrics = computed(() => this.analysis().metrics);
  readonly isPending = this.pendingState.asReadonly();

  updateText(text: string): void {
    this.pendingState.set(true);

    try {
      this.analysisState.set(this.metricsComputation.computeText(text));
    } finally {
      this.pendingState.set(false);
    }
  }
}
