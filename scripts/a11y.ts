/**
 * Runs axe over every showcase in the built workbench and compares the result
 * to a recorded baseline.
 *
 * Two surfaces per showcase - the Playground canvas at its knob defaults, and
 * every canvas on the Examples tab at once - in both preview themes, because
 * colour contrast is a property of the theme rather than of the component.
 *
 * The gate is a baseline diff rather than "zero violations". The library has
 * real accessibility debt today (see the workbench README), and a check that is
 * red from the first commit gets ignored within a week. A baseline makes the
 * debt explicit and reviewable in one file, and still fails the build the
 * moment a component gets worse. Fixing something also fails, with a one-line
 * instruction to record it - so the file cannot quietly drift out of date.
 *
 * Usage:
 *   node scripts/a11y.ts                  check against the baseline
 *   node scripts/a11y.ts --update         rewrite the baseline from this run
 *   node scripts/a11y.ts --details        also print every offending element
 *   node scripts/a11y.ts --filter button  only ids containing "button"
 *
 * Expects `npm run workbench:build` to have run first.
 *
 * Runs on Node's native type stripping, so it must stay erasable syntax.
 * `npm run scripts:typecheck` enforces that.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import type { AddressInfo } from 'node:net';
import type { Browser, Page } from 'playwright';
import { chromium } from 'playwright';

import { A11Y_CANVAS_SELECTOR, A11Y_RUN_OPTIONS, a11ySurfaceSelector, toReport } from '../workbench/core/a11y.ts';
import type { A11ySurface, A11yIssue, AxeResultLike } from '../workbench/core/a11y.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const DIST_DIR = path.join(REPO_ROOT, 'dist-workbench', 'browser');
const MANIFEST_FILE = path.join(REPO_ROOT, 'workbench', 'generated', 'showcases.json');
const BASELINE_FILE = path.join(REPO_ROOT, 'scripts', 'a11y-baseline.json');
const AXE_FILE = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'));

/** Both preview themes. Contrast failures live in exactly one of them more often than not. */
const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

/** d3 charts animate in; nothing in the library takes longer than this to settle. */
const SETTLE_MS = 250;

/** Bumped per visit to keep every navigation a genuine document load. */
let loads = 0;

interface ShowcaseRow {
  readonly id: string;
  readonly group: string;
  readonly title: string;
}

/** `<surface>.<theme>` -> rule id -> failing element count. */
type SurfaceCounts = Record<string, Record<string, number>>;
/** Showcase id -> its surfaces. Showcases with nothing to report are absent. */
type Baseline = Record<string, SurfaceCounts>;

interface Finding {
  readonly id: string;
  readonly surface: string;
  readonly issue: A11yIssue;
}

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Serves the built app.
 *
 * The workbench uses hash routing, so every request is for a real file that
 * exists - no SPA rewrite, and anything missing is a genuine 404 worth seeing.
 */
function startServer(): Promise<{ readonly origin: string; close: () => Promise<void> }> {
  const server = http.createServer((request, response) => {
    const requested = decodeURIComponent((request.url ?? '/').split('?')[0] ?? '/');
    const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const file = path.join(DIST_DIR, relative);

    // Nothing here is attacker-controlled, but a traversal would silently read
    // outside the build output and report nonsense.
    if (!file.startsWith(DIST_DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': MIME_TYPES[path.extname(file)] ?? 'application/octet-stream' });
    response.end(fs.readFileSync(file));
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;

      resolve({
        origin: `http://127.0.0.1:${port}`,
        close: () => new Promise<void>((done) => server.close(() => done())),
      });
    });
  });
}

/** Runs axe against every canvas belonging to one surface. */
async function runAxe(page: Page, surface: A11ySurface): Promise<readonly A11yIssue[]> {
  const selector = a11ySurfaceSelector(surface);

  if ((await page.locator(selector).count()) === 0) {
    return [];
  }

  await page.waitForTimeout(SETTLE_MS);

  const raw = await page.evaluate(
    async ([target, options]) => {
      const axe = (globalThis as unknown as { axe: { run(context: unknown, options: unknown): Promise<unknown> } }).axe;

      return (await axe.run({ include: [[target]] }, options)) as unknown;
    },
    [selector, A11Y_RUN_OPTIONS] as const,
  );

  return toReport(raw as AxeResultLike).violations;
}

async function sweepShowcase(page: Page, origin: string, row: ShowcaseRow, theme: Theme): Promise<Finding[]> {
  const findings: Finding[] = [];

  // The counter is what forces a real navigation: two URLs differing only in
  // the hash are the same document, so the page would never reload and axe
  // could run against the previous showcase while this one's chunk is still in
  // flight. Changing the search string makes every visit a fresh document.
  loads += 1;
  await page.goto(`${origin}/?visit=${loads}#/${row.id}?theme=${theme}`, { waitUntil: 'load' });
  await page.getByRole('heading', { level: 1, name: row.title, exact: true }).waitFor();

  // Either a canvas or the "nothing to render" message means the tab has
  // finished deciding. Measuring before that would report a clean surface for a
  // component that simply had not appeared yet - the one way this check could
  // lie and still go green.
  await page.locator(`${A11Y_CANVAS_SELECTOR}, .wb-empty`).first().waitFor();

  for (const issue of await runAxe(page, 'playground')) {
    findings.push({ id: row.id, surface: `playground.${theme}`, issue });
  }

  const examples = page.getByRole('button', { name: 'Examples', exact: true });

  if ((await examples.count()) > 0) {
    await examples.click();
    // The playground canvas has to be gone before the examples are the thing on
    // screen; `data-surface` then keeps the two apart for good.
    await page.locator(a11ySurfaceSelector('playground')).waitFor({ state: 'detached' });

    for (const issue of await runAxe(page, 'examples')) {
      findings.push({ id: row.id, surface: `examples.${theme}`, issue });
    }
  }

  return findings;
}

function toBaseline(findings: readonly Finding[]): Baseline {
  const baseline: Baseline = {};

  for (const { id, surface, issue } of findings) {
    const surfaces = (baseline[id] ??= {});
    const rules = (surfaces[surface] ??= {});

    rules[issue.rule] = (rules[issue.rule] ?? 0) + issue.nodes.length;
  }

  return sortBaseline(baseline);
}

/** Keys in a stable order, so the committed file diffs on content and never on iteration order. */
function sortBaseline(baseline: Baseline): Baseline {
  const sorted: Baseline = {};

  for (const id of Object.keys(baseline).sort()) {
    const surfaces = baseline[id] ?? {};
    const nextSurfaces: SurfaceCounts = {};

    for (const surface of Object.keys(surfaces).sort()) {
      const rules = surfaces[surface] ?? {};
      const nextRules: Record<string, number> = {};

      for (const rule of Object.keys(rules).sort()) {
        nextRules[rule] = rules[rule] ?? 0;
      }

      nextSurfaces[surface] = nextRules;
    }

    sorted[id] = nextSurfaces;
  }

  return sorted;
}

function readBaseline(): Baseline {
  if (!fs.existsSync(BASELINE_FILE)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')) as Baseline;
}

interface Difference {
  readonly key: string;
  readonly was: number;
  readonly now: number;
}

function diff(baseline: Baseline, actual: Baseline): Difference[] {
  const flatten = (source: Baseline): Map<string, number> => {
    const flat = new Map<string, number>();

    for (const [id, surfaces] of Object.entries(source)) {
      for (const [surface, rules] of Object.entries(surfaces)) {
        for (const [rule, count] of Object.entries(rules)) {
          flat.set(`${id}  ${surface}  ${rule}`, count);
        }
      }
    }

    return flat;
  };

  const before = flatten(baseline);
  const after = flatten(actual);
  const differences: Difference[] = [];

  for (const key of new Set([...before.keys(), ...after.keys()])) {
    const was = before.get(key) ?? 0;
    const now = after.get(key) ?? 0;

    if (was !== now) {
      differences.push({ key, was, now });
    }
  }

  return differences.sort((left, right) => left.key.localeCompare(right.key));
}

/** Worst rules first, so the summary opens on what is actually worth fixing. */
function summarise(findings: readonly Finding[]): string[] {
  const byRule = new Map<string, { nodes: number; showcases: Set<string>; help: string }>();

  for (const { id, issue } of findings) {
    const entry = byRule.get(issue.rule) ?? { nodes: 0, showcases: new Set<string>(), help: issue.help };

    entry.nodes += issue.nodes.length;
    entry.showcases.add(id);
    byRule.set(issue.rule, entry);
  }

  return [...byRule.entries()]
    .sort((left, right) => right[1].nodes - left[1].nodes)
    .map(
      ([rule, entry]) =>
        `  ${rule.padEnd(32)} ${String(entry.nodes).padStart(4)} elements  ${entry.showcases.size} showcases`,
    );
}

/** Every offending element, for whoever is actually fixing one of these. */
function details(findings: readonly Finding[]): string[] {
  const lines: string[] = [];

  for (const { id, surface, issue } of findings) {
    lines.push(`\n${issue.rule}  ${id}  ${surface}`, `  ${issue.help}`);

    for (const node of issue.nodes) {
      lines.push(`    ${node.target}`, `      ${node.html.replace(/\s+/g, ' ').slice(0, 160)}`);
    }
  }

  return lines;
}

async function main(): Promise<number> {
  const update = process.argv.includes('--update');
  const filterIndex = process.argv.indexOf('--filter');
  const filter = filterIndex === -1 ? null : (process.argv[filterIndex + 1] ?? null);

  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error(`a11y: ${path.relative(REPO_ROOT, DIST_DIR)} is empty. Run \`npm run workbench:build\` first.`);
    return 1;
  }

  const rows = (JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as ShowcaseRow[]).filter(
    (row) => filter === null || row.id.includes(filter),
  );

  if (rows.length === 0) {
    console.error('a11y: no showcases matched.');
    return 1;
  }

  const server = await startServer();
  let browser: Browser | undefined;
  const findings: Finding[] = [];

  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });

    // Before every document, so axe is present no matter how the page got here.
    await page.addInitScript({ path: AXE_FILE });

    let done = 0;

    for (const row of rows) {
      for (const theme of THEMES) {
        findings.push(...(await sweepShowcase(page, server.origin, row, theme)));
      }

      done += 1;
      process.stdout.write(`\ra11y: ${done}/${rows.length} showcases`);
    }

    process.stdout.write('\n');
  } finally {
    await browser?.close();
    await server.close();
  }

  const actual = toBaseline(findings);
  const total = findings.reduce((count, finding) => count + finding.issue.nodes.length, 0);

  console.log(`\na11y: ${total} failing elements across ${Object.keys(actual).length} showcases.`);

  if (total > 0) {
    console.log(summarise(findings).join('\n'));
  }

  if (total > 0 && process.argv.includes('--details')) {
    console.log(details(findings).join('\n'));
  }

  if (update) {
    fs.writeFileSync(BASELINE_FILE, `${JSON.stringify(actual, null, 2)}\n`, 'utf8');
    console.log(`\na11y: baseline written to ${path.relative(REPO_ROOT, BASELINE_FILE)}.`);
    return 0;
  }

  // A partial run cannot tell a missing showcase from a fixed one.
  if (filter !== null) {
    console.log('\na11y: --filter set, so the baseline was not compared.');
    return 0;
  }

  const differences = diff(readBaseline(), actual);

  if (differences.length === 0) {
    console.log('\na11y: matches the baseline.');
    return 0;
  }

  console.error(`\na11y: ${differences.length} change${differences.length === 1 ? '' : 's'} against the baseline.`);

  for (const { key, was, now } of differences) {
    const label = was === 0 ? 'new     ' : now === 0 ? 'fixed   ' : 'changed ';

    console.error(`  ${label} ${key}  ${was} -> ${now}`);
  }

  console.error(
    '\nA new or larger entry is a regression - fix it.\n' +
      'A fixed or smaller one is good news that still has to be recorded:\n' +
      '  npm run a11y:update\n',
  );

  return 1;
}

process.exitCode = await main();
