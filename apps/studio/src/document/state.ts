import type { Locale, LocaleCode } from '../i18n/types';
import type { ThemeTokens } from '../theme/tokens';
import type { ComponentParam, Json } from '../logic/types';
import type {
  Asset, Axis, AxisSize, Binding, Breakpoint, ComponentDef, ComponentId, ComponentState, DocNode, FrameLayout,
  InteractionState, NodeId, PropValue, RepeatSpec, ResponsiveOverride, StateEffect,
} from './types';
import { hasChildren } from './types';

/**
 * The left rail: everything the *document* holds.
 *
 * `props` used to live here and no longer does. A component's API is not a
 * thing the document contains beside its layers — it is the component, and it
 * belongs on the right beside the rest of what the selected thing is. The
 * Styles panel's three sub-tabs are flattened for the same reason the rail
 * exists at all: a tab inside a tab is a destination you have to remember the
 * way to.
 */
export type PanelTab = 'layers' | 'insert' | 'theme' | 'text' | 'images' | 'problems';

/**
 * The right panel: everything about the component being made.
 *
 * `design` is the selected node, `props` is the contract, `play` is the
 * component running against values you can turn. They are one switch because
 * they are three questions about the same thing, asked in that order.
 */
export type RightTab = 'design' | 'props' | 'play';

export type CodeTab = 'component' | 'story' | 'theme' | 'document' | 'translations';

/**
 * `design` draws every branch with the sample values. `preview` runs the
 * component against whatever the controls are set to — the same thing a
 * Storybook story does, and for the same reason.
 */
export type CanvasMode = 'design' | 'preview';

export interface StudioState {
  components: ComponentDef[];
  activeId: ComponentId;
  selection: ReadonlySet<NodeId>;
  expanded: ReadonlySet<NodeId>;
  clipboard: DocNode[];
  theme: ThemeTokens;
  locales: Locale[];
  activeLocale: LocaleCode;
  assets: Asset[];
  canvasScheme: 'light' | 'dark';
  mode: CanvasMode;
  /** Live parameter values while previewing. Never part of the document. */
  controls: Record<string, unknown>;
  /** The named state being drawn, or null for the samples as authored. */
  activeState: string | null;
  /** Lays every state out side by side instead of one at a time. */
  allStates: boolean;
  /** Which responsive variant the layout controls write to. `null` is the base. */
  breakpoint: Breakpoint | null;
  zoom: number;
  pan: { x: number; y: number };
  /** Rendered artboard heights, reported by the canvas. Never saved. */
  measured: Record<ComponentId, number>;
  panel: PanelTab;
  rightTab: RightTab;
  /**
   * The component whose page is open beside the library, or null.
   *
   * It lives here rather than inside the Insert panel because the page is not
   * a dialog: the canvas stays visible and reachable next to it, which is what
   * makes dragging a variant onto the board possible at all.
   */
  catalogue: string | null;
  /** How wide the component page is. A matrix needs room; 420px squeezed it. */
  catalogueWidth: number;
  /**
   * Which theme the overview draws in.
   *
   * Separate from the canvas and from the editor, because the question it
   * answers is different: not "what am I building on" but "what does this
   * component look like in the other theme". Following the canvas meant a
   * white page inside a dark editor, which is both ugly and only half the
   * information.
   */
  catalogueTheme: 'light' | 'dark';
  /**
   * Which language the overview draws in.
   *
   * The FA frame in Figma is the same page under `dir="rtl"`, and so is the
   * Storybook one — the toolbar switch is the whole mechanism. This is that
   * switch, so a right-to-left layout can be checked without leaving here.
   */
  catalogueLocale: 'en' | 'fa';
  recent: string[];
  codeTab: CodeTab;
  codeId: ComponentId;
  codeOpen: boolean;
  uiScheme: 'light' | 'dark';
  leftWidth: number;
  rightWidth: number;
  savedAt: string | null;
}

export type UiPatch = Partial<
  Pick<
    StudioState,
    | 'canvasScheme' | 'zoom' | 'pan' | 'panel' | 'rightTab' | 'catalogue' | 'catalogueWidth' | 'catalogueTheme' | 'catalogueLocale' | 'codeTab' | 'codeId'
    | 'codeOpen' | 'uiScheme' | 'leftWidth' | 'rightWidth' | 'mode' | 'breakpoint'
    | 'activeState' | 'allStates'
  >
>;

export type Action =
  | { type: 'select'; ids: NodeId[]; additive?: boolean }
  | { type: 'selectAll' }
  | { type: 'clearSelection' }
  | { type: 'toggleExpanded'; id: NodeId }
  | { type: 'expand'; ids: NodeId[] }
  | { type: 'insert'; parentId: NodeId; index: number; nodes: DocNode[] }
  | { type: 'insertBeside'; targetId: NodeId; side: 'start' | 'end'; nodes: DocNode[] }
  | { type: 'moveBeside'; id: NodeId; targetId: NodeId; side: 'start' | 'end' }
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
  | { type: 'renameNode'; id: NodeId; label: string }
  | { type: 'setLayout'; id: NodeId; patch: Partial<FrameLayout> }
  | { type: 'setResponsive'; id: NodeId; breakpoint: Breakpoint; patch: ResponsiveOverride | undefined }
  | { type: 'setArg'; id: NodeId; key: string; value: PropValue }

  /* components */
  | { type: 'addComponent'; name?: string }
  | { type: 'extractComponent'; name?: string }
  | { type: 'duplicateComponent'; id: ComponentId }
  | { type: 'removeComponent'; id: ComponentId }
  | { type: 'patchComponent'; id: ComponentId; patch: Partial<Omit<ComponentDef, 'id' | 'root'>> }
  | { type: 'moveComponent'; id: ComponentId; x: number; y: number; coalesce?: string }
  | { type: 'setActiveComponent'; id: ComponentId }
  | { type: 'measureComponent'; id: ComponentId; height: number }
  | { type: 'tidy' }

  /* parameters — the component's API */
  | { type: 'addParam'; componentId: ComponentId; param?: ComponentParam }
  | { type: 'patchParam'; componentId: ComponentId; id: string; patch: Partial<ComponentParam> }
  | { type: 'removeParam'; componentId: ComponentId; id: string }
  /**
   * Turns a prop into a parameter and binds the prop to it, in one gesture.
   * This is the move that replaced the entire data layer: a boolean nobody has
   * decided yet stops being a value and becomes part of the component's API.
   */
  | {
      type: 'exposeProp';
      id: NodeId;
      key: string;
      name?: string;
      paramType?: ComponentParam['type'];
      /** True when the prop it is replacing cannot be left out. */
      required?: boolean;
      /** The prop's allowed values, when it is a variant. */
      options?: string[];
      /** The prop's own default, which becomes the property's. */
      fallback?: string;
    }

  /* rendering */
  | { type: 'setVisibleWhen'; id: NodeId; value: Binding | undefined }
  | { type: 'setRepeat'; id: NodeId; value: RepeatSpec | undefined }
  | { type: 'setValidate'; id: NodeId; value: Binding | undefined }
  | { type: 'setStateEffect'; id: NodeId; state: InteractionState; effect: StateEffect | undefined }
  /** Points an event at an action parameter, creating one if asked. */
  | { type: 'setEvent'; id: NodeId; event: string; param: string | undefined }
  | { type: 'renameSlot'; id: NodeId; name: string }
  /** Cuts a hole and declares the property it reads, in one step. */
  | { type: 'addSlot'; parentId: NodeId; index: number; name?: string }

  /* named states */
  | { type: 'addState'; componentId: ComponentId; name?: string; values?: Record<string, Json> }
  | { type: 'patchState'; componentId: ComponentId; id: string; patch: Partial<ComponentState> }
  | { type: 'setStateValue'; componentId: ComponentId; id: string; param: string; value: Json | undefined }
  | { type: 'removeState'; componentId: ComponentId; id: string }
  /** One named state per value a property can take, in a single gesture. */
  | { type: 'generateStates'; componentId: ComponentId; param: string }

  /* chrome */
  | { type: 'setControl'; name: string; value: unknown }
  | { type: 'resetControls' }
  | { type: 'addAsset'; asset: Asset }
  | { type: 'renameAsset'; id: string; name: string }
  | { type: 'removeAsset'; id: string }
  | { type: 'setTheme'; patch: Partial<ThemeTokens> }
  | { type: 'addLocale'; locale: Locale }
  | { type: 'removeLocale'; code: LocaleCode }
  | { type: 'setActiveLocale'; code: LocaleCode }
  | { type: 'setMessage'; code: LocaleCode; key: string; value: string }
  | { type: 'ui'; patch: UiPatch }
  | { type: 'loadDocument'; state: StudioState }
  | { type: 'saved'; at: string }
  | { type: 'undo' }
  | { type: 'redo' };

/** Actions that change the document and therefore push a history entry. */
export const MUTATING: ReadonlySet<Action['type']> = new Set([
  'insert', 'insertBeside', 'moveBeside', 'setSize', 'move', 'reorder', 'delete', 'duplicate',
  'paste', 'wrapInFrame', 'setProp', 'setClassName', 'setLayout', 'renameNode',
  'setResponsive', 'setArg',
  'addComponent', 'extractComponent', 'duplicateComponent', 'removeComponent',
  'patchComponent', 'moveComponent', 'tidy',
  'addParam', 'patchParam', 'removeParam', 'exposeProp',
  'setVisibleWhen', 'setRepeat', 'setValidate', 'setStateEffect', 'setEvent', 'renameSlot', 'addSlot',
  'addState', 'patchState', 'setStateValue', 'removeState',
  'addAsset', 'renameAsset', 'removeAsset',
  'setTheme', 'addLocale', 'removeLocale', 'setMessage', 'loadDocument',
]);

/* ──────────────────────────  selectors  ────────────────────────── */

export const activeComponent = (state: StudioState): ComponentDef =>
  state.components.find((component) => component.id === state.activeId) ?? (state.components[0] as ComponentDef);

export const activeRoot = (state: StudioState): ComponentDef['root'] => activeComponent(state).root;

export const componentById = (state: StudioState, id: ComponentId): ComponentDef | undefined =>
  state.components.find((component) => component.id === id);

/** The component a node belongs to — selection is document-wide. */
export function ownerOf(state: StudioState, nodeId: NodeId): ComponentDef | undefined {
  const search = (node: DocNode): boolean => {
    if (node.id === nodeId) return true;
    /* `hasChildren`, not `kind === 'frame'`: a slot holds children too, and
       searching only frames meant anything drawn inside a slot had no owner —
       so the inspector silently fell back to the active component and edited
       the wrong one. */
    return hasChildren(node) && node.children.some(search);
  };
  return state.components.find((component) => search(component.root));
}
