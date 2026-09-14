import type { DocNode } from '../document/types';

export type Severity = 'error' | 'warning' | 'info';

export interface Finding {
  id: string;
  nodeId: string;
  subject: string;
  severity: Severity;
  message: string;
  /** Prop the inspector should highlight, when the fix is a single field. */
  field?: string;
  fix?: string;
  /** Where in the library this constraint is written down. */
  source: string;
}

export interface RuleContext {
  text: (key: string) => string;
  className: string;
  node: DocNode;
}

export interface Rule {
  id: string;
  component: string | '*';
  severity: Severity;
  source: string;
  message: string;
  field?: string;
  fix?: string;
  applies: (ctx: RuleContext) => boolean;
}
