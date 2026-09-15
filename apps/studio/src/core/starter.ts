import { DEFAULT_LAYOUT, DEFAULT_STYLE, boundTo, constant, type Doc } from './model';
import { uid } from './tree';

/**
 * What opens the first time, and what "Reset" goes back to.
 *
 * It is a working example of the one idea the studio exists for: a prop that
 * only exists while another one is on. `errorLabel` is required when `invalid`
 * is true and cannot be passed at all when it is false — which the exported
 * type enforces, the inspector hides, and the variants grid stops crossing.
 */
export function starter(): Doc {
  const componentId = uid('c');

  return {
    version: 2,
    activeId: componentId,
    components: [
      {
        id: componentId,
        name: 'AccountField',
        description: 'A labelled text field that explains itself when the value is wrong.',
        width: 380,
        props: [
          {
            id: uid('p'),
            name: 'label',
            kind: 'text',
            required: true,
            sample: 'Email address',
            description: 'Sits above the field.',
          },
          {
            id: uid('p'),
            name: 'placeholder',
            kind: 'text',
            required: false,
            sample: 'you@example.com',
          },
          {
            id: uid('p'),
            name: 'value',
            kind: 'text',
            required: false,
            sample: '',
          },
          {
            id: uid('p'),
            name: 'invalid',
            kind: 'boolean',
            required: false,
            default: false,
            sample: false,
            description: 'Turns the field red and swaps the hint for the error.',
          },
          {
            id: uid('p'),
            name: 'errorLabel',
            kind: 'text',
            required: true,
            sample: 'That address is not complete.',
            when: { op: 'truthy', prop: 'invalid' },
            description: 'What went wrong, in the words the person needs.',
          },
          {
            id: uid('p'),
            name: 'hint',
            kind: 'text',
            required: false,
            sample: 'We only use this to sign you in.',
            when: { op: 'falsy', prop: 'invalid' },
          },
          {
            id: uid('p'),
            name: 'onChange',
            kind: 'action',
            required: false,
          },
        ],
        states: [
          { id: uid('st'), name: 'Empty', values: { value: '', invalid: false } },
          {
            id: uid('st'),
            name: 'Invalid',
            values: { value: 'nili@', invalid: true },
          },
        ],
        root: {
          id: uid('b'),
          kind: 'box',
          name: 'Field',
          layout: { ...DEFAULT_LAYOUT, dir: 'col', gap: 8, padding: [0, 0, 0, 0] },
          style: { ...DEFAULT_STYLE, background: 'none', width: 'fill' },
          children: [
            {
              id: uid('e'),
              kind: 'el',
              component: 'TextInput',
              props: {
                label: boundTo('label'),
                placeholder: boundTo('placeholder'),
                value: boundTo('value'),
                error: boundTo('errorLabel'),
                onChange: boundTo('onChange'),
                size: constant('md'),
              },
            },
            {
              id: uid('e'),
              kind: 'el',
              component: 'HintText',
              when: { op: 'falsy', prop: 'invalid' },
              props: { children: boundTo('hint') },
              children: [],
            },
          ],
        },
      },
    ],
  };
}
