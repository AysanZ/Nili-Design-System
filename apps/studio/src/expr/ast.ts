/**
 * The shape of an authored expression.
 *
 * The grammar is a subset of JavaScript rather than a language of its own.
 * Three things follow from that choice and none of them are accidental:
 * printing an AST back out produces valid JSX, the people using Nili already
 * know the syntax, and the editor can offer real autocomplete because the
 * parser understands member access rather than matching a pattern.
 *
 * What is deliberately absent: assignment, `function`, `new`, spread, `in`,
 * `instanceof`, comma sequences. An expression reads state; it never changes
 * it. Changing state is what an action step is for.
 */

export type Primitive = string | number | boolean | null | undefined;

export interface LiteralNode {
  type: 'Literal';
  value: Primitive;
}

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
}

export interface MemberNode {
  type: 'Member';
  object: ExprNode;
  /** `Identifier` when dotted, any expression when computed. */
  property: ExprNode;
  computed: boolean;
  optional: boolean;
}

export interface CallNode {
  type: 'Call';
  callee: ExprNode;
  args: ExprNode[];
}

export interface UnaryNode {
  type: 'Unary';
  operator: '!' | '-' | '+';
  argument: ExprNode;
}

export interface BinaryNode {
  type: 'Binary';
  operator: string;
  left: ExprNode;
  right: ExprNode;
}

export interface ConditionalNode {
  type: 'Conditional';
  test: ExprNode;
  consequent: ExprNode;
  alternate: ExprNode;
}

export interface ArrayNode {
  type: 'Array';
  elements: ExprNode[];
}

export interface ObjectNode {
  type: 'Object';
  properties: { key: string; value: ExprNode }[];
}

/** `` `hello ${name}` `` — the one piece of sugar worth having, because URLs need it. */
export interface TemplateNode {
  type: 'Template';
  /** Always one longer than `expressions`. */
  quasis: string[];
  expressions: ExprNode[];
}

export type ExprNode =
  | LiteralNode
  | IdentifierNode
  | MemberNode
  | CallNode
  | UnaryNode
  | BinaryNode
  | ConditionalNode
  | ArrayNode
  | ObjectNode
  | TemplateNode;

export interface ParseError {
  message: string;
  /** Character offset, so the editor can put the caret on the problem. */
  index: number;
}

export type ParseResult =
  | { ok: true; node: ExprNode }
  | { ok: false; error: ParseError };
