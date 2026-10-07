/**
 * Bundles Monaco's editor worker into one self-contained file that ships with the package, at
 * dist/uc-code-editor/editor.worker.js. Apps copy it into their build output with an `assets` entry
 * and uc-code-editor loads it from a URL (UC_CODE_EDITOR_CONFIG.workerUrl).
 *
 * The worker used to be bundled by the app's own build from `new Worker(new URL(...))` in the
 * library, but an app's Angular build does not do that for code inside node_modules: the URL was left
 * as is, pointed at a file that does not exist, and Monaco fell back to running on the main thread.
 *
 * Usage: node scripts/build-code-editor-worker.ts [outfile]
 * The workbench passes its own outfile, since it builds the library from source.
 *
 * Runs on Node's native type stripping, so it must stay erasable syntax. `npm run scripts:typecheck`
 * enforces that.
 */
import path from 'node:path';

import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
const outfile = path.resolve(root, process.argv[2] ?? 'dist/uc-code-editor/editor.worker.js');

await build({
  // The worker entry is imported from a stub so it resolves through node_modules like any import.
  stdin: {
    contents: "import 'monaco-editor/editor/editor.worker.js';",
    resolveDir: root,
    loader: 'js',
  },
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  outfile,
  logLevel: 'warning',
});

console.log(`code editor worker: ${path.relative(root, outfile)}`);
