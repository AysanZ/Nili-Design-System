import { NiliProvider } from '@nili/ui';
import { axisCandidates, axisLabel, buildMatrix } from '../core/matrix';
import { renderNode } from '../core/render';
import { useStudio } from '../core/store';
import { useT } from '../i18n';
import { CanvasBar } from './Canvas';
import { Empty, Select } from './controls';

export function Variants(): JSX.Element {
  const { component, state, dispatch } = useStudio();
  const t = useT();
  const candidates = axisCandidates(component);
  const matrix = buildMatrix(component, state.ui.axes);
  const dir = state.ui.locale === 'fa' ? 'rtl' : 'ltr';

  if (candidates.length === 0) {
    return (
      <div className="canvas">
        <CanvasBar />
        <div className="canvas__stage">
          <Empty
            title={t('Every appearance')}
            body={t('Add two props with a fixed set of values to cross them here.')}
          />
        </div>
      </div>
    );
  }

  const setAxis = (index: 0 | 1, name: string): void => {
    const axes: [string | null, string | null] = [...state.ui.axes];
    axes[index] = name || null;
    dispatch({ type: 'ui', patch: { axes } });
  };

  return (
    <div className="canvas">
      <div className="canvas__bar">
        <label className="axis__pick">
          <span>{t('Rows')}</span>
          <Select
            value={matrix.row?.name ?? ''}
            options={candidates.map((prop) => ({ value: prop.name, label: prop.name }))}
            onChange={(name) => setAxis(0, name)}
          />
        </label>
        <label className="axis__pick">
          <span>{t('Columns')}</span>
          <Select
            value={matrix.col?.name ?? ''}
            options={[
              { value: '', label: '—' },
              ...candidates.map((prop) => ({ value: prop.name, label: prop.name })),
            ]}
            onChange={(name) => setAxis(1, name)}
          />
        </label>
        <span className="spacer" />
        <CanvasBar />
      </div>

      <div className="canvas__stage canvas__stage--grid">
        <table className="matrix">
          {matrix.col ? (
            <thead>
              <tr>
                <th />
                {matrix.colValues.map((value) => (
                  <th key={String(value)}>
                    <span className="matrix__axis">{matrix.col?.name}</span>
                    {axisLabel(value)}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {matrix.cells.map((row, rowIndex) => (
              <tr key={String(matrix.rowValues[rowIndex])}>
                <th scope="row">
                  <span className="matrix__axis">{matrix.row?.name}</span>
                  {axisLabel(matrix.rowValues[rowIndex])}
                </th>
                {row.map((cell) => (
                  <td key={cell.key}>
                    {cell.impossible ? (
                      <span className="matrix__void" title={cell.impossible}>
                        {t('Not possible')}
                      </span>
                    ) : (
                      <div className="matrix__cell" style={{ width: component.width }}>
                        <NiliProvider
                          attributeTarget="self"
                          theme={state.ui.theme}
                          locale={state.ui.locale}
                          dir={dir}
                        >
                          <div
                            className="artboard__inner"
                            data-theme={state.ui.theme}
                            lang={state.ui.locale}
                            dir={dir}
                          >
                            {renderNode(component.root, { values: cell.values, editable: false })}
                          </div>
                        </NiliProvider>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {component.states.length ? (
          <section className="named">
            <h2>{t('Named states')}</h2>
            <div className="named__row">
              {component.states.map((item) => (
                <figure key={item.id}>
                  <div className="matrix__cell" style={{ width: component.width }}>
                    <NiliProvider
                      attributeTarget="self"
                      theme={state.ui.theme}
                      locale={state.ui.locale}
                      dir={dir}
                    >
                      <div
                        className="artboard__inner"
                        data-theme={state.ui.theme}
                        lang={state.ui.locale}
                        dir={dir}
                      >
                        {renderNode(component.root, {
                          values: statesValues(component.props, item.values),
                          editable: false,
                        })}
                      </div>
                    </NiliProvider>
                  </div>
                  <figcaption>{item.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

import { sampleValues, type Json, type PropDef } from '../core/model';

const statesValues = (
  props: PropDef[],
  overrides: Record<string, Json>,
): Record<string, Json | undefined> => sampleValues(props, overrides);
