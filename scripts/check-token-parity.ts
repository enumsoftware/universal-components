/**
 * Fails the build when a component stylesheet reads a --uc-* token that a theme
 * never defines, which would render as an empty value instead of an error.
 *
 * Every themes/uc-*.css file is checked independently: a token defined in the
 * light theme but forgotten in the dark one is still a parity failure.
 *
 * Runs on Node's native type stripping (`node scripts/check-token-parity.ts`),
 * so it must stay erasable syntax. `npm run scripts:typecheck` enforces that.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const themesDir = path.join(root, 'themes');
const themeIndexPath = path.join(themesDir, 'theme.css');

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', 'storybook-static']);

/** Tokens the themes deliberately leave to components to compute. */
const GENERATED_SUFFIX = '-resolved';

interface ComponentTokens {
  readonly tokens: ReadonlySet<string>;
  /** token -> repo-relative files that reference it, for the failure report. */
  readonly usage: ReadonlyMap<string, ReadonlySet<string>>;
}

function toPosixRelative(filePath: string): string {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function walk(dir: string): string[] {
  const out: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(entryPath));
    } else {
      out.push(entryPath);
    }
  }

  return out;
}

function extractComponentTokens(componentCssFiles: readonly string[]): ComponentTokens {
  const tokens = new Set<string>();
  const usage = new Map<string, Set<string>>();
  const tokenRefRegex = /var\(\s*(--uc-[a-z0-9-]+)\b/gi;

  for (const file of componentCssFiles) {
    const content = fs.readFileSync(file, 'utf8');

    let match: RegExpExecArray | null;
    while ((match = tokenRefRegex.exec(content)) !== null) {
      const token = match[1]?.trim();
      if (!token || token.endsWith(GENERATED_SUFFIX)) {
        continue;
      }

      tokens.add(token);

      let files = usage.get(token);
      if (!files) {
        files = new Set<string>();
        usage.set(token, files);
      }
      files.add(toPosixRelative(file));
    }
  }

  return { tokens, usage };
}

function extractThemeDefinitions(themeFilePath: string): Set<string> {
  const themeTokens = new Set<string>();
  const content = fs.readFileSync(themeFilePath, 'utf8');
  const defRegex = /^\s*(--uc-[a-z0-9-]+)\s*:/gim;

  let match: RegExpExecArray | null;
  while ((match = defRegex.exec(content)) !== null) {
    const token = match[1]?.trim();
    if (token) {
      themeTokens.add(token);
    }
  }

  return themeTokens;
}

/**
 * Prefers the themes imported by theme.css so a theme dropped from the barrel
 * stops being checked, and falls back to whatever uc-*.css is on disk.
 */
function getThemeFiles(): string[] {
  if (fs.existsSync(themeIndexPath)) {
    const indexContent = fs.readFileSync(themeIndexPath, 'utf8');
    const importRegex = /@import\s+['"]([^'"]+)['"];?/g;
    const importedThemeFiles: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(indexContent)) !== null) {
      const importPath = match[1]?.trim();
      if (!importPath || !importPath.endsWith('.css')) {
        continue;
      }

      const baseName = path.basename(importPath);
      if (!baseName.startsWith('uc-')) {
        continue;
      }

      importedThemeFiles.push(path.join(themesDir, baseName));
    }

    if (importedThemeFiles.length > 0) {
      return [...new Set(importedThemeFiles)].sort((a, b) => a.localeCompare(b));
    }
  }

  if (!fs.existsSync(themesDir)) {
    return [];
  }

  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith('uc-') && entry.name.endsWith('.css'))
    .map((entry) => path.join(themesDir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

const cssFiles = walk(root).filter((file) => file.endsWith('.css') && file.includes(`${path.sep}uc-`));
const { tokens: usedTokens, usage } = extractComponentTokens(cssFiles);
const themeFiles = getThemeFiles();

if (themeFiles.length === 0) {
  console.error('Token parity check failed. No theme files were found under themes/uc-*.css.');
  process.exit(1);
}

const sortedUsedTokens = [...usedTokens].sort();
const missingByTheme = new Map<string, string[]>();

for (const themeFilePath of themeFiles) {
  const themeTokens = extractThemeDefinitions(themeFilePath);
  missingByTheme.set(
    themeFilePath,
    sortedUsedTokens.filter((token) => !themeTokens.has(token)),
  );
}

const hasMissingTokens = [...missingByTheme.values()].some((missing) => missing.length > 0);

if (!hasMissingTokens) {
  console.log(`Token parity check passed. Checked ${usedTokens.size} component tokens.`);
  process.exit(0);
}

console.error('Token parity check failed.');

for (const [themeFilePath, missingTokens] of missingByTheme) {
  if (missingTokens.length === 0) {
    continue;
  }

  console.error(`Missing in ${toPosixRelative(themeFilePath)}:`);
  for (const token of missingTokens) {
    const refs = [...(usage.get(token) ?? [])].join(', ');
    console.error(`  ${token} (used in: ${refs})`);
  }
}

process.exit(1);
