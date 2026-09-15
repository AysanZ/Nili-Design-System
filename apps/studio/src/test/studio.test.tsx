import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { starter } from '../core/starter';
import { sampleValues, test as holds } from '../core/model';
import { componentFile, storyFile } from '../codegen';
import { buildMatrix } from '../core/matrix';
import { CATALOGUE } from '../core/catalogue';

const first = () => starter().components[0];

describe('the catalogue', () => {
  it('reads the generated registry', () => {
    expect(CATALOGUE.size).toBeGreaterThan(40);
    expect(CATALOGUE.get('Button')?.props.some((prop) => prop.key === 'appearance')).toBe(true);
  });

  it('keeps icon props editable even though their control is "none"', () => {
    expect(CATALOGUE.get('Icon')?.props.some((prop) => prop.editor === 'icon')).toBe(true);
  });
});

describe('dependent props', () => {
  it('drops a prop whose condition fails', () => {
    const component = first();
    const off = sampleValues(component.props, { invalid: false });
    const on = sampleValues(component.props, { invalid: true });
    expect(off.errorLabel).toBeUndefined();
    expect(on.errorLabel).toBeTruthy();
    expect(on.hint).toBeUndefined();
  });

  it('generates a union that forbids the impossible pair', () => {
    const source = componentFile(first()).source;
    expect(source).toContain('invalid: true');
    expect(source).toContain('errorLabel?: never');
    expect(source).toContain('export type AccountFieldProps');
  });

  it('wraps a conditional layer in the condition it was given', () => {
    expect(componentFile(first()).source).toContain('{!invalid && (');
  });
});

describe('codegen', () => {
  it('imports only what the tree uses', () => {
    const source = componentFile(first()).source;
    expect(source).toContain("from '@nili/ui'");
    expect(source).toContain('TextInput');
  });

  it('writes a story per named state', () => {
    const source = storyFile(first()).source;
    expect(source).toContain('export const Invalid');
    expect(source).toContain('export const Empty');
  });
});

describe('the variants grid', () => {
  it('crosses two props and marks what cannot exist', () => {
    const matrix = buildMatrix(first(), ['invalid', null]);
    expect(matrix.row?.name).toBe('invalid');
    expect(matrix.cells.length).toBe(2);
  });

  it('agrees with the condition evaluator', () => {
    const component = first();
    const values = sampleValues(component.props, { invalid: true });
    expect(holds({ op: 'truthy', prop: 'invalid' }, values)).toBe(true);
  });
});

describe('the studio', () => {
  it('mounts and draws the starter component', () => {
    localStorage.clear();
    render(<App />);
    expect(screen.getAllByText('AccountField').length).toBeGreaterThan(0);
    // The canvas renders the real component, so its label is on screen.
    expect(screen.getAllByText('Email address').length).toBeGreaterThan(0);
  });
});
