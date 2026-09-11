import type * as Monaco from 'monaco-editor';

let monacoPromise: Promise<typeof Monaco> | null = null;

/**
 * Loads monaco-editor lazily and once per page. Importing its ESM bundle eagerly would tax every
 * consumer of this library even when no uc-code-editor is ever rendered, so the import only
 * happens the first time a uc-code-editor instance actually initializes.
 */
export function loadMonaco(): Promise<typeof Monaco> {
  if (!monacoPromise) {
    monacoPromise = importMonaco();
  }

  return monacoPromise;
}

async function importMonaco(): Promise<typeof Monaco> {
  configureMonacoEnvironment();
  return import('monaco-editor');
}

function configureMonacoEnvironment(): void {
  const globalScope = self as typeof self & { MonacoEnvironment?: Monaco.Environment };

  if (globalScope.MonacoEnvironment) {
    return;
  }

  globalScope.MonacoEnvironment = {
    /**
     * A single generic editor worker services every language. Monaco's dedicated per-language
     * workers (ts, json, css, html) add live diagnostics/IntelliSense, but wiring each one up
     * individually would multiply the worker bundles this library ships and the bundler
     * configuration every consumer needs to support. The generic worker still gives bracket
     * matching, folding, and full Monarch-grammar syntax highlighting for every language Monaco
     * knows, which is what this component is documented to provide.
     *
     * The referenced path must be a real relative file (not a bare `monaco-editor/...` specifier):
     * Angular's esbuild builder treats the argument to `new URL(_, import.meta.url)` as a literal
     * path relative to this file rather than something to resolve through node_modules, so the
     * actual `monaco-editor` import is delegated to the colocated uc-code-editor.worker.ts, which
     * resolves it normally because it's a plain module import there.
     */
    getWorker(): Worker {
      return new Worker(new URL('./uc-code-editor.worker', import.meta.url), {
        type: 'module',
      });
    },
  };
}
