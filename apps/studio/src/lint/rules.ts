import type { Rule } from './types';

const blank = (value: string): boolean => value.trim().length === 0;

/**
 * Each rule restates a constraint the library already documents, and `source`
 * points at it. The studio is not inventing policy; it is enforcing the design
 * system's own, at the moment of design rather than at review.
 */
export const RULES: readonly Rule[] = [
  {
    id: 'button/icon-only-name',
    component: 'Button',
    severity: 'error',
    source: 'ButtonProps.iconOnly',
    message: 'An icon-only button has no accessible name.',
    field: 'aria-label',
    fix: 'Set an accessible name',
    applies: ({ node, text }) =>
      node.kind === 'component' && node.props.iconOnly === true && blank(text('aria-label')),
  },
  {
    id: 'button/loading-announcement',
    component: 'Button',
    severity: 'warning',
    source: 'ButtonProps.loadingLabel',
    message: 'The loading state is not announced.',
    field: 'loadingLabel',
    fix: 'Set loadingLabel',
    applies: ({ node, text }) =>
      node.kind === 'component' && node.props.loading === true && blank(text('loadingLabel')),
  },
  {
    id: 'alert/title',
    component: 'Alert',
    severity: 'error',
    source: 'AlertProps.title (required)',
    message: 'Alert has no title.',
    field: 'title',
    fix: 'Set a title',
    applies: ({ text }) => blank(text('title')),
  },
  {
    id: 'alert/dismiss-name',
    component: 'Alert',
    severity: 'warning',
    source: 'AlertProps.dismissLabel',
    message: 'The close button has no accessible name.',
    field: 'dismissLabel',
    fix: 'Set dismissLabel',
    applies: ({ node, text }) =>
      node.kind === 'component' && node.props.dismissible === true && blank(text('dismissLabel')),
  },
  {
    id: 'tag/dismiss-name',
    component: 'Tag',
    severity: 'warning',
    source: 'TagProps.dismissLabel',
    message: 'The remove button has no accessible name.',
    field: 'dismissLabel',
    fix: 'Set dismissLabel',
    applies: ({ node, text }) =>
      node.kind === 'component' && node.props.dismissible === true && blank(text('dismissLabel')),
  },
  {
    id: 'text-input/label',
    component: 'TextInput',
    severity: 'error',
    source: 'TextInputProps.label',
    message: 'The field has no label.',
    field: 'label',
    fix: 'Set a label',
    applies: ({ text }) => blank(text('label')) && blank(text('aria-label')),
  },
  ...(['Checkbox', 'Radio', 'Switch'] as const).map<Rule>((component) => ({
    id: `${component.toLowerCase()}/label`,
    component,
    severity: 'warning',
    source: `${component}Props.label`,
    message: `The ${component.toLowerCase()} has no label.`,
    field: 'label',
    fix: 'Set a label',
    applies: ({ text }) => blank(text('label')) && blank(text('aria-label')),
  })),
  {
    id: 'avatar/fallback',
    component: 'Avatar',
    severity: 'warning',
    source: 'AvatarProps.name (required)',
    message: 'Avatar has nothing to fall back to when no image loads.',
    field: 'initials',
    fix: 'Set initials, or turn on placeholder',
    applies: ({ node, text }) =>
      node.kind === 'component' && blank(text('initials')) && node.props.placeholder !== true,
  },
  {
    id: 'progress/name',
    component: 'ProgressBar',
    severity: 'warning',
    source: 'ProgressBarProps[aria-label]',
    message: 'The bar has no accessible name.',
    field: 'label',
    fix: 'Set a label or an accessible name',
    applies: ({ text }) => blank(text('label')) && blank(text('aria-label')),
  },
];
