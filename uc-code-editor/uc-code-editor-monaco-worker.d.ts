/**
 * monaco-editor ships this worker entry as a plain `.js` file with no type declarations. Ambient
 * module declaration so the side-effect import in `uc-code-editor.worker.ts` type-checks.
 */
declare module 'monaco-editor/editor/editor.worker.js';
