export type QualityGateName =
  | 'ng test'
  | 'ng lint'
  | 'ng build'
  | 'simple-browser-review'
  | 'docs-update';

export interface QualityGate {
  readonly name: QualityGateName;
  readonly trigger: string;
  readonly owner: string;
  readonly evidence: string;
}

export const QUALITY_GATES: readonly QualityGate[] = [
  {
    name: 'ng test',
    trigger: 'Before merging service or component behavior changes.',
    owner: 'Ronaldo / feature author',
    evidence: 'Passing unit test output for the affected specs.',
  },
  {
    name: 'ng lint',
    trigger: 'Before merging TypeScript or template changes.',
    owner: 'Feature author',
    evidence: 'Clean Angular ESLint run.',
  },
  {
    name: 'ng build',
    trigger: 'Before handoff or release review.',
    owner: 'Feature author',
    evidence: 'Successful production build output.',
  },
  {
    name: 'simple-browser-review',
    trigger: 'Whenever shared layout or accessibility behavior changes.',
    owner: 'Zidane / feature author',
    evidence: 'Visual or accessibility review notes tied to the changed flow.',
  },
  {
    name: 'docs-update',
    trigger: 'Whenever a contract or architectural boundary changes.',
    owner: 'Scribe / feature author',
    evidence: 'Updated README, ADR, technical guide, or release note references.',
  },
] as const;
