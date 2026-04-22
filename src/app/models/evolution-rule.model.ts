import { ArchitecturalAreaName } from './architectural-area.model';
import { FlowStageId } from './flow-stage.model';
import { QualityGateName } from './quality-gate.model';

export type DocumentationArtifact =
  | 'README'
  | 'ADR'
  | 'technical-architecture-guide'
  | 'release-notes'
  | 'quickstart'
  | 'ui-architecture-contract';

export type EvolutionEntryPoint = ArchitecturalAreaName | FlowStageId;

export interface EvolutionRule {
  readonly id: string;
  readonly scenario: string;
  readonly entryPoint: EvolutionEntryPoint;
  readonly constraint: string;
  readonly documentationImpact: readonly DocumentationArtifact[];
  readonly requiresVisualValidation: boolean;
  readonly requiredQualityGates: readonly QualityGateName[];
}

export const EVOLUTION_RULES: readonly EvolutionRule[] = [
  {
    id: 'new-metric-through-models-and-utils',
    scenario: 'Add a new derived metric without rewriting shell composition.',
    entryPoint: 'model',
    constraint: 'Introduce the contract first, then update pure utilities and the orchestration service before any component renders it.',
    documentationImpact: ['technical-architecture-guide', 'ui-architecture-contract'],
    requiresVisualValidation: false,
    requiredQualityGates: ['ng test', 'ng lint', 'ng build'],
  },
  {
    id: 'token-strategy-remains-pluggable',
    scenario: 'Replace or add a token estimation strategy.',
    entryPoint: 'compute-metrics',
    constraint: 'Swap the TokenEstimator implementation via injection without changing component APIs.',
    documentationImpact: ['ADR', 'technical-architecture-guide'],
    requiresVisualValidation: false,
    requiredQualityGates: ['ng test', 'ng lint', 'ng build'],
  },
  {
    id: 'presentation-variants-reuse-flow',
    scenario: 'Add a new layout or projection for the existing metrics.',
    entryPoint: 'present-results',
    constraint: 'Reuse the same TextAnalysisMetrics contract and avoid moving computation into components.',
    documentationImpact: ['README', 'technical-architecture-guide', 'release-notes'],
    requiresVisualValidation: true,
    requiredQualityGates: ['ng test', 'ng lint', 'ng build', 'simple-browser-review', 'docs-update'],
  },
] as const;
