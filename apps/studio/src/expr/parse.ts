import type { ExprNode, ParseResult } from './ast';

/**
 * A hand-written tokeniser and Pratt parser, about two hundred lines.
 *
 * A dependency was the obvious alternative and was rejected for the same
 * reason the library ships no i18n runtime: the studio's whole value is that
 * nothing about a component is described twice, and a third-party grammar
 * would be a second description of what the generated code may contain. This
 * parser and the printer next to it are the single description.
 */

type TokenKind = 'num' | 'str' | 'name' | 'punct' | 'template' | 'eof';

interface Token {
  kind: TokenKind;
  value: string;
  index: number;
  /** Populated for `template` only: cooked text and raw sub-expression sources. */
  parts?: { quasis: string[]; sources: string[] };
}

/* Longest first: `===` must win over `==`, which must win over `=`. */
const PUNCTUATION = [
  '===', '!==', '?.', '??', '&&', '||', '==', '!=', '<=', '>=',
  '(', ')', '[', ']', '{', '}', ',', '.', ':', '?', '+', '-', '*', '/', '%', '<', '>', '!',
];

const BINARY_PRECEDENCE: Record<string, number> = {
  '??': 1,
  '||': 2,
  '&&': 3,
  '===': 7, '!==': 7, '==': 7, '!=': 7,
  '<': 8, '>': 8, '<=': 8, '>=': 8,
  '+': 10, '-': 10,
  '*': 11, '/': 11, '%': 11,
};

const isIdentifierStart = (c: string): boolean => /[A-Za-z_$]/.test(c);
const isIdentifierPart = (c: string): boolean => /[A-Za-z0-9_$]/.test(c);

class ExpressionError extends Error {
  constructor(message: string, readonly index: number) {
    super(message);
    this.name = 'ExpressionError';
  }
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i] as string;

    if (/\s/.test(char)) {
      i += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      const { value, next } = readString(source, i, char);
      tokens.push({ kind: 'str', value, index: i });
      i = next;
      continue;
    }

    if (char === '`') {
      const { parts, next } = readTemplate(source, i);
      tokens.push({ kind: 'template', value: source.slice(i, next), index: i, parts });
      i = next;
      continue;
    }

    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(source[i + 1] ?? ''))) {
      let j = i;
      while (j < source.length && /[0-9._]/.test(source[j] as string)) j += 1;
      tokens.push({ kind: 'num', value: source.slice(i, j).replace(/_/g, ''), index: i });
      i = j;
      continue;
    }

    if (isIdentifierStart(char)) {
      let j = i;
      while (j < source.length && isIdentifierPart(source[j] as string)) j += 1;
      tokens.push({ kind: 'name', value: source.slice(i, j), index: i });
      i = j;
      continue;
    }

    const punct = PUNCTUATION.find((p) => source.startsWith(p, i));
    if (!punct) throw new ExpressionError(`Unexpected character "${char}".`, i);
    tokens.push({ kind: 'punct', value: punct, index: i });
    i += punct.length;
  }

  tokens.push({ kind: 'eof', value: '', index: source.length });
  return tokens;
}

function readString(source: string, start: number, quote: string): { value: string; next: number } {
  let out = '';
  let i = start + 1;
  while (i < source.length) {
    const char = source[i] as string;
    if (char === '\\') {
      out += unescape(source[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (char === quote) return { value: out, next: i + 1 };
    out += char;
    i += 1;
  }
  throw new ExpressionError('Unterminated string.', start);
}

const unescape = (char: string): string =>
  ({ n: '\n', t: '\t', r: '\r', '\\': '\\', "'": "'", '"': '"', '`': '`' })[char] ?? char;

/**
 * Templates are scanned rather than parsed here: each `${...}` is captured as
 * raw source and handed back to the parser, which keeps brace counting in one
 * place and nesting free.
 */
function readTemplate(source: string, start: number): { parts: { quasis: string[]; sources: string[] }; next: number } {
  const quasis: string[] = [];
  const sources: string[] = [];
  let current = '';
  let i = start + 1;

  while (i < source.length) {
    const char = source[i] as string;

    if (char === '\\') {
      current += unescape(source[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (char === '`') {
      quasis.push(current);
      return { parts: { quasis, sources }, next: i + 1 };
    }
    if (char === '$' && source[i + 1] === '{') {
      quasis.push(current);
      current = '';
      let depth = 1;
      let j = i + 2;
      while (j < source.length && depth > 0) {
        const inner = source[j] as string;
        if (inner === '{') depth += 1;
        else if (inner === '}') depth -= 1;
        else if (inner === '"' || inner === "'") j = readString(source, j, inner).next - 1;
        if (depth > 0) j += 1;
      }
      if (depth > 0) throw new ExpressionError('Unterminated ${ } in template.', i);
      sources.push(source.slice(i + 2, j));
      i = j + 1;
      continue;
    }
    current += char;
    i += 1;
  }
  throw new ExpressionError('Unterminated template literal.', start);
}

const KEYWORD_LITERALS: Record<string, ExprNode> = {
  true: { type: 'Literal', value: true },
  false: { type: 'Literal', value: false },
  null: { type: 'Literal', value: null },
  undefined: { type: 'Literal', value: undefined },
};

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  private get current(): Token {
    return this.tokens[this.position] as Token;
  }

  private at(value: string): boolean {
    return this.current.kind === 'punct' && this.current.value === value;
  }

  private eat(value: string): boolean {
    if (!this.at(value)) return false;
    this.position += 1;
    return true;
  }

  private expect(value: string): void {
    if (!this.eat(value)) {
      throw new ExpressionError(`Expected "${value}".`, this.current.index);
    }
  }

  parse(): ExprNode {
    const node = this.conditional();
    if (this.current.kind !== 'eof') {
      throw new ExpressionError(`Unexpected "${this.current.value}".`, this.current.index);
    }
    return node;
  }

  private conditional(): ExprNode {
    const test = this.binary(0);
    if (!this.eat('?')) return test;
    const consequent = this.conditional();
    this.expect(':');
    return { type: 'Conditional', test, consequent, alternate: this.conditional() };
  }

  private binary(minimum: number): ExprNode {
    let left = this.unary();
    for (;;) {
      const token = this.current;
      if (token.kind !== 'punct') break;
      const precedence = BINARY_PRECEDENCE[token.value];
      if (precedence === undefined || precedence < minimum) break;
      this.position += 1;
      const right = this.binary(precedence + 1);
      left = { type: 'Binary', operator: token.value, left, right };
    }
    return left;
  }

  private unary(): ExprNode {
    const token = this.current;
    if (token.kind === 'punct' && (token.value === '!' || token.value === '-' || token.value === '+')) {
      this.position += 1;
      return { type: 'Unary', operator: token.value, argument: this.unary() };
    }
    return this.postfix();
  }

  private postfix(): ExprNode {
    let node = this.primary();
    for (;;) {
      if (this.eat('.')) {
        node = { type: 'Member', object: node, property: this.identifier(), computed: false, optional: false };
      } else if (this.eat('?.')) {
        if (this.at('(')) {
          node = { type: 'Call', callee: node, args: this.args() };
          continue;
        }
        node = { type: 'Member', object: node, property: this.identifier(), computed: false, optional: true };
      } else if (this.eat('[')) {
        const property = this.conditional();
        this.expect(']');
        node = { type: 'Member', object: node, property, computed: true, optional: false };
      } else if (this.at('(')) {
        node = { type: 'Call', callee: node, args: this.args() };
      } else {
        return node;
      }
    }
  }

  private args(): ExprNode[] {
    this.expect('(');
    const args: ExprNode[] = [];
    if (this.eat(')')) return args;
    do {
      args.push(this.conditional());
    } while (this.eat(','));
    this.expect(')');
    return args;
  }

  private identifier(): ExprNode {
    const token = this.current;
    if (token.kind !== 'name') throw new ExpressionError('Expected a property name.', token.index);
    this.position += 1;
    return { type: 'Identifier', name: token.value };
  }

  private primary(): ExprNode {
    const token = this.current;

    if (this.eat('(')) {
      const node = this.conditional();
      this.expect(')');
      return node;
    }

    if (token.kind === 'num') {
      this.position += 1;
      return { type: 'Literal', value: Number(token.value) };
    }

    if (token.kind === 'str') {
      this.position += 1;
      return { type: 'Literal', value: token.value };
    }

    if (token.kind === 'template') {
      this.position += 1;
      const parts = token.parts as { quasis: string[]; sources: string[] };
      return {
        type: 'Template',
        quasis: parts.quasis,
        expressions: parts.sources.map((source) => new Parser(tokenize(source)).parse()),
      };
    }

    if (token.kind === 'name') {
      this.position += 1;
      const keyword = KEYWORD_LITERALS[token.value];
      return keyword ?? { type: 'Identifier', name: token.value };
    }

    if (this.eat('[')) {
      const elements: ExprNode[] = [];
      if (this.eat(']')) return { type: 'Array', elements };
      do {
        elements.push(this.conditional());
      } while (this.eat(','));
      this.expect(']');
      return { type: 'Array', elements };
    }

    if (this.eat('{')) {
      const properties: { key: string; value: ExprNode }[] = [];
      if (this.eat('}')) return { type: 'Object', properties };
      do {
        const key = this.current;
        if (key.kind !== 'name' && key.kind !== 'str') {
          throw new ExpressionError('Expected a property name.', key.index);
        }
        this.position += 1;
        this.expect(':');
        properties.push({ key: key.value, value: this.conditional() });
      } while (this.eat(','));
      this.expect('}');
      return { type: 'Object', properties };
    }

    throw new ExpressionError(
      token.kind === 'eof' ? 'The expression is incomplete.' : `Unexpected "${token.value}".`,
      token.index,
    );
  }
}

/** Never throws: a broken expression is a lint finding, not a crash. */
export function parse(source: string): ParseResult {
  const trimmed = source.trim();
  if (!trimmed) return { ok: false, error: { message: 'The expression is empty.', index: 0 } };
  try {
    return { ok: true, node: new Parser(tokenize(trimmed)).parse() };
  } catch (error) {
    if (error instanceof ExpressionError) {
      return { ok: false, error: { message: error.message, index: error.index } };
    }
    return { ok: false, error: { message: 'The expression could not be read.', index: 0 } };
  }
}
