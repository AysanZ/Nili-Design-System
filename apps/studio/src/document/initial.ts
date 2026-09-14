import { createComponent, createFrame, createRoot } from './factory';
import { keyRef, literal, parseCatalog } from '../i18n/catalog';
import { DEFAULT_THEME } from '../theme/presets';
import { ROOT_ID } from './types';
import type { StudioState } from './state';

const EN = JSON.stringify({
  signup: {
    title: 'Create your account',
    subtitle: 'It takes less than a minute.',
    email: 'Email address',
    password: 'Password',
    passwordHint: 'At least 8 characters.',
    terms: 'I accept the terms of use',
    submit: 'Create account',
    or: 'or',
    google: 'Continue with Google',
  },
});

const FA = JSON.stringify({
  signup: {
    title: 'حساب کاربری بسازید',
    subtitle: 'کمتر از یک دقیقه طول می‌کشد.',
    email: 'نشانی ایمیل',
    password: 'گذرواژه',
    passwordHint: 'دست‌کم ۸ نویسه.',
    terms: 'شرایط استفاده را می‌پذیرم',
    submit: 'ساخت حساب',
    or: 'یا',
    google: 'ورود با گوگل',
  },
});

export function createInitialState(): StudioState {
  const root = createRoot([
    createFrame({ gap: 6 }, [
      createComponent('Typography', { variant: 'h5', children: keyRef('signup.title') }),
      createComponent('Typography', { variant: 'paragraph-small', children: keyRef('signup.subtitle') }),
    ]),
    createFrame({ gap: 16 }, [
      createComponent('TextInput', {
        type: 'email',
        label: keyRef('signup.email'),
        placeholder: literal('name@example.com'),
      }),
      createComponent('TextInput', {
        type: 'password',
        label: keyRef('signup.password'),
        hint: keyRef('signup.passwordHint'),
      }),
    ]),
    createComponent('Checkbox', { checked: true, label: keyRef('signup.terms') }),
    createComponent('Button', { fullWidth: true, children: keyRef('signup.submit') }),
    createComponent('ContentDivider', { type: 'text-and-line', children: keyRef('signup.or') }),
    createComponent('Button', {
      appearance: 'stroke',
      color: 'neutral',
      fullWidth: true,
      children: keyRef('signup.google'),
    }),
  ]);

  return {
    root,
    selection: new Set([ROOT_ID]),
    expanded: new Set([ROOT_ID]),
    clipboard: [],
    theme: DEFAULT_THEME,
    locales: [parseCatalog('en', 'English', EN), parseCatalog('fa', 'فارسی', FA)],
    activeLocale: 'en',
    canvasScheme: 'light',
    breakpoint: 440,
    zoom: 1,
    panel: 'layers',
    codeTab: 'component',
    codeOpen: false,
    uiScheme: 'dark',
    leftWidth: 268,
    rightWidth: 284,
  };
}
