import type { Locale, LocaleCode } from '../i18n/types';
import type { ThemeTokens } from '../theme/tokens';
import type { Axis, AxisSize, DocNode, FrameLayout, FrameNode, NodeId, PropValue } from './types';

export type PanelTab = 'layers' | 'assets' | 'theme' | 'locales' | 'problems';
export type CodeTab = 'component' | 'theme' | 'document' | 'translations';
export type Breakpoint = 380 | 440 | 640 | 960;

export interface StudioState {
  root: FrameNode;
  selection: ReadonlySet<NodeId>;
  expanded: ReadonlySet<NodeId>;
  clipboard: DocNode[];
  theme: ThemeTokens;
  locales: Locale[];
  activeLocale: LocaleCode;
  canvasScheme: 'light' | 'dark';
  breakpoint: Breakpoint;
  zoom: number;
  panel: PanelTab;
  codeTab: CodeTab;
  codeOpen: boolean;
  uiScheme: 'light' | 'dark';
  leftWidth: number;
  rightWidth: number;
}

export type Action =
  | { type: 'select'; ids: NodeId[]; additive?: boolean }
  | { type: 'selectAll' }
  | { type: 'clearSelection' }
  | { type: 'toggleExpanded'; id: NodeId }
  | { type: 'expand'; ids: NodeId[] }
  | { type: 'insert'; parentId: NodeId; index: number; nodes: DocNode[] }
  | { type: 'insertBeside'; targetId: NodeId; side: 'start' | 'end'; nodes: DocNode[] }
  | { type: 'moveBeside'; id: NodeId; targetId: NodeId; side: 'start' | 'end' }
  /**
   * `coalesce` groups a continuous gesture into one history entry. Without it
   * a single resize drag pushes a hundred undo steps.
   */
  | { type: 'setSize'; id: NodeId; axis: Axis; value: AxisSize; coalesce?: string }
  | { type: 'move'; id: NodeId; parentId: NodeId; index: number }
  | { type: 'reorder'; id: NodeId; delta: number }
  | { type: 'delete' }
  | { type: 'duplicate' }
  | { type: 'copy' }
  | { type: 'paste' }
  | { type: 'wrapInFrame'; direction?: 'vertical' | 'horizontal' }
  | { type: 'setProp'; id: NodeId; key: string; value: PropValue }
  | { type: 'setClassName'; id: NodeId; value: string }
  | { type: 'setLayout'; id: NodeId; patch: Partial<FrameLayout> }
  | { type: 'setTheme'; patch: Partial<ThemeTokens> }
  | { type: 'addLocale'; locale: Locale }
  | { type: 'removeLocale'; code: LocaleCode }
  | { type: 'setActiveLocale'; code: LocaleCode }
  | { type: 'setMessage'; code: LocaleCode; key: string; value: string }
  | { type: 'ui'; patch: Partial<Pick<StudioState, 'canvasScheme' | 'breakpoint' | 'zoom' | 'panel' | 'codeTab' | 'codeOpen' | 'uiScheme' | 'leftWidth' | 'rightWidth'>> }
  | { type: 'undo' }
  | { type: 'redo' };

/** Actions that change the document and therefore push a history entry. */
export const MUTATING: ReadonlySet<Action['type']> = new Set([
  'insert', 'insertBeside', 'moveBeside', 'setSize', 'move', 'reorder', 'delete', 'duplicate', 'paste', 'wrapInFrame',
  'setProp', 'setClassName', 'setLayout', 'setTheme', 'addLocale', 'removeLocale', 'setMessage',
]);
