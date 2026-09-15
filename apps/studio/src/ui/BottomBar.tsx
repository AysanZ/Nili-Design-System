import { useStudio } from '../document/StudioContext';
import { fitAll, stageBox, zoomByCentre } from './canvas/view';
import { FitIcon, MinusIcon, MoonIcon, PlusIcon, SunIcon } from './icons';

/**
 * Only the controls that are about *looking* at the board.
 *
 * The bar floats over the canvas, so everything inside it claims to be a
 * canvas control. Artboard widths were not — they are a property of the
 * selected component, and they now live on the artboard's own title where the width
 * they set is visible. Insert and Add component were buttons that opened a panel
 * sitting two centimetres away. The select tool had no other mode to leave.
 */
export function BottomBar(): JSX.Element {
  const { state, dispatch } = useStudio();

  /* Stepping keeps the centre of the view where it was, which is what makes
     the buttons feel like the same gesture as a pinch rather than a jump. */
  const stepZoom = (factor: number): void => {
    const box = stageBox();
    if (!box) return;
    dispatch({ type: 'ui', patch: zoomByCentre({ zoom: state.zoom, pan: state.pan }, factor, box) });
  };

  const fit = (): void => {
    const box = stageBox();
    if (!box) return;
    const patch = fitAll(state.components, box, state.measured);
    if (patch) dispatch({ type: 'ui', patch });
  };

  return (
    <div className="bottom-bar" role="toolbar" aria-label="Canvas view">
      <div className="bottom-bar__group bottom-bar__zoom">
        <button type="button" aria-label="Zoom out" title="Zoom out · ⌘−" onClick={() => stepZoom(0.8)}>
          <MinusIcon />
        </button>
        <output aria-live="off">{Math.round(state.zoom * 100)}%</output>
        <button type="button" aria-label="Zoom in" title="Zoom in · ⌘+" onClick={() => stepZoom(1.25)}>
          <PlusIcon />
        </button>
      </div>

      <span className="bottom-bar__divider" />

      <div className="bottom-bar__group">
        <button type="button" aria-label="Fit every component on screen" title="Fit · ⇧1" onClick={fit}>
          <FitIcon />
        </button>
        <button
          type="button"
          className="bottom-bar__text"
          title="Actual size · ⌘0"
          onClick={() => dispatch({ type: 'ui', patch: { zoom: 1 } })}
        >
          <span>100%</span>
        </button>
      </div>

      <div className="bottom-bar__group">
        <button
          type="button"
          className="bottom-bar__text"
          title="Restack the columns so nothing overlaps"
          onClick={() => dispatch({ type: 'tidy' })}
        >
          <span>Tidy</span>
        </button>
      </div>

      <span className="bottom-bar__divider" />

      {/* Language belongs to what the canvas is showing, not to the editor.
          It used to sit in the application toolbar beside the interface theme,
          which implied it changed the studio — it changes the component. */}
      <div className="bottom-bar__group locale-switch" role="radiogroup" aria-label="ComponentDef language">
        {state.locales.map((item) => (
          <button
            key={item.code}
            type="button"
            role="radio"
            aria-checked={item.code === state.activeLocale}
            title={`${item.label} · ${item.dir.toUpperCase()}`}
            onClick={() => dispatch({ type: 'setActiveLocale', code: item.code })}
          >
            {item.code}
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
    </div>
  );
}
