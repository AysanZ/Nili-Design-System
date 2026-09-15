import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { historyReducer } from './reducer';
import type { HistoryState } from './reducer';
import type { Action, StudioState } from './state';
import { activeComponent } from './state';
import { createInitialState } from './initial';
import { load, save } from './persist';
import { lint } from '../lint/engine';
import type { Finding } from '../lint/types';
import type { Locale } from '../i18n/types';
import type { ComponentDef } from './types';
import { controlScope, designScope, stateScope } from '../logic/scope';
import type { Scope } from '../expr';

interface StudioValue {
  state: StudioState;
  dispatch: Dispatch<Action>;
  canUndo: boolean;
  canRedo: boolean;
  locale: Locale | undefined;
  findings: Finding[];
  findingsByNode: Map<string, Finding[]>;
  /** The component the panels describe. */
  component: ComponentDef;
  /**
   * What a component's expressions evaluate against: its parameters, standing
   * in for themselves through their samples — or through the preview controls,
   * once somebody starts turning them.
   */
  scopeFor: (component: ComponentDef) => Scope;
}

const StudioContext = createContext<StudioValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }): JSX.Element {
  /* A saved document wins over the demo. Reading storage in the initialiser
     rather than in an effect means the first paint is already the real
     document — no flash of the sample components. */
  const [history, dispatch] = useReducer(historyReducer, undefined, (): HistoryState => {
    const stored = load();
    return {
      present: stored ? { ...stored.state, savedAt: stored.savedAt } : createInitialState(),
      past: [],
      future: [],
    };
  });

  const { present } = history;
  const component = activeComponent(present);

  const locale = useMemo(
    () => present.locales.find((l) => l.code === present.activeLocale),
    [present.locales, present.activeLocale],
  );

  const findings = useMemo(
    () => lint({
      components: present.components,
      locale,
      locales: present.locales,
      theme: present.theme,
      assets: present.assets.map((asset) => asset.name),
    }),
    [present.components, locale, present.locales, present.theme, present.assets],
  );

  const findingsByNode = useMemo(() => {
    const map = new Map<string, Finding[]>();
    for (const finding of findings) {
      const list = map.get(finding.nodeId) ?? [];
      list.push(finding);
      map.set(finding.nodeId, list);
    }
    return map;
  }, [findings]);

  /* Autosave, debounced. Writing on every keystroke would serialise the whole
     document a hundred times while somebody types a label. */
  const documentParts = [present.components, present.theme, present.locales, present.activeLocale, present.assets] as const;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (save(present)) dispatch({ type: 'saved', at: new Date().toISOString() });
    }, 700);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, documentParts);

  /* `t` is injected rather than declared per component: the generated code
     gets it from `useTranslation`, so an expression that uses it on the canvas
     and one that uses it in the output mean the same thing. */
  const translate = useCallback(
    (key: unknown): string => locale?.messages[String(key)] ?? String(key),
    [locale],
  );

  /* Built once per component and cached, because `NodeView` is memoised on its
     scope: handing every artboard a freshly allocated object would re-render
     the whole board on every keystroke anywhere in the studio. */
  const scopes = useMemo(() => {
    const map = new Map<string, Scope>();
    for (const target of present.components) {
      const pinned =
        target.id === present.activeId && present.activeState
          ? target.states?.find((item) => item.id === present.activeState)
          : undefined;

      const values =
        present.mode === 'preview' && target.id === present.activeId
          ? controlScope(target.params, present.controls)
          : pinned
            ? stateScope(target.params, pinned.values)
            : designScope(target.params);
      map.set(target.id, { t: translate, ...values });
    }
    return map;
  }, [present.components, present.mode, present.activeId, present.activeState, present.controls, translate]);

  const scopeFor = useCallback(
    (target: ComponentDef): Scope => scopes.get(target.id) ?? { t: translate },
    [scopes, translate],
  );

  const value = useMemo<StudioValue>(
    () => ({
      state: present,
      dispatch,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      locale,
      findings,
      findingsByNode,
      component,
      scopeFor,
    }),
    [present, history.past.length, history.future.length, locale, findings, findingsByNode, component, scopeFor],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside <StudioProvider>.');
  return value;
}
