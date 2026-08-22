/**
 * Generates themes/utilities.css and themes/utilities/*.css.
 *
 * The utility layer is generated instead of hand written so base classes and
 * their responsive variants can never drift apart. Each sheet is defined by a
 * module in scripts/utilities/ - see scripts/utilities/types.ts for the shape.
 * Run `npm run utilities:build` after changing any of them and commit the
 * regenerated stylesheets.
 *
 * Runs on Node's native type stripping (`node scripts/build-utilities.ts`), so
 * it must stay erasable syntax. `npm run scripts:typecheck` enforces that.
 */
import fs from 'node:fs';
import path from 'node:path';

import alignmentSheets from './utilities/alignment.ts';
import compositeSheets from './utilities/composites.ts';
import displaySheets from './utilities/display.ts';
import flexSheets from './utilities/flex.ts';
import gridSheets from './utilities/grid.ts';
import { GRID_MIN, SPACE_SCALE } from './utilities/shared.ts';
import spacingSheets from './utilities/spacing.ts';
import type { Rule, UtilityGroup, UtilitySheet } from './utilities/types.ts';

interface Breakpoint {
  readonly name: string;
  readonly min: string;
  readonly px: number;
}

interface WrittenFile {
  readonly file: string;
  readonly classes: number;
  readonly bytes: number;
}

const root = process.cwd();
const themesDir = path.join(root, 'themes');
const partsDir = path.join(themesDir, 'utilities');
const barrelPath = path.join(themesDir, 'utilities.css');

const BREAKPOINTS: readonly Breakpoint[] = [
  { name: 'sm', min: '40rem', px: 640 },
  { name: 'md', min: '48rem', px: 768 },
  { name: 'lg', min: '64rem', px: 1024 },
  { name: 'xl', min: '80rem', px: 1280 },
];

/** Import order in the barrel, and therefore cascade order. */
const SHEETS: readonly UtilitySheet[] = [
  ...displaySheets,
  ...flexSheets,
  ...gridSheets,
  ...alignmentSheets,
  ...spacingSheets,
  ...compositeSheets,
];

const SCALE_FILE = 'scale.css';
const breakpointSummary = BREAKPOINTS.map((breakpoint) => `${breakpoint.name} (>=${breakpoint.px}px)`).join(', ');

function renderRule(prefix: string, rule: Rule): string {
  const [name, declarations] = rule;
  const body = declarations.map(([property, value]) => `  ${property}: ${value};`).join('\n');
  return `.uc-${prefix}${name} {\n${body}\n}`;
}

function renderGroups(
  groups: readonly UtilityGroup[],
  prefix: string,
  options: { responsiveOnly?: boolean; indent?: string } = {},
): string {
  const indent = options.indent ?? '';
  const blocks: string[] = [];

  for (const group of groups) {
    if (options.responsiveOnly && !group.responsive) {
      continue;
    }

    const rules = group.rules.map((rule) => renderRule(prefix, rule)).join('\n\n');
    blocks.push(`/* ${group.title} */\n${rules}`);
  }

  const css = blocks.join('\n\n');
  if (!indent) {
    return css;
  }

  return css
    .split('\n')
    .map((line) => (line.length > 0 ? indent + line : line))
    .join('\n');
}

function renderHeader(lines: readonly string[]): string {
  return ['/*', ...lines.map((line) => (line ? ` * ${line}` : ' *')), ' */'].join('\n');
}

function renderSheet(sheet: UtilitySheet): string {
  const header = renderHeader([
    `@enumsoftware/universal-components - ${sheet.title.toLowerCase()} utilities`,
    '',
    'GENERATED FILE - do not edit by hand.',
    `Source: scripts/utilities/${sheet.module}.ts`,
    'Regenerate with `npm run utilities:build`.',
    '',
    ...sheet.description,
    ...(sheet.requiresScale ? ['', `Requires ${SCALE_FILE} for the --uc-space-* tokens.`] : []),
  ]);

  const sections = [header, '', renderGroups(sheet.groups, '')];

  if (sheet.groups.some((group) => group.responsive)) {
    for (const breakpoint of BREAKPOINTS) {
      sections.push(
        '',
        `/* ===== ${breakpoint.name}: >=${breakpoint.px}px ===== */`,
        `@media (min-width: ${breakpoint.min}) {`,
        renderGroups(sheet.groups, `${breakpoint.name}-`, { responsiveOnly: true, indent: '  ' }),
        '}',
      );
    }
  }

  return `${sections.join('\n')}\n`;
}

function renderScaleSheet(): string {
  const header = renderHeader([
    '@enumsoftware/universal-components - utility scale tokens',
    '',
    'GENERATED FILE - do not edit by hand.',
    'Source: scripts/utilities/shared.ts',
    'Regenerate with `npm run utilities:build`.',
    '',
    'Redefine any of these after importing the layer to retune every helper that',
    'uses that step at once.',
  ]);

  const body = [
    ':root {',
    ...SPACE_SCALE.map(([key, value]) => `  --uc-space-${key}: ${value};`),
    '',
    '  /* Minimum track size used by .uc-grid-auto-fit and .uc-grid-auto-fill */',
    `  --uc-grid-min: ${GRID_MIN};`,
    '}',
  ].join('\n');

  return `${header}\n\n${body}\n`;
}

function renderBarrel(): string {
  const header = renderHeader([
    '@enumsoftware/universal-components - layout utilities',
    '',
    'GENERATED FILE - do not edit by hand.',
    'Regenerate with `npm run utilities:build`.',
    '',
    'Imports the whole layer. To ship less CSS, import the parts you use from',
    'themes/utilities/ instead - gap, margin and padding also need scale.css, and',
    'flex and grid also need alignment.css.',
    '',
    'Naming: .uc-<utility> applies at every width, .uc-<breakpoint>-<utility>',
    `applies from that breakpoint up. Breakpoints: ${breakpointSummary}.`,
  ]);

  const imports = [SCALE_FILE, ...SHEETS.map((sheet) => sheet.file)]
    .map((file) => `@import 'utilities/${file}';`)
    .join('\n');

  return `${header}\n\n${imports}\n`;
}

fs.mkdirSync(partsDir, { recursive: true });

const written: WrittenFile[] = [];

function write(filePath: string, contents: string): void {
  fs.writeFileSync(filePath, contents, 'utf8');
  written.push({
    file: path.relative(themesDir, filePath).replace(/\\/g, '/'),
    classes: (contents.match(/^\s*\.uc-/gm) ?? []).length,
    bytes: Buffer.byteLength(contents),
  });
}

write(path.join(partsDir, SCALE_FILE), renderScaleSheet());

for (const sheet of SHEETS) {
  write(path.join(partsDir, sheet.file), renderSheet(sheet));
}

write(barrelPath, renderBarrel());

/** Removes part files left behind by a previous run of an older sheet list. */
const expected = new Set([SCALE_FILE, ...SHEETS.map((sheet) => sheet.file)]);
for (const entry of fs.readdirSync(partsDir)) {
  if (entry.endsWith('.css') && !expected.has(entry)) {
    fs.unlinkSync(path.join(partsDir, entry));
    console.log(`Removed stale themes/utilities/${entry}`);
  }
}

/** Warns when a generated sheet is not reachable from a consumer's import. */
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
  exports?: Record<string, unknown>;
};
const packageExports = packageJson.exports ?? {};
const missingExports = written
  .map((item) => `./themes/${item.file}`)
  .filter((subpath) => !Object.prototype.hasOwnProperty.call(packageExports, subpath));

if (missingExports.length > 0) {
  console.warn('\nMissing "exports" entries in package.json - consumers cannot import these:');
  for (const subpath of missingExports) {
    console.warn(`  "${subpath}": "${subpath}",`);
  }
  console.warn('');
}

const totals = written.reduce(
  (accumulator, item) => ({ classes: accumulator.classes + item.classes, bytes: accumulator.bytes + item.bytes }),
  { classes: 0, bytes: 0 },
);

const nameWidth = Math.max(...written.map((item) => item.file.length));
for (const item of written) {
  const size = `${(item.bytes / 1024).toFixed(1)} KB`.padStart(8);
  console.log(`  themes/${item.file.padEnd(nameWidth)}  ${String(item.classes).padStart(5)} classes  ${size}`);
}
console.log(`Wrote ${written.length} files, ${totals.classes} classes, ${(totals.bytes / 1024).toFixed(1)} KB total.`);
