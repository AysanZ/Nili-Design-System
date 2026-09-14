import { useStudio } from '../../document/StudioContext';
import { CSS_VARIABLE, TOKEN_GROUPS, contrastRatio } from '../../theme/tokens';
import type { ThemeTokens } from '../../theme/tokens';
import { FONT_OPTIONS, PRESETS } from '../../theme/presets';
import { Section } from '../Section';

const isColourKey = (key: keyof ThemeTokens): boolean =>
  key !== 'radius' && key !== 'fontFamily';

export function ThemePanel(): JSX.Element {
  const { state, dispatch } = useStudio();
  const { theme } = state;

  const pairs: [string, string, string][] = [
    ['Primary on surface', theme.primary, theme.surface],
    ['Strong text on surface', theme.strong, theme.surface],
    ['Sub text on surface', theme.sub, theme.surface],
    ['White on primary', '#FFFFFF', theme.primary],
  ];

  return (
    <>
      <div className="presets">
        {Object.entries(PRESETS).map(([name, tokens]) => (
          <button key={name} type="button" onClick={() => dispatch({ type: 'setTheme', patch: tokens })}>
            <i style={{ background: tokens.primary }} />
            {name}
          </button>
        ))}
      </div>

      {TOKEN_GROUPS.map(({ group, keys }) => (
        <Section key={group} id={group} title={group}>
          {keys.filter(isColourKey).map((key) => (
            <div key={key} className="token-row">
              <span className="token-row__swatch" style={{ background: String(theme[key]) }}>
                <input
                  type="color"
                  aria-label={`${key} colour`}
                  value={String(theme[key])}
                  onChange={(e) => dispatch({ type: 'setTheme', patch: { [key]: e.target.value.toUpperCase() } })}
                />
              </span>
              <span className="token-row__name" title={CSS_VARIABLE[key]}>
                {key}
              </span>
              <code className="token-row__value">{String(theme[key])}</code>
            </div>
          ))}
        </Section>
      ))}

      <Section id="shape" title="Shape and type">
        <div className="field">
          <div className="field__head">
            <span className="field__label">Corner radius</span>
            <code className="field__key">{theme.radius}px</code>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={2}
            value={theme.radius}
            onChange={(e) => dispatch({ type: 'setTheme', patch: { radius: Number(e.target.value) } })}
          />
        </div>
        <div className="field">
          <div className="field__head">
            <span className="field__label">Font</span>
            <code className="field__key">--nili-font-sans</code>
          </div>
          <select
            className="select"
            value={theme.fontFamily}
            onChange={(e) => dispatch({ type: 'setTheme', patch: { fontFamily: e.target.value } })}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>
        <p className="note">
          Only the semantic layer is editable. Primitives stay shared, so a rebrand cannot restyle every palette
          at once.
        </p>
      </Section>

      <Section id="contrast" title="Contrast">
        {pairs.map(([label, fg, bg]) => {
          const ratio = contrastRatio(fg, bg);
          const level = ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail';
          return (
            <div key={label} className="token-row">
              <span className="token-row__swatch" style={{ background: bg, color: fg }}>
                A
              </span>
              <span className="token-row__name">{label}</span>
              <code className={`token-row__value is-${level}`}>{ratio.toFixed(2)}</code>
            </div>
          );
        })}
        <p className="note">4.5:1 is the WCAG AA minimum for body text.</p>
      </Section>
    </>
  );
}
