import { useStudio } from '../document/StudioContext';
import type { Breakpoint } from '../document/state';
import { createFrame } from '../document/factory';
import { ROOT_ID } from '../document/types';
import { CursorIcon, FrameIcon, MinusIcon, MoonIcon, PlusIcon, ResetZoomIcon, SunIcon } from './icons';

const BREAKPOINTS: { value: Breakpoint; label: string }[] = [
  { value: 380, label: 'sm' },
  { value: 440, label: 'md' },
  { value: 640, label: 'lg' },
  { value: 960, label: 'xl' },
];

const STEPS = [0.4, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/** Floating rather than docked: the canvas is the subject, the controls hover. */
export function BottomBar(): JSX.Element {
  const { state, dispatch } = useStudio();

  const stepZoom = (direction: 1 | -1): void => {
    const index = STEPS.findIndex((s) => s >= state.zoom - 0.001);
    const next = STEPS[Math.min(STEPS.length - 1, Math.max(0, index + direction))] ?? 1;
    dispatch({ type: 'ui', patch: { zoom: next } });
  };

  return (
    <div className="bottom-bar" role="toolbar" aria-label="Canvas controls">
      <div className="bottom-bar__group">
        <button type="button" className="is-active" title="Select · V" aria-label="Select">
          <CursorIcon />
        </button>
        <button
          type="button"
          title="Add frame · F"
          aria-label="Add frame"
          onClick={() =>
            dispatch({
              type: 'insert',
              parentId: ROOT_ID,
              index: Number.MAX_SAFE_INTEGER,
              nodes: [createFrame({ padding: 16, radius: 12, background: 'weak' })],
            })
          }
        >
          <FrameIcon />
        </button>
        <button
          type="button"
          className="bottom-bar__insert"
          title="Insert a component"
          onClick={() => dispatch({ type: 'ui', patch: { panel: 'assets' } })}
        >
          <PlusIcon />
          <span>Insert</span>
        </button>
      </div>

      <span className="bottom-bar__divider" />

      <div className="bottom-bar__group bottom-bar__group--text">
        {BREAKPOINTS.map((bp) => (
          <button
            key={bp.value}
            type="button"
            title={`${bp.value}px`}
            aria-pressed={state.breakpoint === bp.value}
            onClick={() => dispatch({ type: 'ui', patch: { breakpoint: bp.value } })}
          >
            {bp.label}
          </button>
        ))}
      </div>

      <span className="bottom-bar__divider" />

      {/* The canvas theme is a property of the canvas, so it belongs with the
          other canvas controls rather than in the application toolbar. */}
      <div className="bottom-bar__group">
        <button
          type="button"
          title={`${state.canvasScheme} canvas`}
          aria-label="Toggle canvas theme"
          onClick={() =>
            dispatch({ type: 'ui', patch: { canvasScheme: state.canvasScheme === 'dark' ? 'light' : 'dark' } })
          }
        >
          {state.canvasScheme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <span className="bottom-bar__divider" />

      <div className="bottom-bar__group bottom-bar__zoom">
        <button type="button" aria-label="Zoom out" onClick={() => stepZoom(-1)}>
          <MinusIcon />
        </button>
        <output aria-live="off">{Math.round(state.zoom * 100)}%</output>
        <button type="button" aria-label="Zoom in" onClick={() => stepZoom(1)}>
          <PlusIcon />
        </button>
        <button type="button" aria-label="Reset zoom" title="Reset to 100%" onClick={() => dispatch({ type: 'ui', patch: { zoom: 1 } })}>
          <ResetZoomIcon />
        </button>
      </div>
    </div>
  );
}
