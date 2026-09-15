import { describe, expect, it } from 'vitest';
import { contractOf } from './contract';
import { createFrame } from '../document/factory';
import type { ComponentDef } from '../document/types';
import type { ComponentParam } from '../logic/types';

const component = (params: ComponentParam[]): ComponentDef => ({
  id: 'c1',
  name: 'Field',
  component: 'Field',
  params,
  root: createFrame(),
  x: 0,
  y: 0,
  width: 440,
});

const param = (over: Partial<ComponentParam> & { name: string }): ComponentParam => ({
  id: over.name,
  type: 'text',
  sample: '',
  ...over,
});

describe('contractOf', () => {
  it('writes a plain interface when nothing depends on anything', () => {
    const { blocks, discriminated, destructure } = contractOf(
      component([param({ name: 'label', required: true })]),
    );
    expect(discriminated).toBe(false);
    expect(blocks.join('\n')).toContain('export interface FieldProps {');
    expect(blocks.join('\n')).toContain('label: string');
    expect(destructure).toBe('{ label, className }');
  });

  it('carries a description over as a doc comment', () => {
    const { blocks } = contractOf(
      component([param({ name: 'label', description: 'Sits above the input.' })]),
    );
    expect(blocks.join('\n')).toContain('/** Sits above the input. */');
  });

  /* The case the whole module exists for. */
  it('turns a dependent property into a discriminated union', () => {
    const source = contractOf(
      component([
        param({ name: 'label', required: true }),
        param({ name: 'error', type: 'boolean', sample: false }),
        param({
          name: 'errorLabel',
          required: true,
          when: { param: 'error', op: 'truthy' },
        }),
      ]),
    );

    const code = source.blocks.join('\n\n');
    expect(source.discriminated).toBe(true);
    // The base keeps what is always there…
    expect(code).toContain('export interface FieldBaseProps {');
    expect(code).toContain('label: string');
    // …and the union says when the rest exists.
    expect(code).toContain("{ error: true; errorLabel: string }");
    expect(code).toContain("{ error?: false; errorLabel?: never }");
    expect(code).toContain('export type FieldProps = FieldBaseProps & FieldErrorProps');
  });

  it('keeps an optional dependent optional inside its branch', () => {
    const code = contractOf(
      component([
        param({ name: 'dismissible', type: 'boolean', sample: false }),
        param({ name: 'dismissLabel', when: { param: 'dismissible', op: 'truthy' } }),
      ]),
    ).blocks.join('\n');
    expect(code).toContain('{ dismissible: true; dismissLabel?: string }');
  });

  it('branches on each option of a variant property', () => {
    const code = contractOf(
      component([
        param({ name: 'kind', options: ['link', 'button'], sample: 'button' }),
        param({ name: 'href', required: true, when: { param: 'kind', op: 'is', value: 'link' } }),
      ]),
    ).blocks.join('\n');
    expect(code).toContain("{ kind: 'link'; href: string }");
    // `button` is the sample, so it is the branch a caller may leave out.
    expect(code).toContain("{ kind?: 'button'; href?: never }");
  });

  it('never gives a conditional property a destructure default', () => {
    const { destructure } = contractOf(
      component([
        param({ name: 'error', type: 'boolean', sample: false }),
        param({ name: 'errorLabel', when: { param: 'error', op: 'truthy' } }),
      ]),
    );
    expect(destructure).toBe('{ error = false, errorLabel, className }');
  });

  it('degrades to a plain optional when the controller cannot be enumerated', () => {
    const source = contractOf(
      component([
        param({ name: 'note' }),
        param({ name: 'noteTone', when: { param: 'note', op: 'truthy' } }),
      ]),
    );
    expect(source.discriminated).toBe(false);
    expect(source.blocks.join('\n')).toContain('noteTone?: string');
  });
});
