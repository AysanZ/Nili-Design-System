import { createComponent, createComponentDef, createFrame } from './factory';
import { nextId } from './ids';
import { keyRef, literal, parseCatalog } from '../i18n/catalog';
import { DEFAULT_THEME } from '../theme/presets';
import { bind } from '../logic/types';
import type { ComponentParam } from '../logic/types';
import type { ComponentDef, DocNode } from './types';
import { GUTTER, estimatedHeight } from './types';
import type { StudioState } from './state';

const EN = JSON.stringify({
  team: {
    empty: 'Nobody here yet',
    emptyHint: 'Invite someone to get started.',
    active: 'Active',
    invited: 'Invited',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'It takes less than a minute.',
    email: 'Email address',
    password: 'Password',
    passwordHint: 'At least 8 characters.',
    terms: 'I accept the terms of use',
    submit: 'Create account',
  },
});

const FA = JSON.stringify({
  team: {
    empty: 'هنوز کسی اینجا نیست',
    emptyHint: 'برای شروع کسی را دعوت کنید.',
    active: 'فعال',
    invited: 'دعوت‌شده',
  },
  signup: {
    title: 'حساب کاربری بسازید',
    subtitle: 'کمتر از یک دقیقه طول می‌کشد.',
    email: 'نشانی ایمیل',
    password: 'گذرواژه',
    passwordHint: 'دست‌کم ۸ نویسه.',
    terms: 'شرایط استفاده را می‌پذیرم',
    submit: 'ساخت حساب',
  },
});

const param = (
  name: string,
  type: ComponentParam['type'],
  sample: ComponentParam['sample'],
  extra: Partial<ComponentParam> = {},
): ComponentParam => ({
  id: nextId(),
  name,
  type,
  sample,
  ...extra,
});

const on = (node: DocNode, events: Record<string, string>): DocNode => ({ ...node, events });
const showIf = (node: DocNode, expr: string): DocNode => ({ ...node, visibleWhen: bind(expr) });

/* ─────────────────────────  PersonRow  ───────────────────────── */

/** The smallest useful example: four values in, one event out. */
function personRow(y: number): ComponentDef {
  const base = createComponentDef('Person row', { x: 0, y, width: 380 });

  const params: ComponentParam[] = [
    // Avatar's accessible name cannot be left out, so neither can this.
    { ...param('name', 'text', 'Zahra Hosseini'), required: true },
    param('email', 'text', 'zahra@nili.dev'),
    param('initials', 'text', 'ZH'),
    param('active', 'boolean', true),
    param('onOpen', 'action', null),
  ];

  const children: DocNode[] = [
    createComponent('Avatar', {
      size: 'sm',
      name: bind('name'),
      initials: bind('initials'),
    }),
    createFrame({ gap: 2 }, [
      createComponent('Typography', { variant: 'label-medium', children: bind('name') }),
      createComponent('Typography', { variant: 'paragraph-xsmall', children: bind('email') }),
    ]),
    createComponent('StatusBadge', {
      status: bind("active ? 'completed' : 'pending'"),
      children: bind("active ? t('team.active') : t('team.invited')"),
    }),
  ];

  const row = createFrame(
    { direction: 'horizontal', gap: 12, align: 'center', padding: 12, radius: 12, background: 'card' },
    children,
  );

  return {
    ...base,
    params,
    root: {
      ...base.root,
      layout: { ...base.root.layout, padding: 12 },
      children: [on(row, { onClick: 'onOpen' })],
    },
  };
}

/* ─────────────────────────  TeamList  ───────────────────────── */

/**
 * Takes a list and says what zero of it looks like — the question the lint
 * rule asks, and the one a list component is usually shipped without.
 */
function teamList(y: number, rowId: string): ComponentDef {
  const base = createComponentDef('Team list', { x: 0, y, width: 420 });

  const params: ComponentParam[] = [
    param('people', 'list', [
      { id: 1, name: 'Zahra Hosseini', email: 'zahra@nili.dev', initials: 'ZH', active: true },
      { id: 2, name: 'Maryam Rezaei', email: 'maryam@nili.dev', initials: 'MR', active: false },
    ]),
    param('loading', 'boolean', false),
    param('onSelect', 'action', null),
  ];

  const instance: DocNode = {
    id: nextId(),
    kind: 'instance',
    className: '',
    size: { width: 'fill', height: 'hug' },
    componentId: rowId,
    args: {
      name: bind('person.name'),
      email: bind('person.email'),
      initials: bind('person.initials'),
      active: bind('person.active'),
    },
    repeat: { each: bind('people'), as: 'person', keyExpr: 'person.id' },
    events: { onOpen: 'onSelect' },
  };

  const children: DocNode[] = [
    showIf(
      createComponent('ProgressCircle', {
        indeterminate: true,
        size: '40',
        'aria-label': literal('Loading'),
        children: literal(''),
      }),
      'loading',
    ),
    instance,
    showIf(
      createComponent('EmptyState', {
        title: keyRef('team.empty'),
        description: keyRef('team.emptyHint'),
        size: 'sm',
        children: literal(''),
      }),
      '!loading && people.length === 0',
    ),
  ];

  return { ...base, params, root: { ...base.root, children } };
}

/* ─────────────────────────  SignUpForm  ───────────────────────── */

/**
 * Every flag it cannot answer is a prop: is it submitting, is the email
 * wrong, has the box been ticked. The component draws each of those; the
 * application decides them.
 */
function signUpForm(y: number): ComponentDef {
  const base = createComponentDef('Sign up form', { x: 0, y, width: 420 });

  const params: ComponentParam[] = [
    param('email', 'text', 'sara@nili.dev', { description: 'The address the field shows.' }),
    param('password', 'text', '••••••••'),
    /* The pair the whole conditional-property feature exists for. A form
       cannot be "in error" without saying what is wrong, and it has no use
       for a message when it is not — which is a thing the generated type can
       state and `emailError?: string` cannot. */
    param('emailInvalid', 'boolean', false, {
      description: 'Whether the address the caller has is usable.',
    }),
    param('emailError', 'text', 'That address is already registered.', {
      required: true,
      when: { param: 'emailInvalid', op: 'truthy' },
      description: 'Shown under the field. Required while the address is invalid.',
    }),
    param('accepted', 'boolean', false),
    param('submitting', 'boolean', false, { description: 'Disables the form and spins the button.' }),
    param('onEmailChange', 'action', null),
    param('onPasswordChange', 'action', null),
    param('onToggleTerms', 'action', null),
    param('onSubmit', 'action', null),
  ];

  const emailField = createComponent('TextInput', {
    type: 'email',
    label: keyRef('signup.email'),
    placeholder: literal('name@example.com'),
    value: bind('email'),
  });

  const children: DocNode[] = [
    createFrame({ gap: 6 }, [
      createComponent('Typography', { variant: 'h5', children: keyRef('signup.title') }),
      createComponent('Typography', { variant: 'paragraph-small', children: keyRef('signup.subtitle') }),
    ]),
    createFrame({ gap: 16 }, [
      /* The message is the component's to draw and the application's to
         decide, so the node reads both properties rather than owning either. */
      { ...on(emailField, { onChange: 'onEmailChange' }), validate: bind("emailInvalid ? emailError : ''") },
      on(
        createComponent('TextInput', {
          type: 'password',
          label: keyRef('signup.password'),
          hint: keyRef('signup.passwordHint'),
          placeholder: literal(''),
          value: bind('password'),
        }),
        { onChange: 'onPasswordChange' },
      ),
    ]),
    on(
      createComponent('Checkbox', {
        checked: bind('accepted'),
        label: keyRef('signup.terms'),
        description: literal(''),
      }),
      { onChange: 'onToggleTerms' },
    ),
    on(
      createComponent('Button', {
        fullWidth: true,
        children: keyRef('signup.submit'),
        disabled: bind('!accepted'),
        loading: bind('submitting'),
      }),
      { onClick: 'onSubmit' },
    ),
  ];

  return { ...base, params, root: { ...base.root, children } };
}

/* ─────────────────────────────  document  ───────────────────────────── */

export function createInitialState(): StudioState {
  const row = personRow(0);
  const list = teamList(estimatedHeight(row) + GUTTER, row.id);
  const form = signUpForm(estimatedHeight(row) + estimatedHeight(list) + GUTTER * 2);

  const components = [row, list, form];

  return {
    components,
    activeId: row.id,
    selection: new Set([row.root.id]),
    expanded: new Set(components.map((component) => component.root.id)),
    clipboard: [],
    theme: DEFAULT_THEME,
    locales: [parseCatalog('en', 'English', EN), parseCatalog('fa', 'فارسی', FA)],
    activeLocale: 'en',
    assets: [],
    canvasScheme: 'light',
    mode: 'design',
    controls: {},
    activeState: null,
    allStates: false,
    breakpoint: null,
    zoom: 0.6,
    pan: { x: 0, y: 0 },
    measured: {},
    panel: 'layers',
    rightTab: 'design',
    catalogue: null,
    catalogueWidth: 760,
    catalogueTheme: 'dark',
    catalogueLocale: 'en',
    recent: ['Button', 'TextInput', '__frame'],
    codeTab: 'component',
    codeId: row.id,
    codeOpen: false,
    uiScheme: 'dark',
    leftWidth: 314,
    rightWidth: 296,
    savedAt: null,
  };
}
