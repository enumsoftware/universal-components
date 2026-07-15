const fs = require('fs');
const path = require('path');

const root = process.cwd();
const componentsRoot = path.join(root, 'uc-');
const lightThemePath = path.join(root, 'themes', 'uc-light.css');
const darkThemePath = path.join(root, 'themes', 'uc-dark.css');

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

const cssFiles = walk(root).filter((p) => p.endsWith('.css') && p.includes(path.sep + 'uc-'));
const { tokens: usedTokens, usage } = extractComponentTokens(cssFiles);
const lightTokens = extractThemeDefinitions(lightThemePath);
const darkTokens = extractThemeDefinitions(darkThemePath);

const missingInLight = [];
const missingInDark = [];

for (const token of [...usedTokens].sort()) {
  if (!lightTokens.has(token)) {
    missingInLight.push(token);
  }
  if (!darkTokens.has(token)) {
    missingInDark.push(token);
  }
}

if (missingInLight.length === 0 && missingInDark.length === 0) {
  console.log(`Token parity check passed. Checked ${usedTokens.size} component tokens.`);
  process.exit(0);
}

console.error('Token parity check failed.');

if (missingInLight.length > 0) {
  console.error('Missing in themes/uc-light.css:');
  for (const token of missingInLight) {
    const refs = [...(usage.get(token) || [])].join(', ');
    console.error(`  ${token} (used in: ${refs})`);
  }
}

if (missingInDark.length > 0) {
  console.error('Missing in themes/uc-dark.css:');
  for (const token of missingInDark) {
    const refs = [...(usage.get(token) || [])].join(', ');
    console.error(`  ${token} (used in: ${refs})`);
  }
}

process.exit(1);
