export type ArchitecturalAreaName = 'component' | 'service' | 'utility' | 'model';

export interface ArchitecturalArea {
  readonly name: ArchitecturalAreaName;
  readonly purpose: string;
  readonly ownsArtifacts: readonly string[];
  readonly allowedDependencies: readonly ArchitecturalAreaName[];
  readonly forbiddenResponsibilities: readonly string[];
}

export const ARCHITECTURAL_AREAS: readonly ArchitecturalArea[] = [
  {
    name: 'component',
    purpose: 'Compose UI surfaces and emit user interactions without owning domain rules.',
    ownsArtifacts: ['src/app/components/**/*'],
    allowedDependencies: ['service', 'model'],
    forbiddenResponsibilities: ['Complex metric calculation', 'Direct token estimation', 'Cross-panel imports'],
  },
  {
    name: 'service',
    purpose: 'Coordinate flow stages, expose application APIs, and compose pure helpers.',
    ownsArtifacts: ['src/app/services/**/*'],
    allowedDependencies: ['utility', 'model'],
    forbiddenResponsibilities: ['Template rendering', 'DOM manipulation', 'Implicit shared state outside service APIs'],
  },
  {
    name: 'utility',
    purpose: 'Provide deterministic, framework-free text normalization and metric helpers.',
    ownsArtifacts: ['src/app/utils/**/*'],
    allowedDependencies: ['model'],
    forbiddenResponsibilities: ['Angular imports', 'Mutable application state', 'UI orchestration'],
  },
  {
    name: 'model',
    purpose: 'Define stable contracts shared across layers.',
    ownsArtifacts: ['src/app/models/**/*'],
    allowedDependencies: [],
    forbiddenResponsibilities: ['Runtime side effects', 'Derived metric computation', 'Angular-specific behavior'],
  },
] as const;
