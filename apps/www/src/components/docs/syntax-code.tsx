import { Fragment, type ReactNode } from 'react';

type TokenKind =
  | 'plain'
  | 'comment'
  | 'keyword'
  | 'literal'
  | 'number'
  | 'string'
  | 'tag'
  | 'attribute'
  | 'variable';

interface Token {
  value: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'of',
  'return',
  'satisfies',
  'switch',
  'throw',
  'try',
  'type',
  'typeof',
  'var',
  'void',
  'while',
  'yield',
]);

const LITERALS = new Set(['false', 'null', 'true', 'undefined']);

const tokenClass: Record<Exclude<TokenKind, 'plain'>, string> = {
  comment: 'text-soft-400 italic',
  keyword: 'text-feature-base',
  literal: 'text-error-base',
  number: 'text-error-base',
  string: 'text-success-dark',
  tag: 'text-information-base',
  attribute: 'text-warning-dark',
  variable: 'text-information-base',
};

/**
 * Small TSX lexer for the documentation examples.
 *
 * Unlike a chain of regex replacements, this walks the source once, so text
 * inside strings and comments can never be interpreted as JSX or injected as
 * markup. React escapes every token when it renders the spans.
 */
export function tokenizeTsx(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let inTag = false;
  let expectsTagName = false;

  const push = (value: string, kind: TokenKind = 'plain') => {
    tokens.push({ value, kind });
  };

  while (index < source.length) {
    const rest = source.slice(index);

    const whitespace = rest.match(/^\s+/)?.[0];
    if (whitespace) {
      push(whitespace);
      index += whitespace.length;
      continue;
    }

    const lineComment = rest.match(/^\/\/[^\n]*/)?.[0];
    const blockComment = rest.match(/^\/\*[\s\S]*?\*\//)?.[0];
    const lineStart = source.lastIndexOf('\n', index - 1) + 1;
    const hashComment =
      source.slice(lineStart, index).trim() === ''
        ? rest.match(/^#[^\n]*/)?.[0]
        : undefined;
    if (lineComment || blockComment || hashComment) {
      const value = lineComment ?? blockComment ?? hashComment!;
      push(value, 'comment');
      index += value.length;
      continue;
    }

    const variable = rest.match(/^\$\{[A-Za-z_][\w]*\}/)?.[0];
    if (variable) {
      push(variable, 'variable');
      index += variable.length;
      continue;
    }

    const quote = source[index];
    if (quote === "'" || quote === '"' || quote === '`') {
      let end = index + 1;
      while (end < source.length) {
        if (source[end] === '\\') end += 2;
        else if (source[end] === quote) {
          end += 1;
          break;
        } else end += 1;
      }
      push(source.slice(index, end), 'string');
      index = end;
      continue;
    }

    const number = rest.match(/^(?:0x[\da-f]+|\d+(?:\.\d+)?)/i)?.[0];
    if (number) {
      push(number, 'number');
      index += number.length;
      continue;
    }

    if (rest.startsWith('</')) {
      push('</');
      index += 2;
      inTag = true;
      expectsTagName = true;
      continue;
    }
    if (source[index] === '<' && /[A-Za-z]/.test(source[index + 1] ?? '')) {
      push('<');
      index += 1;
      inTag = true;
      expectsTagName = true;
      continue;
    }
    if (inTag && rest.startsWith('/>')) {
      push('/>');
      index += 2;
      inTag = false;
      continue;
    }
    if (inTag && source[index] === '>') {
      push('>');
      index += 1;
      inTag = false;
      continue;
    }

    const identifier = rest.match(/^[A-Za-z_$][\w$-]*/)?.[0];
    if (identifier) {
      let kind: TokenKind = 'plain';
      if (expectsTagName) {
        kind = 'tag';
        expectsTagName = false;
      } else if (inTag) kind = 'attribute';
      else if (KEYWORDS.has(identifier)) kind = 'keyword';
      else if (LITERALS.has(identifier)) kind = 'literal';
      else if (/^[A-Z]/.test(identifier)) kind = 'tag';

      push(identifier, kind);
      index += identifier.length;
      continue;
    }

    push(source[index]);
    index += 1;
  }

  return tokens;
}

/** Highlighted code without a wrapper, so each caller keeps its own `<pre>`. */
export function SyntaxCode({ code }: { code: string }): ReactNode {
  return (
    <code>
      {tokenizeTsx(code).map((token, index) => (
        <Fragment key={index}>
          {token.kind === 'plain' ? (
            token.value
          ) : (
            <span className={tokenClass[token.kind]}>{token.value}</span>
          )}
        </Fragment>
      ))}
    </code>
  );
}
