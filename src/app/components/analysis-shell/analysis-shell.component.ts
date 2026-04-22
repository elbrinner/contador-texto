import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TextAnalysisStoreService } from '../../services/text-analysis-store.service';
import { MetricsPanelComponent } from '../metrics-panel/metrics-panel.component';
import { TextInputPanelComponent } from '../text-input-panel/text-input-panel.component';

@Component({
  selector: 'app-analysis-shell',
  imports: [TextInputPanelComponent, MetricsPanelComponent],
  templateUrl: './analysis-shell.component.html',
  styleUrl: './analysis-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisShellComponent {
  private readonly textAnalysisStore = inject(TextAnalysisStoreService);

  readonly sourceText = this.textAnalysisStore.sourceText;
  readonly metrics = this.textAnalysisStore.metrics;
  readonly isPending = this.textAnalysisStore.isPending;
  readonly hasDraft = computed(() => this.sourceText().trim().length > 0);
  readonly statusMessage = computed(() =>
    this.isPending()
      ? 'Actualizando métricas del texto…'
      : this.hasDraft()
        ? 'Las métricas se mantienen sincronizadas con tu texto desde un único store.'
        : 'Escribe o pega texto para ver un resumen inicial de métricas al instante.',
  );

  updateText(nextText: string): void {
    this.textAnalysisStore.updateText(nextText);
  }
}
