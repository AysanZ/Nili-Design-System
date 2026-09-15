import type { ExprNode } from './ast';

export type Scope = Record<string, unknown>;

/**
 * Methods an expression may call.
 *
 * The allowlist is not a security boundary — the author of the document is
 * the person running the studio, and the generated code runs unrestricted
 * anyway. It is a *design* boundary: an expression that can call anything
 * becomes the place people put logic, and then the action list and the
 * generated component stop being the description of what the screen does.
 *
 * Everything here is total and side-effect free, which is why the canvas can
 * evaluate an expression on every render without thinking about it.
 */
const ALLOWED_METHODS = new Set([
  // strings
  'toUpperCase', 'toLowerCase', 'trim', 'includes', 'startsWith', 'endsWith',
  'slice', 'split', 'replace', 'replaceAll', 'padStart', 'padEnd', 'repeat', 'at', 'charAt',
  // numbers
  'toFixed', 'toString', 'toLocaleString',
  // arrays
  'filter', 'map', 'find', 'some', 'every', 'join', 'concat', 'indexOf', 'reverse', 'sort',
  // both
  'length',
]);

/** Free functions available without a receiver. */
const GLOBALS: Scope = {
  Math,
  Number,
  String,
  Boolean,
  JSON: { stringify: JSON.stringify, parse: JSON.parse },
  Date,
};

export interface EvaluationResult {
  value: unknown;
  /** Present when the expression read something the scope does not define. */
  error?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

class EvaluationError extends Error {}

function read(target: unknown, key: string): unknown {
  if (target === null || target === undefined) return undefined;
  if (!ALLOWED_METHODS.has(key) && !isObject(target)) {
    // A property on a primitive that is not on the allowlist: reading it would
    // expose the prototype chain, which is exactly what the list is drawn to
    // keep out of the language.
    return undefined;
  }
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined;
  const value = (target as Record<string, unknown>)[key];
  return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
}

function run(node: ExprNode, scope: Scope): unknown {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier': {
      if (node.name in scope) return scope[node.name];
      if (node.name in GLOBALS) return GLOBALS[node.name];
      throw new EvaluationError(`"${node.name}" is not defined on this component.`);
    }

    case 'Member': {
      const object = run(node.object, scope);
      if (node.optional && (object === null || object === undefined)) return undefined;
      const key = node.computed
        ? String(run(node.property, scope))
        : (node.property as { name: string }).name;
      return read(object, key);
    }

    case 'Call': {
      const callee = run(node.callee, scope);
      if (typeof callee !== 'function') return undefined;
      const args = node.args.map((arg) => run(arg, scope));
      return (callee as (...values: unknown[]) => unknown)(...args);
    }

    case 'Unary': {
      const value = run(node.argument, scope);
      if (node.operator === '!') return !value;
      if (node.operator === '-') return -Number(value);
      return Number(value);
    }

    case 'Binary': {
      // Short-circuit before evaluating the right side, or `a && a.b` throws
      // on the very shape it exists to guard.
      if (node.operator === '&&') {
        const left = run(node.left, scope);
        return left ? run(node.right, scope) : left;
      }
      if (node.operator === '||') {
        const left = run(node.left, scope);
        return left ? left : run(node.right, scope);
      }
      if (node.operator === '??') {
        const left = run(node.left, scope);
        return left === null || left === undefined ? run(node.right, scope) : left;
      }
      return apply(node.operator, run(node.left, scope), run(node.right, scope));
    }

    case 'Conditional':
      return run(node.test, scope) ? run(node.consequent, scope) : run(node.alternate, scope);

    case 'Array':
      return node.elements.map((element) => run(element, scope));

    case 'Object': {
      const out: Record<string, unknown> = {};
      for (const property of node.properties) out[property.key] = run(property.value, scope);
      return out;
    }

    case 'Template': {
      let out = node.quasis[0] ?? '';
      node.expressions.forEach((expression, index) => {
        out += String(run(expression, scope) ?? '') + (node.quasis[index + 1] ?? '');
      });
      return out;
    }

    default:
      return undefined;
  }
}

function apply(operator: string, left: unknown, right: unknown): unknown {
  switch (operator) {
    case '===': return left === right;
    case '!==': return left !== right;
     
    case '==': return left == right;
     
    case '!=': return left != right;
    case '<': return (left as number) < (right as number);
    case '>': return (left as number) > (right as number);
    case '<=': return (left as number) <= (right as number);
    case '>=': return (left as number) >= (right as number);
    case '+':
      return typeof left === 'string' || typeof right === 'string'
        ? String(left ?? '') + String(right ?? '')
        : Number(left) + Number(right);
    case '-': return Number(left) - Number(right);
    case '*': return Number(left) * Number(right);
    case '/': return Number(left) / Number(right);
    case '%': return Number(left) % Number(right);
    default: return undefined;
  }
}

export function evaluate(node: ExprNode, scope: Scope): EvaluationResult {
  try {
    return { value: run(node, scope) };
  } catch (error) {
    return { value: undefined, error: error instanceof Error ? error.message : 'Evaluation failed.' };
  }
}

/**
 * Every free identifier the expression reads.
 *
 * This is the piece that pays for writing a parser instead of storing a
 * string: re-running a resource when its inputs change, listing which nodes
 * use a variable, and refusing to delete a variable that is still referenced
 * all fall out of one twenty-line walk.
 */
export function dependencies(node: ExprNode): string[] {
  const found = new Set<string>();

  const visit = (current: ExprNode): void => {
    switch (current.type) {
      case 'Identifier':
        if (!(current.name in GLOBALS)) found.add(current.name);
        return;
      case 'Member':
        visit(current.object);
        if (current.computed) visit(current.property);
        return;
      case 'Call':
        visit(current.callee);
        current.args.forEach(visit);
        return;
      case 'Unary':
        visit(current.argument);
        return;
      case 'Binary':
        visit(current.left);
        visit(current.right);
        return;
      case 'Conditional':
        visit(current.test);
        visit(current.consequent);
        visit(current.alternate);
        return;
      case 'Array':
        current.elements.forEach(visit);
        return;
      case 'Object':
        current.properties.forEach((property) => visit(property.value));
        return;
      case 'Template':
        current.expressions.forEach(visit);
        return;
      default:
    }
  };

  visit(node);
  return [...found].sort();
}

const quote = (value: string): string =>
  value.includes("'") ? `"${value.replace(/"/g, '\\"')}"` : `'${value}'`;

/**
 * Prints an AST back to JavaScript source.
 *
 * Code generation goes through here rather than pasting the authored string,
 * so what ships is always something the parser accepted. A document that
 * renders on the canvas cannot emit code that does not compile.
 */
export function print(node: ExprNode): string {
  switch (node.type) {
    case 'Literal':
      if (typeof node.value === 'string') return quote(node.value);
      return String(node.value);
    case 'Identifier':
      return node.name;
    case 'Member':
      return node.computed
        ? `${print(node.object)}[${print(node.property)}]`
        : `${print(node.object)}${node.optional ? '?.' : '.'}${print(node.property)}`;
    case 'Call':
      return `${print(node.callee)}(${node.args.map(print).join(', ')})`;
    case 'Unary':
      return `${node.operator}${print(node.argument)}`;
    case 'Binary':
      return `${print(node.left)} ${node.operator} ${print(node.right)}`;
    case 'Conditional':
      return `${print(node.test)} ? ${print(node.consequent)} : ${print(node.alternate)}`;
    case 'Array':
      return `[${node.elements.map(print).join(', ')}]`;
    case 'Object':
      return `{ ${node.properties.map((p) => `${p.key}: ${print(p.value)}`).join(', ')} }`;
    case 'Template':
      return `\`${node.quasis
        .map((quasi, index) => {
          const expression = node.expressions[index];
          return expression ? `${quasi}\${${print(expression)}}` : quasi;
        })
        .join('')}\``;
    default:
      return 'undefined';
  }
}
