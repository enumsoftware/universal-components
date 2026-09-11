/**
 * Display labels for Monaco language ids. Monaco's own `languages.getLanguages()` only exposes
 * ids and file extensions, not the "human" name shown in the badge, so this is a small curated
 * map covering the languages this component is documented to support; anything else falls back
 * to a capitalized version of the id.
 */
const UC_CODE_EDITOR_LANGUAGE_LABELS: Readonly<Record<string, string>> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  csharp: 'C#',
  cpp: 'C++',
  c: 'C',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  less: 'LESS',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  sql: 'SQL',
  yaml: 'YAML',
  xml: 'XML',
  markdown: 'Markdown',
  shell: 'Shell',
  powershell: 'PowerShell',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  plaintext: 'Plain Text',
};

/** Resolves a Monaco language id to a display label for the language badge. */
export function ucCodeEditorLanguageLabel(language: string): string {
  const known = UC_CODE_EDITOR_LANGUAGE_LABELS[language];
  if (known) {
    return known;
  }

  if (!language) {
    return 'Plain Text';
  }

  return language.charAt(0).toUpperCase() + language.slice(1);
}
