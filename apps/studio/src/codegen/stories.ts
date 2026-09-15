import { PARAM_SIGNATURE } from '../logic/types';
import type { ComponentDef } from '../document/types';
import type { Json } from '../logic/types';

const INDENT = '  ';

function literal(value: Json | undefined, indent = INDENT.repeat(2)): string {
  if (value === undefined || value === null) return 'undefined';
  if (typeof value === 'string') return value.includes("'") ? JSON.stringify(value) : `'${value}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const inner = value.map((item) => `${indent}${INDENT}${literal(item, indent + INDENT)}`).join(',\n');
    return `[\n${inner},\n${indent}]`;
  }
  const entries = Object.entries(value);
  if (!entries.length) return '{}';
  const inner = entries
    .map(([key, item]) => `${indent}${INDENT}${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${literal(item, indent + INDENT)}`)
    .join(',\n');
  return `{\n${inner},\n${indent}}`;
}

/**
 * A story beside every component.
 *
 * This is where the output should land, because it is where the team already
 * looks at components: the samples that made the canvas legible while it was
 * being drawn are exactly the args a story needs, so writing them out is
 * free — and a component arriving without one is a component nobody reviews.
 *
 * Action parameters become `fn()` spies rather than empty arrows, so the
 * Actions panel records them and "does the button call anything?" is a
 * question the story can answer.
 */
export function storySource(component: ComponentDef): string {
  const { component: name, params } = component;
  /* Slots are left out of `args` for the same reason actions are not plain
     values: `content: undefined` says nothing, and a story that passes JSX is
     a story somebody has to write by hand. The prop is still in the table
     Storybook builds from the types. */
  const values = params.filter((param) => param.type !== 'action' && param.type !== 'slot');
  const actions = params.filter((param) => param.type === 'action');

  const args = [
    ...values.map((param) => `${INDENT.repeat(2)}${param.name}: ${literal(param.sample)}`),
    ...actions.map((param) => `${INDENT.repeat(2)}${param.name}: fn()`),
  ];

  /* A boolean or a small union is worth a control; free text is not worth
     describing twice, since the arg above already shows its shape. */
  const controls = values
    .filter((param) => param.type === 'boolean')
    .map((param) => `${INDENT.repeat(2)}${param.name}: { control: 'boolean' },`);

  return `import type { Meta, StoryObj } from '@storybook/react'
${actions.length ? "import { fn } from '@storybook/test'\n" : ''}import { ${name} } from './${name}'

const meta = {
${INDENT}title: 'Generated/${name}',
${INDENT}component: ${name},
${INDENT}parameters: { layout: 'centered' },
${INDENT}tags: ['autodocs'],
${controls.length ? `${INDENT}argTypes: {\n${controls.join('\n')}\n${INDENT}},\n` : ''}${INDENT}args: {
${args.join(',\n')}${args.length ? ',' : ''}
${INDENT}},
} satisfies Meta<typeof ${name}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
${stateStories(component)}`;
}

/**
 * One story per named state.
 *
 * This used to guess: a story per boolean, flipped, on the theory that a flag
 * probably marks a state worth seeing. It often did and it was still a guess —
 * it could not know that `loading: true` and `people: []` are two different
 * appearances, or that `disabled` is not one at all. A named state is somebody
 * saying which appearances matter, so the stories stop guessing.
 */
function stateStories(component: ComponentDef): string {
  const states = component.states ?? [];

  if (!states.length) {
    // Nothing named, so fall back to the old guess rather than ship one story.
    const flags = component.params.filter((param) => param.type === 'boolean');
    if (!flags.length) return '';
    return `\n${flags
      .map((flag) => `export const ${title(flag.name)}: Story = {\n${INDENT}args: { ${flag.name}: ${!flag.sample} },\n}`)
      .join('\n\n')}\n`;
  }

  return `\n${states
    .map((state) => {
      const args = Object.entries(state.values)
        .map(([name, value]) => `${INDENT.repeat(2)}${name}: ${literal(value, INDENT.repeat(2))}`)
        .join(',\n');
      return `export const ${title(state.name)}: Story = {\n${INDENT}args: {\n${args}${args ? ',' : ''}\n${INDENT}},\n}`;
    })
    .join('\n\n')}\n`;
}

/** `Empty list` → `EmptyList`, because a story export has to be an identifier. */
function title(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9 ]+/g, ' ').trim();
  const joined = cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return /^[A-Za-z_$]/.test(joined) ? joined : `State${joined}`;
}

/** The props table, for the README the export ships with. */
export function propsTable(component: ComponentDef): string {
  if (!component.params.length) return '_Takes nothing but `className`._';
  const rows = component.params.map(
    (param) =>
      `| \`${param.name}\` | \`${PARAM_SIGNATURE[param.type]}\` | ${param.required ? 'yes' : 'no'} |`,
  );
  return ['| Prop | Type | Required |', '| --- | --- | --- |', ...rows].join('\n');
}
