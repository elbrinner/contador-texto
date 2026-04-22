import { computed, inject, Injectable, signal } from '@angular/core';

import { MetricsComputationService, TextAnalysisComputation } from './metrics-computation.service';

@Injectable({
  providedIn: 'root',
})
export class TextAnalysisStoreService {
  private readonly metricsComputation = inject(MetricsComputationService);
  private readonly sourceTextState = signal('');
  private readonly analysisState = signal<TextAnalysisComputation>(this.metricsComputation.computeText(''));
  private readonly pendingState = signal(false);

  readonly analysis = this.analysisState.asReadonly();
  readonly sourceText = this.sourceTextState.asReadonly();
  readonly normalizedText = computed(() => this.analysis().input.normalizedText);
  readonly metrics = computed(() => this.analysis().metrics);
  readonly isPending = this.pendingState.asReadonly();

  updateText(text: string): void {
    this.pendingState.set(true);
    this.sourceTextState.set(text);

    try {
      this.analysisState.set(this.metricsComputation.computeText(text));
    } finally {
      this.pendingState.set(false);
    }
  }
}
