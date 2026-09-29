import type * as Monaco from 'monaco-editor';

let monacoPromise: Promise<typeof Monaco> | null = null;

/**
 * Loads monaco-editor lazily and once per page. Importing its ESM bundle eagerly would tax every
 * consumer of this library even when no uc-code-editor is ever rendered, so the import only
 * happens the first time a uc-code-editor instance actually initializes.
 *
 * `workerUrl` is where the app serves the prebuilt editor worker (see UC_CODE_EDITOR_CONFIG). Only
 * the first call's URL is used, since Monaco is set up once per page.
 */
export function loadMonaco(workerUrl: string): Promise<typeof Monaco> {
  if (!monacoPromise) {
    monacoPromise = importMonaco(workerUrl);
  }

  return monacoPromise;
}

async function importMonaco(workerUrl: string): Promise<typeof Monaco> {
  const ownWorker = configureMonacoEnvironment(workerUrl);
  const monaco = await import('monaco-editor');
  if (ownWorker) {
    keepLanguageServicesOffTheWorker(monaco);
  }

  return monaco;
}

/**
 * Monaco's JSON, CSS, HTML and TypeScript language services (validation, symbols, colours, smart
 * folding, completion) run in dedicated per-language workers. uc-code-editor ships only the generic
 * editor worker, which cannot answer them, so every such request failed with "Missing requestHandler".
 * Their features are switched off; highlighting stays, as JSON's tokenizer runs on the page rather
 * than in a worker, and folding falls back to indentation.
 */
function keepLanguageServicesOffTheWorker(monaco: typeof Monaco): void {
  const services = [
    monaco.json.jsonDefaults,
    monaco.css.cssDefaults,
    monaco.css.scssDefaults,
    monaco.css.lessDefaults,
    monaco.html.htmlDefaults,
    monaco.html.handlebarDefaults,
    monaco.html.razorDefaults,
    monaco.typescript.typescriptDefaults,
    monaco.typescript.javascriptDefaults,
  ];

  for (const service of services) {
    const features = Object.keys(service.modeConfiguration);
    service.setModeConfiguration(Object.fromEntries(features.map((feature) => [feature, feature === 'tokens'])));
  }
}

/** Returns whether uc-code-editor set up the worker, rather than the app. */
function configureMonacoEnvironment(workerUrl: string): boolean {
  const globalScope = self as typeof self & { MonacoEnvironment?: Monaco.Environment };

  // An app that sets up Monaco's workers itself, such as with every per-language worker, keeps its
  // own setup and the full language services.
  if (globalScope.MonacoEnvironment) {
    return false;
  }

  globalScope.MonacoEnvironment = {
    /**
     * A single generic editor worker services every language. Monaco's dedicated per-language
     * workers (ts, json, css, html) add live diagnostics/IntelliSense, but each would be another
     * file for every app to serve. The generic worker still gives bracket matching, folding, and
     * full Monarch-grammar syntax highlighting for every language Monaco knows.
     *
     * The worker is a prebuilt, self-contained file shipped with the package
     * (scripts/build-code-editor-worker.ts) that the app copies into its build output. An app's
     * build does not bundle `new Worker(new URL(...))` found inside node_modules, so a worker
     * referenced relative to this module would not exist once the library is installed.
     */
    getWorker(): Worker {
      return new Worker(new URL(workerUrl, document.baseURI), { type: 'module' });
    },
  };
  return true;
}
