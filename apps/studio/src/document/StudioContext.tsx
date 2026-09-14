import { createContext, useContext, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { historyReducer } from './reducer';
import type { HistoryState } from './reducer';
import type { Action, StudioState } from './state';
import { createInitialState } from './initial';
import { lint } from '../lint/engine';
import type { Finding } from '../lint/types';
import type { Locale } from '../i18n/types';

interface StudioValue {
  state: StudioState;
  dispatch: Dispatch<Action>;
  canUndo: boolean;
  canRedo: boolean;
  locale: Locale | undefined;
  findings: Finding[];
  findingsByNode: Map<string, Finding[]>;
}

const StudioContext = createContext<StudioValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }): JSX.Element {
  const [history, dispatch] = useReducer(historyReducer, undefined, (): HistoryState => ({
    present: createInitialState(),
    past: [],
    future: [],
  }));

  const { present } = history;
  const locale = useMemo(
    () => present.locales.find((l) => l.code === present.activeLocale),
    [present.locales, present.activeLocale],
  );

  const findings = useMemo(
    () => lint({ root: present.root, locale, locales: present.locales, theme: present.theme }),
    [present.root, locale, present.locales, present.theme],
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

  const value = useMemo<StudioValue>(
    () => ({
      state: present,
      dispatch,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      locale,
      findings,
      findingsByNode,
    }),
    [present, history.past.length, history.future.length, locale, findings, findingsByNode],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside <StudioProvider>.');
  return value;
}
