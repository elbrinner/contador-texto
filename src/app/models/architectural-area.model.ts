import type { FlowStageId } from './flow-stage.model';

export type ArchitecturalAreaName = 'component' | 'service' | 'utility' | 'model';

export interface ArchitecturalArea {
  readonly name: ArchitecturalAreaName;
  readonly purpose: string;
  readonly ownsArtifacts: readonly string[];
  readonly ownsFlowStages: readonly FlowStageId[];
  readonly allowedDependencies: readonly ArchitecturalAreaName[];
  readonly extensionGuideline: string;
  readonly forbiddenResponsibilities: readonly string[];
}

export const ARCHITECTURAL_AREAS: readonly ArchitecturalArea[] = [
  {
    name: 'component',
    purpose: 'Compose UI surfaces and emit user interactions without owning domain rules.',
    ownsArtifacts: ['src/app/components/**/*'],
    ownsFlowStages: ['capture-input', 'present-results'],
    allowedDependencies: ['service', 'model'],
    extensionGuideline:
      'Extend presentation by consuming read-only contracts from the store or router, never by re-implementing metric logic.',
    forbiddenResponsibilities: ['Complex metric calculation', 'Direct token estimation', 'Cross-panel imports'],
  },
  {
    name: 'service',
    purpose: 'Coordinate flow stages, expose application APIs, and compose pure helpers.',
    ownsArtifacts: ['src/app/services/**/*'],
    ownsFlowStages: ['compute-metrics'],
    allowedDependencies: ['utility', 'model'],
    extensionGuideline:
      'Add orchestration entry points only when a new flow must coordinate existing contracts and helpers.',
    forbiddenResponsibilities: ['Template rendering', 'DOM manipulation', 'Implicit shared state outside service APIs'],
  },
  {
    name: 'utility',
    purpose: 'Provide deterministic, framework-free text normalization and metric helpers.',
    ownsArtifacts: ['src/app/utils/**/*'],
    ownsFlowStages: ['normalize-text'],
    allowedDependencies: ['model'],
    extensionGuideline: 'Grow reusable text or metric helpers here before considering service or component changes.',
    forbiddenResponsibilities: ['Angular imports', 'Mutable application state', 'UI orchestration'],
  },
  {
    name: 'model',
    purpose: 'Define stable contracts shared across layers.',
    ownsArtifacts: ['src/app/models/**/*'],
    ownsFlowStages: [],
    allowedDependencies: [],
    extensionGuideline:
      'Introduce or refine shared contracts here first so downstream areas extend against explicit types, not implicit shapes.',
    forbiddenResponsibilities: ['Runtime side effects', 'Derived metric computation', 'Angular-specific behavior'],
  },
] as const;
