/**
 * Extracts a component's public reactive surface - `input()`, `model()` and
 * `output()` - straight from the source with the TypeScript AST.
 *
 * This is the replacement for Storybook's autodocs argTypes table, and it is
 * read syntactically rather than through a type checker on purpose: the whole
 * library declares its members in one consistent shape, so matching the call
 * expression is both sufficient and an order of magnitude cheaper than
 * building a Program per showcase.
 */
import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

export type ApiKind = 'input' | 'model' | 'output';

export interface ApiMember {
  readonly name: string;
  readonly kind: ApiKind;
  readonly required: boolean;
  /** Declared type argument, or a best guess from the default literal. */
  readonly type: string;
  /** Source text of the default, or null for required members and outputs. */
  readonly defaultValue: string | null;
  /** Template-facing name when the member declares an `alias`. */
  readonly alias: string | null;
  readonly description: string;
}

const FACTORIES = new Set<ApiKind>(['input', 'model', 'output']);

/**
 * Follows `component: X` back to the file X was imported from.
 * Returns null when the showcase declares no component, or when the import is
 * not a relative path we can resolve on disk.
 */
export function resolveComponentSource(showcaseFile: string, componentName: string): string | null {
  const source = parse(showcaseFile);
  let specifier: string | null = null;

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteralLike(statement.moduleSpecifier)) {
      continue;
    }

    const bindings = statement.importClause?.namedBindings;

    if (bindings === undefined || !ts.isNamedImports(bindings)) {
      continue;
    }

    for (const element of bindings.elements) {
      if (element.name.text === componentName) {
        specifier = statement.moduleSpecifier.text;
      }
    }
  }

  if (specifier === null || !specifier.startsWith('.')) {
    return null;
  }

  const resolved = path.resolve(path.dirname(showcaseFile), `${specifier}.ts`);

  return fs.existsSync(resolved) ? resolved : null;
}

export function extractApi(componentFile: string, componentName: string): ApiMember[] {
  const source = parse(componentFile);
  const members: ApiMember[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isClassDeclaration(node) && node.name?.text === componentName) {
      for (const member of node.members) {
        const extracted = readMember(member, source);

        if (extracted !== null) {
          members.push(extracted);
        }
      }

      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(source);

  return members;
}

function readMember(member: ts.ClassElement, source: ts.SourceFile): ApiMember | null {
  if (!ts.isPropertyDeclaration(member) || member.initializer === undefined || !ts.isIdentifier(member.name)) {
    return null;
  }

  const call = member.initializer;

  if (!ts.isCallExpression(call)) {
    return null;
  }

  const { kind, required } = readFactory(call.expression);

  if (kind === null) {
    return null;
  }

  const typeArgument = call.typeArguments?.[0];
  const firstArgument = call.arguments[0];
  // `input.required()` and `output()` never carry a default; for a plain
  // `input()` the first argument is it.
  const hasDefault = !required && kind !== 'output' && firstArgument !== undefined;

  return {
    name: member.name.text,
    kind,
    required,
    type: typeArgument !== undefined ? typeArgument.getText(source) : inferType(firstArgument, kind),
    defaultValue: hasDefault ? firstArgument.getText(source) : null,
    alias: readAlias(call, required, kind),
    description: readDescription(member, source),
  };
}

function readFactory(expression: ts.Expression): { kind: ApiKind | null; required: boolean } {
  if (ts.isIdentifier(expression) && FACTORIES.has(expression.text as ApiKind)) {
    return { kind: expression.text as ApiKind, required: false };
  }

  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    FACTORIES.has(expression.expression.text as ApiKind) &&
    expression.name.text === 'required'
  ) {
    return { kind: expression.expression.text as ApiKind, required: true };
  }

  return { kind: null, required: false };
}

/** The options object is the first argument when required, the second otherwise. */
function readAlias(call: ts.CallExpression, required: boolean, kind: ApiKind): string | null {
  const options = call.arguments[required || kind === 'output' ? 0 : 1];

  if (options === undefined || !ts.isObjectLiteralExpression(options)) {
    return null;
  }

  for (const property of options.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      ts.isIdentifier(property.name) &&
      property.name.text === 'alias' &&
      ts.isStringLiteralLike(property.initializer)
    ) {
      return property.initializer.text;
    }
  }

  return null;
}

/** Without an explicit type argument, a literal default is the best signal we have. */
function inferType(argument: ts.Expression | undefined, kind: ApiKind): string {
  // An `output()` with no type argument really does carry no payload, but a
  // required input or model with none is merely untyped - `model.required()`
  // infers `unknown`, not `void`.
  if (kind === 'output') {
    return 'void';
  }

  if (argument === undefined) {
    return 'unknown';
  }

  if (argument.kind === ts.SyntaxKind.TrueKeyword || argument.kind === ts.SyntaxKind.FalseKeyword) {
    return 'boolean';
  }

  if (ts.isNumericLiteral(argument)) {
    return 'number';
  }

  if (ts.isStringLiteralLike(argument)) {
    return 'string';
  }

  if (ts.isArrayLiteralExpression(argument)) {
    return 'unknown[]';
  }

  return 'unknown';
}

function readDescription(member: ts.ClassElement, source: ts.SourceFile): string {
  const sourceText = source.getFullText();
  const ranges = ts.getLeadingCommentRanges(sourceText, member.getFullStart()) ?? [];
  const doc = ranges
    .map((range) => sourceText.slice(range.pos, range.end))
    .filter((comment) => comment.startsWith('/**'))
    .at(-1);

  if (doc === undefined) {
    return '';
  }

  return doc
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ExampleSource {
  readonly name: string;
  readonly language: string;
  readonly code: string;
}

/**
 * Follows `@Component({ selector: '...' })` on the named class. Used to
 * rebuild the tag a preset example would render, since the showcase itself
 * never spells the selector out.
 */
export function resolveSelector(componentFile: string, componentName: string): string | null {
  const source = parse(componentFile);
  let selector: string | null = null;

  const visit = (node: ts.Node): void => {
    if (selector !== null) {
      return;
    }

    if (ts.isClassDeclaration(node) && node.name?.text === componentName) {
      for (const decorator of ts.getDecorators(node) ?? []) {
        if (!ts.isCallExpression(decorator.expression) || !ts.isIdentifier(decorator.expression.expression)) {
          continue;
        }

        if (decorator.expression.expression.text !== 'Component') {
          continue;
        }

        const options = decorator.expression.arguments[0];

        if (options === undefined || !ts.isObjectLiteralExpression(options)) {
          continue;
        }

        for (const property of options.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            ts.isIdentifier(property.name) &&
            property.name.text === 'selector' &&
            ts.isStringLiteralLike(property.initializer)
          ) {
            selector = property.initializer.text;
          }
        }
      }

      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(source);

  return selector;
}

/** A bare identifier is only worth inlining when it names a top-level `const` in the same file. */
function resolveTopLevelConst(source: ts.SourceFile, name: string): ts.Expression | null {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer !== undefined) {
        return declaration.initializer;
      }
    }
  }

  return null;
}

function attributeExpressionText(initializer: ts.Expression, source: ts.SourceFile): string {
  const expression = ts.isIdentifier(initializer) ? (resolveTopLevelConst(source, initializer.text) ?? initializer) : initializer;

  // Normalises CRLF source to LF so a checked-out-on-Windows constant does not
  // produce a snippet with mixed line endings.
  return expression.getText(source).replace(/\r\n/g, '\n');
}

/** Rebuilds the tag a preset example renders from exactly what it overrides - not the merged knob defaults the runtime fills in underneath it. */
function renderPresetSnippet(selector: string, props: ts.ObjectLiteralExpression, source: ts.SourceFile): string {
  const attributes: string[] = [];

  for (const property of props.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
      continue;
    }

    const name = property.name.text;

    if (ts.isStringLiteralLike(property.initializer)) {
      attributes.push(`  ${name}="${property.initializer.text.replace(/"/g, '&quot;')}"`);
      continue;
    }

    attributes.push(`  [${name}]="${attributeExpressionText(property.initializer, source)}"`);
  }

  if (attributes.length === 0) {
    return `<${selector}></${selector}>`;
  }

  return `<${selector}\n${attributes.join('\n')}\n></${selector}>`;
}

/**
 * Reconstructs the Examples tab's "view code" panel for one showcase: the full
 * source of a component-backed example, or a generated markup snippet for a
 * props-only preset. Best-effort - an example this cannot make sense of is
 * simply left out, rather than failing the whole registry build.
 */
export function extractExamples(
  showcaseFile: string,
  componentFile: string | null,
  componentName: string | null,
): ExampleSource[] {
  const source = parse(showcaseFile);
  const selector = componentFile !== null && componentName !== null ? resolveSelector(componentFile, componentName) : null;

  let examplesNode: ts.ArrayLiteralExpression | undefined;

  const visit = (node: ts.Node): void => {
    if (
      examplesNode === undefined &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineShowcase' &&
      node.arguments.length > 0 &&
      node.arguments[0] !== undefined &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      for (const property of node.arguments[0].properties) {
        if (
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          property.name.text === 'examples' &&
          ts.isArrayLiteralExpression(property.initializer)
        ) {
          examplesNode = property.initializer;
        }
      }

      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(source);

  if (examplesNode === undefined) {
    return [];
  }

  const results: ExampleSource[] = [];

  for (const element of examplesNode.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue;
    }

    let name: string | null = null;
    let componentIdentifier: string | null = null;
    let propsLiteral: ts.ObjectLiteralExpression | null = null;

    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
        continue;
      }

      if (property.name.text === 'name' && ts.isStringLiteralLike(property.initializer)) {
        name = property.initializer.text;
      }

      if (property.name.text === 'component' && ts.isIdentifier(property.initializer)) {
        componentIdentifier = property.initializer.text;
      }

      if (property.name.text === 'props' && ts.isObjectLiteralExpression(property.initializer)) {
        propsLiteral = property.initializer;
      }
    }

    if (name === null) {
      continue;
    }

    if (componentIdentifier !== null) {
      const exampleFile = resolveComponentSource(showcaseFile, componentIdentifier);

      if (exampleFile !== null) {
        results.push({ name, language: 'typescript', code: fs.readFileSync(exampleFile, 'utf8') });
      }

      continue;
    }

    if (selector !== null) {
      results.push({
        name,
        language: 'html',
        code: propsLiteral !== null ? renderPresetSnippet(selector, propsLiteral, source) : `<${selector}></${selector}>`,
      });
    }
  }

  return results;
}

const cache = new Map<string, ts.SourceFile>();

function parse(file: string): ts.SourceFile {
  const cached = cache.get(file);

  if (cached !== undefined) {
    return cached;
  }

  const parsed = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);

  cache.set(file, parsed);

  return parsed;
}
