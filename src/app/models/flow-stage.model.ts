import { ArchitecturalAreaName } from './architectural-area.model';

export type FlowStageId =
  | 'capture-input'
  | 'normalize-text'
  | 'compute-metrics'
  | 'present-results';

export interface FlowStage {
  readonly id: FlowStageId;
  readonly order: 1 | 2 | 3 | 4;
  readonly trigger: string;
  readonly inputContract: string;
  readonly outputContract: string;
  readonly ownerArea: ArchitecturalAreaName;
  readonly ownerArtifacts: readonly string[];
  readonly supportingAreas?: readonly ArchitecturalAreaName[];
  readonly extensionGuideline: string;
  readonly uiSurface?: string;
}

export const FLOW_STAGES: readonly FlowStage[] = [
  {
    id: 'capture-input',
    order: 1,
    trigger: 'User types or pastes text into the primary input.',
    inputContract: 'Raw browser text event payload',
    outputContract: 'TextAnalysisInput',
    ownerArea: 'component',
    ownerArtifacts: [
      'src/app/components/text-input-panel/text-input-panel.component.ts',
      'src/app/components/analysis-shell/analysis-shell.component.ts',
    ],
    supportingAreas: ['model'],
    extensionGuideline:
      'Add new capture variants by emitting the same text contract into the store instead of coupling panels directly.',
    uiSurface: 'text-input-panel',
  },
  {
    id: 'normalize-text',
    order: 2,
    trigger: 'A service accepts new source text for analysis.',
    inputContract: 'TextAnalysisInput',
    outputContract: 'NormalizedTextAnalysisInput',
    ownerArea: 'utility',
    ownerArtifacts: ['src/app/utils/text-normalizer.ts'],
    supportingAreas: ['model'],
    extensionGuideline:
      'Any new normalization step must stay pure and preserve the raw input alongside the normalized handoff.',
  },
  {
    id: 'compute-metrics',
    order: 3,
    trigger: 'Normalized text enters the computation pipeline.',
    inputContract: 'NormalizedTextAnalysisInput',
    outputContract: 'TextAnalysisMetrics',
    ownerArea: 'service',
    ownerArtifacts: ['src/app/services/metrics-computation.service.ts'],
    supportingAreas: ['utility', 'model'],
    extensionGuideline:
      'Add metrics by expanding the shared metrics contract and calculator, then let the service orchestrate the unchanged flow.',
  },
  {
    id: 'present-results',
    order: 4,
    trigger: 'Computed metrics are projected back into the shell.',
    inputContract: 'TextAnalysisMetrics',
    outputContract: 'Read-only metrics view model',
    ownerArea: 'component',
    ownerArtifacts: [
      'src/app/components/analysis-shell/analysis-shell.component.ts',
      'src/app/components/metrics-panel/metrics-panel.component.ts',
    ],
    supportingAreas: ['service', 'model'],
    extensionGuideline:
      'Reuse shared metric snapshots for new layouts so presentation can grow without changing computation boundaries.',
    uiSurface: 'metrics-panel',
  },
] as const;
