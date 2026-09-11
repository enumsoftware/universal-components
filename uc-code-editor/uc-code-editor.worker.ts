/// <reference path="./uc-code-editor-monaco-worker.d.ts" />

/**
 * Colocated so `new URL('./uc-code-editor.worker', import.meta.url)` in
 * uc-code-editor-monaco-loader.ts is a genuinely relative path, which is what Angular's
 * esbuild-based builder requires to bundle it as a separate worker chunk -- a bare package
 * specifier there (e.g. `monaco-editor/esm/...`) fails to resolve, because that pattern is
 * matched as a literal path relative to the importing file, not run through node_modules
 * resolution. The bare specifier below is a normal module import, so it resolves through
 * node_modules like any other import in this file.
 */
import 'monaco-editor/editor/editor.worker.js';
