import { describe, expect, it } from 'vitest';
import { reducer, type StudioState } from '../core/store';
import { starter } from '../core/starter';
import { makeBox, makeEl, find, uniqueName } from '../core/tree';
import { container } from '../core/model';

const seed = (): StudioState => ({
  doc: starter(),
  ui: {
    view: 'design', left: 'insert', selected: null, theme: 'light', chrome: 'dark',
    locale: 'en', lang: 'en', zoom: 1, stateId: null, axes: [null, null],
    leftWidth: 264, rightWidth: 288, codeFile: '',
  },
  past: [],
  future: [],
});

const root = (state: StudioState) => state.doc.components[0].root;

describe('the reducer', () => {
  it('inserts into the node that was asked for, and selects it', () => {
    const before = seed();
    const node = makeEl('Button');
    const after = reducer(before, {
      type: 'node.insert',
      node,
      target: { parent: root(before).id, index: 0 },
    });
    expect(root(after).children[0].id).toBe(node.id);
    expect(after.ui.selected).toBe(node.id);
  });

  it('records history only for edits', () => {
    const before = seed();
    const edited = reducer(before, {
      type: 'node.insert',
      node: makeEl('Badge'),
      target: { parent: root(before).id, index: 0 },
    });
    expect(edited.past).toHaveLength(1);
    const looked = reducer(edited, { type: 'ui', patch: { left: 'layers' } });
    expect(looked.past).toHaveLength(1);
    expect(reducer(edited, { type: 'undo' }).doc).toBe(before.doc);
  });

  it('refuses to move a node into itself', () => {
    const before = seed();
    const box = makeBox();
    const withBox = reducer(before, {
      type: 'node.insert',
      node: box,
      target: { parent: root(before).id, index: 0 },
    });
    const moved = reducer(withBox, {
      type: 'node.move',
      id: box.id,
      target: { parent: box.id, index: 0 },
    });
    expect(moved.doc).toBe(withBox.doc);
  });

  it('duplicates with fresh ids', () => {
    const before = seed();
    const target = root(before).children[0];
    const after = reducer(before, { type: 'node.duplicate', id: target.id });
    const children = container(root(after)) ?? [];
    expect(children).toHaveLength(root(before).children.length + 1);
    expect(children[1].id).not.toBe(target.id);
  });

  it('removes a prop and everything that named it stays readable', () => {
    const before = seed();
    const prop = before.doc.components[0].props[0];
    const after = reducer(before, { type: 'prop.remove', id: prop.id });
    expect(after.doc.components[0].props.find((p) => p.id === prop.id)).toBeUndefined();
    expect(find(root(after), root(after).children[0].id)).toBeTruthy();
  });

  it('never hands out a name that is already taken', () => {
    const props = seed().doc.components[0].props;
    expect(uniqueName(props, 'label')).toBe('label2');
    expect(uniqueName(props, 'fresh')).toBe('fresh');
  });
});
