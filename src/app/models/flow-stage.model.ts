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
    uiSurface: 'text-input-panel',
  },
  {
    id: 'normalize-text',
    order: 2,
    trigger: 'A service accepts new source text for analysis.',
    inputContract: 'TextAnalysisInput',
    outputContract: 'NormalizedTextAnalysisInput',
    ownerArea: 'utility',
  },
  {
    id: 'compute-metrics',
    order: 3,
    trigger: 'Normalized text enters the computation pipeline.',
    inputContract: 'NormalizedTextAnalysisInput',
    outputContract: 'TextAnalysisMetrics',
    ownerArea: 'service',
  },
  {
    id: 'present-results',
    order: 4,
    trigger: 'Computed metrics are projected back into the shell.',
    inputContract: 'TextAnalysisMetrics',
    outputContract: 'Read-only metrics view model',
    ownerArea: 'component',
    uiSurface: 'metrics-panel',
  },
] as const;
