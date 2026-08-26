/**
 * Generates workbench/generated/registry.ts.
 *
 * The Angular CLI builds with esbuild, which has no `import.meta.glob`, so the
 * set of showcases has to exist as static source. Each entry keeps its
 * `id`/`group`/`title` inline and its module behind a dynamic `import()`, so
 * the sidebar renders the whole tree from one small module while every
 * showcase - and the library code it pulls in - stays a lazy chunk.
 *
 * Runs on Node's native type stripping (`node scripts/build-showcase-registry.ts`),
 * so it must stay erasable syntax. `npm run scripts:typecheck` enforces that.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import ts from 'typescript';

import { extractApi, resolveComponentSource } from './showcase/api.ts';
import { renderMarkdown } from './showcase/markdown.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const GENERATED_DIR = path.join(REPO_ROOT, 'workbench', 'generated');
const OUTPUT_FILE = path.join(GENERATED_DIR, 'registry.ts');
const DOCS_DIR = path.join(GENERATED_DIR, 'docs');
const SHOWCASE_SUFFIX = '.showcase.ts';
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'dist-workbench', '.git', '.angular', 'storybook-static']);

interface ShowcaseMeta {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly order: number;
  /** Module specifier, relative to the generated file, without extension. */
  readonly importPath: string;
  /** Repo-relative source path, for error messages. */
  readonly sourcePath: string;
  /** Absolute path of the showcase file, for resolving its component. */
  readonly absolutePath: string;
  /** Identifier passed to `component:`, or null for a docs-only showcase. */
  readonly componentName: string | null;
  /** Raw markdown from the sibling <name>.docs.md, or empty. */
  readonly docs: string;
  /** File-safe form of `id`, used for the generated docs module. */
  readonly slug: string;
}

function findShowcaseFiles(directory: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) {
        findShowcaseFiles(absolute, found);
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(SHOWCASE_SUFFIX)) {
      found.push(absolute);
    }
  }

  return found;
}

/** Pulls the literal `id`/`group`/`title`/`order` out of `defineShowcase({ ... })`. */
function readShowcaseMeta(absolutePath: string): ShowcaseMeta {
  const sourcePath = path.relative(REPO_ROOT, absolutePath).split(path.sep).join('/');
  const source = ts.createSourceFile(absolutePath, fs.readFileSync(absolutePath, 'utf8'), ts.ScriptTarget.Latest, true);

  let literal: ts.ObjectLiteralExpression | undefined;

  const visit = (node: ts.Node): void => {
    if (
      literal === undefined &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineShowcase' &&
      node.arguments.length > 0 &&
      node.arguments[0] !== undefined &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      literal = node.arguments[0];
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(source);

  if (literal === undefined) {
    throw new Error(`${sourcePath}: no defineShowcase({ ... }) call found.`);
  }

  // Bound to a const so the narrowing survives the closures below.
  const properties = literal.properties;

  const readProperty = (name: string): ts.Expression | undefined => {
    for (const property of properties) {
      if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && property.name.text === name) {
        return property.initializer;
      }
    }

    return undefined;
  };

  const readString = (name: string): string => {
    const value = readProperty(name);

    if (value === undefined || !ts.isStringLiteralLike(value)) {
      throw new Error(`${sourcePath}: defineShowcase needs a literal string "${name}".`);
    }

    return value.text;
  };

  const orderNode = readProperty('order');
  const order = orderNode !== undefined && ts.isNumericLiteral(orderNode) ? Number(orderNode.text) : 0;

  const componentNode = readProperty('component');
  const componentName = componentNode !== undefined && ts.isIdentifier(componentNode) ? componentNode.text : null;

  // Prose lives in a sibling <name>.docs.md rather than inline in the showcase.
  // Markdown is backtick-heavy - inline code and fenced blocks - which cannot
  // survive inside a template literal without escaping every one of them.
  const docsFile = absolutePath.replace(/.showcase.ts$/, '.docs.md');
  const docs = fs.existsSync(docsFile) ? fs.readFileSync(docsFile, 'utf8') : '';

  const importPath = path
    .relative(path.dirname(OUTPUT_FILE), absolutePath)
    .split(path.sep)
    .join('/')
    .replace(/\.ts$/, '');

  const id = readString('id');

  return {
    id,
    group: readString('group'),
    title: readString('title'),
    order,
    importPath: importPath.startsWith('.') ? importPath : `./${importPath}`,
    sourcePath,
    absolutePath,
    componentName,
    docs,
    slug: id.replace(/[^a-zA-Z0-9]+/g, '-'),
  };
}

function assertUniqueIds(entries: readonly ShowcaseMeta[]): void {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const previous = seen.get(entry.id);

    if (previous !== undefined) {
      throw new Error(`Duplicate showcase id "${entry.id}" in ${previous} and ${entry.sourcePath}.`);
    }

    seen.set(entry.id, entry.sourcePath);
  }
}

function renderRegistry(entries: readonly ShowcaseMeta[]): string {
  const rows = entries.map(
    (entry) => `  {
    id: ${JSON.stringify(entry.id)},
    group: ${JSON.stringify(entry.group)},
    title: ${JSON.stringify(entry.title)},
    order: ${entry.order},
    load: () => import(${JSON.stringify(entry.importPath)}),
    loadDocs: () => import(${JSON.stringify(`./docs/${entry.slug}`)}),
  },`,
  );

  return `// Generated by scripts/build-showcase-registry.ts - do not edit.
// Run \`npm run workbench:registry\` to regenerate.
import type { RegistryEntry } from '../core/registry';

export const SHOWCASE_REGISTRY: readonly RegistryEntry[] = [
${rows.join('\n')}
];
`;
}

/**
 * One module per showcase rather than a single docs bundle: opening the Docs
 * tab for one component should not download the prose and API table for the
 * other thirty-five.
 */
function writeDocs(entry: ShowcaseMeta): void {
  const html = renderMarkdown(entry.docs);
  const componentFile =
    entry.componentName === null ? null : resolveComponentSource(entry.absolutePath, entry.componentName);
  const api =
    componentFile === null || entry.componentName === null ? [] : extractApi(componentFile, entry.componentName);

  const contents = `// Generated by scripts/build-showcase-registry.ts - do not edit.
import type { ApiMember } from '../../core/api';

export const html = ${JSON.stringify(html)};

export const api: readonly ApiMember[] = ${JSON.stringify(api, null, 2)};
`;

  fs.writeFileSync(path.join(DOCS_DIR, `${entry.slug}.ts`), contents, 'utf8');
}

function build(): number {
  const entries = findShowcaseFiles(REPO_ROOT)
    .map(readShowcaseMeta)
    .sort((left, right) => {
      if (left.group !== right.group) {
        return left.group.localeCompare(right.group);
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.title.localeCompare(right.title, undefined, {
        numeric: true,
      });
    });

  assertUniqueIds(entries);
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.rmSync(DOCS_DIR, { recursive: true, force: true });
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  for (const entry of entries) {
    writeDocs(entry);
  }

  fs.writeFileSync(OUTPUT_FILE, renderRegistry(entries), 'utf8');

  return entries.length;
}

const count = build();
console.log(`workbench: registered ${count} showcase${count === 1 ? '' : 's'}.`);

if (process.argv.includes('--watch')) {
  let queued: NodeJS.Timeout | undefined;

  fs.watch(REPO_ROOT, { recursive: true }, (_event, filename) => {
    if (filename === null || !filename.endsWith(SHOWCASE_SUFFIX)) {
      return;
    }

    clearTimeout(queued);
    queued = setTimeout(() => {
      try {
        const rebuilt = build();
        console.log(`workbench: registry rebuilt (${rebuilt}).`);
      } catch (error) {
        console.error(`workbench: registry rebuild failed - ${(error as Error).message}`);
      }
    }, 50);
  });

  console.log('workbench: watching for *.showcase.ts changes.');
}
