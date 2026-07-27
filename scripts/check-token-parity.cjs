const fs = require('fs');
const path = require('path');

const root = process.cwd();
const themesDir = path.join(root, 'themes');
const themeIndexPath = path.join(themesDir, 'theme.css');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name === 'storybook-static') {
      continue;
    }
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function normalizeTokenName(token) {
  return token.trim();
}

function extractComponentTokens(componentCssFiles) {
  const tokens = new Set();
  const usage = new Map();
  const tokenRefRegex = /var\(\s*(--uc-[a-z0-9-]+)\b/gi;

  for (const file of componentCssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = tokenRefRegex.exec(content)) !== null) {
      const raw = normalizeTokenName(match[1]);
      if (raw.endsWith('-resolved')) {
        continue;
      }
      tokens.add(raw);
      if (!usage.has(raw)) {
        usage.set(raw, new Set());
      }
      usage.get(raw).add(path.relative(root, file).replace(/\\/g, '/'));
    }
  }

  return { tokens, usage };
}

function extractThemeDefinitions(themeFilePath) {
  const themeTokens = new Set();
  const content = fs.readFileSync(themeFilePath, 'utf8');
  const defRegex = /^\s*(--uc-[a-z0-9-]+)\s*:/gim;

  let match;
  while ((match = defRegex.exec(content)) !== null) {
    themeTokens.add(normalizeTokenName(match[1]));
  }

  return themeTokens;
}

function getThemeFiles() {
  if (fs.existsSync(themeIndexPath)) {
    const indexContent = fs.readFileSync(themeIndexPath, 'utf8');
    const importRegex = /@import\s+['"]([^'"]+)['"];?/g;
    const importedThemeFiles = [];

    let match;
    while ((match = importRegex.exec(indexContent)) !== null) {
      const importPath = match[1].trim();
      if (!importPath.endsWith('.css')) {
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

const cssFiles = walk(root).filter((p) => p.endsWith('.css') && p.includes(path.sep + 'uc-'));
const { tokens: usedTokens, usage } = extractComponentTokens(cssFiles);
const themeFiles = getThemeFiles();

if (themeFiles.length === 0) {
  console.error('Token parity check failed. No theme files were found under themes/uc-*.css.');
  process.exit(1);
}

const missingByTheme = new Map();
for (const themeFilePath of themeFiles) {
  const themeTokens = extractThemeDefinitions(themeFilePath);
  const missing = [];

  for (const token of [...usedTokens].sort()) {
    if (!themeTokens.has(token)) {
      missing.push(token);
    }
  }

  missingByTheme.set(themeFilePath, missing);
}

const hasMissingTokens = [...missingByTheme.values()].some((missing) => missing.length > 0);

if (!hasMissingTokens) {
  console.log(`Token parity check passed. Checked ${usedTokens.size} component tokens.`);
  process.exit(0);
}

console.error('Token parity check failed.');

for (const [themeFilePath, missingTokens] of missingByTheme.entries()) {
  if (missingTokens.length === 0) {
    continue;
  }

  const relativeThemePath = path.relative(root, themeFilePath).replace(/\\/g, '/');
  console.error(`Missing in ${relativeThemePath}:`);
  for (const token of missingTokens) {
    const refs = [...(usage.get(token) || [])].join(', ');
    console.error(`  ${token} (used in: ${refs})`);
  }
}

process.exit(1);
