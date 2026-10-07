/*
 * A separate entry point: the editor lazy-loads monaco-editor, and a bundler follows that import for
 * every app that imports the bundle it sits in, building Monaco's chunks and needing a .ttf loader
 * even in apps that never show a code editor.
 */
export { UcCodeEditor, type UcCodeEditorMode, type UcCodeEditorTheme } from './uc-code-editor';
export { ucCodeEditorLanguageLabel } from './uc-code-editor-languages';
export {
  UC_CODE_EDITOR_CONFIG,
  provideUcCodeEditorConfig,
  type UcCodeEditorConfig,
} from './uc-code-editor-config';
