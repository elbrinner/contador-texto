import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TextAnalysisMetrics } from '../../models/text-analysis-metrics.model';

interface MetricCardViewModel {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly description: string;
}

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

  readonly primaryCards = computed<readonly MetricCardViewModel[]>(() => {
    const metrics = this.metrics();

    return [
      {
        key: 'words',
        label: 'Palabras',
        value: metrics.words,
        description: 'Conteo de palabras normalizadas.',
      },
      {
        key: 'characters',
        label: 'Caracteres',
        value: metrics.characters,
        description: 'Todos los caracteres, incluidos espacios.',
      },
      {
        key: 'tokens',
        label: 'Tokens',
        value: metrics.estimatedTokens.tokens,
        description: 'Estimación heurística para modelos de IA.',
      },
    ];
  });

  readonly secondaryCards = computed<readonly MetricCardViewModel[]>(() => {
    const metrics = this.metrics();

    return [
      {
        key: 'charactersExcludingWhitespace',
        label: 'Caracteres sin espacios',
        value: metrics.charactersExcludingWhitespace,
        description: 'Útil para revisar contenido neto.',
      },
      {
        key: 'lines',
        label: 'Líneas',
        value: metrics.lines,
        description: 'Cada salto de línea cuenta.',
      },
      {
        key: 'paragraphs',
        label: 'Párrafos',
        value: metrics.paragraphs,
        description: 'Bloques separados por líneas en blanco.',
      },
    ];
  });

  readonly liveSummary = computed(() => {
    const metrics = this.metrics();

    return `${metrics.words} palabras, ${metrics.characters} caracteres y ${metrics.estimatedTokens.tokens} tokens estimados.`;
  });
}
