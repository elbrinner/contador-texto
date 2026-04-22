import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MetricEntry, TextAnalysisMetrics } from '../../models/text-analysis-metrics.model';

@Component({
  selector: 'app-metrics-panel',
  templateUrl: './metrics-panel.component.html',
  styleUrl: './metrics-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsPanelComponent {
  readonly heading = input('Resumen de métricas');
  readonly caption = input('Preparado para recibir un snapshot del store.');
  readonly metrics = input.required<TextAnalysisMetrics>();
  readonly isPending = input(false);

  readonly primaryCards = computed<readonly MetricEntry<number>[]>(() => this.metrics().breakdown.primary);
  readonly secondaryCards = computed<readonly MetricEntry<number>[]>(() => this.metrics().breakdown.secondary);

  readonly liveSummary = computed(() => {
    const metrics = this.metrics();

    return `${metrics.words} palabras, ${metrics.characters} caracteres y ${metrics.estimatedTokens.tokens} tokens estimados.`;
  });
}
