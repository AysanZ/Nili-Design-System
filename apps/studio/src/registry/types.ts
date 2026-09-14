export type ControlKind = 'select' | 'boolean' | 'text' | 'number' | 'slot' | 'handler' | 'list' | 'none';

export type PropSource = 'cva' | 'cva:sibling' | 'dom' | 'types';

export interface PropMeta {
  type: string;
  required: boolean;
  doc: string | null;
  control: ControlKind;
  options?: string[];
  default?: string | number | boolean;
  source?: PropSource;
  deprecated?: boolean;
}

export interface ComponentMeta {
  name: string;
  exported: boolean;
  variants: Record<string, string[]>;
  defaultVariants: Record<string, string | number | boolean | undefined>;
  extends: string[];
  props: Record<string, PropMeta>;
}

export interface RegistryEntry {
  dir: string;
  name: string;
  type: 'registry:component';
  files: string[];
  exports: string[];
  dependencies: { npm: string[]; registry: string[]; shared: string[] };
  components: ComponentMeta[];
}

export interface RegistryIndex {
  name: string;
  version: string;
  styles: string[];
  shared: { name: string; files: string[] }[];
  components: { name: string; dir: string; provides: string[] }[];
}

/** A component the canvas can actually render, plus what the panels need. */
export interface StudioComponent {
  name: string;
  dir: string;
  category: string;
  meta: ComponentMeta;
  /** Tailwind utility groups the component's own variants already control. */
  owns: readonly string[];
  /** Props the inspector should not surface even though they are real. */
  hidden: ReadonlySet<string>;
}
