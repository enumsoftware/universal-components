/**
 * The shared definition of "the accessibility check".
 *
 * Both the in-app A11y tab and `scripts/a11y.ts` import from here, so the panel
 * a developer reads while fixing something grades exactly the same way as the
 * gate that blocks the merge. Two configurations would mean a component could
 * look clean in the workbench and still fail CI.
 *
 * Nothing here imports axe: the run options are plain data handed to whichever
 * copy of axe is in scope, and the result types are structural. That keeps this
 * module importable from `scripts/`, which typechecks under a tsconfig with no
 * DOM lib.
 */

/** WCAG 2.1 AA, plus axe's own best practices. */
export const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] as const;

/** Selector the sweep and the panel both scope axe to. */
export const A11Y_CANVAS_SELECTOR = '.wb-canvas';

/**
 * The tabs the sweep checks, in the order it checks them.
 *
 * Every canvas carries `data-surface` naming the tab it belongs to. Without it
 * the sweep can only ask "is a canvas on screen", which is true for a fraction
 * of a second after clicking a tab while the *previous* tab's canvas is still
 * mounted - so it would measure the wrong surface, or throw when that canvas
 * vanished mid-run. The attribute makes each answer unambiguous.
 */
export const A11Y_SURFACES = ['playground', 'examples'] as const;
export type A11ySurface = (typeof A11Y_SURFACES)[number];

/** Every canvas belonging to one tab. */
export function a11ySurfaceSelector(surface: A11ySurface): string {
  return `[data-surface="${surface}"] ${A11Y_CANVAS_SELECTOR}`;
}

/**
 * Passed straight to `axe.run(context, options)`.
 *
 * Page-level rules - `region`, `bypass`, `html-has-lang` and friends - need no
 * disabling here. Scoping the context to an element makes axe treat the run as
 * a fragment and skip them, which is the correct call: the canvas is a slice of
 * a page, not a page.
 */
export const A11Y_RUN_OPTIONS = {
  runOnly: { type: 'tag', values: [...A11Y_TAGS] },
} as const;

/** The part of axe's result the workbench consumes. Structural on purpose. */
export interface AxeResultLike {
  readonly violations: readonly AxeIssueLike[];
  readonly incomplete: readonly AxeIssueLike[];
}

export interface AxeIssueLike {
  readonly id: string;
  readonly impact?: string | null;
  readonly help: string;
  readonly helpUrl: string;
  readonly nodes: readonly AxeNodeLike[];
}

export interface AxeNodeLike {
  /** Nested when the node is inside an iframe; the workbench never is. */
  readonly target: readonly (string | readonly string[])[];
  readonly html: string;
  readonly failureSummary?: string;
}

export type A11yImpact = 'minor' | 'moderate' | 'serious' | 'critical';

/** Ascending severity, so a report can be sorted worst-first. */
export const A11Y_IMPACT_ORDER: readonly A11yImpact[] = ['minor', 'moderate', 'serious', 'critical'];

export interface A11yNode {
  readonly target: string;
  readonly html: string;
  readonly summary: string;
}

export interface A11yIssue {
  readonly rule: string;
  readonly impact: A11yImpact | null;
  readonly help: string;
  readonly helpUrl: string;
  readonly nodes: readonly A11yNode[];
}

export interface A11yReport {
  readonly violations: readonly A11yIssue[];
  /** Checks axe could not decide on its own - worth a human look, never a failure. */
  readonly incomplete: readonly A11yIssue[];
}

/**
 * Flattens an axe result into the workbench's own shape.
 *
 * Runs in both places the check does: inside the page for the A11y tab, and in
 * the sweep after `page.evaluate` hands the raw result back.
 */
export function toReport(results: AxeResultLike): A11yReport {
  return {
    violations: results.violations.map(toIssue).sort(byImpact),
    incomplete: results.incomplete.map(toIssue).sort(byImpact),
  };
}

function toIssue(issue: AxeIssueLike): A11yIssue {
  return {
    rule: issue.id,
    impact: isImpact(issue.impact) ? issue.impact : null,
    help: issue.help,
    helpUrl: issue.helpUrl,
    nodes: issue.nodes.map((node) => ({
      target: node.target.map((part) => (typeof part === 'string' ? part : part.join(' '))).join(' '),
      html: node.html,
      summary: node.failureSummary ?? '',
    })),
  };
}

function byImpact(left: A11yIssue, right: A11yIssue): number {
  return impactRank(right.impact) - impactRank(left.impact) || left.rule.localeCompare(right.rule);
}

function impactRank(impact: A11yImpact | null): number {
  return impact === null ? -1 : A11Y_IMPACT_ORDER.indexOf(impact);
}

function isImpact(value: string | null | undefined): value is A11yImpact {
  return value !== null && value !== undefined && (A11Y_IMPACT_ORDER as readonly string[]).includes(value);
}
