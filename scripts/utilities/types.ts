/**
 * Shape of the utility sheet definitions consumed by scripts/build-utilities.ts.
 *
 * The generator runs on Node's native type stripping, so everything here must be
 * erasable syntax (no enums, namespaces or parameter properties). The
 * `erasableSyntaxOnly` flag in scripts/tsconfig.json enforces that.
 */

/** A single CSS declaration, for example `['margin-inline', 'auto']`. */
export type Declaration = readonly [property: string, value: string];

/**
 * One class and its declarations. The class name is written without the `uc-`
 * prefix and without any breakpoint infix - the renderer adds both.
 */
export type Rule = readonly [className: string, declarations: readonly Declaration[]];

export interface UtilityGroup {
  /** Emitted as a comment above the group. */
  readonly title: string;
  /** When true the group is repeated inside every breakpoint media query. */
  readonly responsive: boolean;
  readonly rules: readonly Rule[];
}

export interface UtilitySheet {
  /** File name written into themes/utilities/. */
  readonly file: string;
  /** Source module name (scripts/utilities/<module>.ts), used in the file header. */
  readonly module: string;
  /** Human readable name used in the file header. */
  readonly title: string;
  /** Header lines explaining what the sheet contains. */
  readonly description: readonly string[];
  /** True when any rule references a `--uc-space-*` token from scale.css. */
  readonly requiresScale: boolean;
  readonly groups: readonly UtilityGroup[];
}

/** Map of class prefix to the CSS properties it sets, e.g. `{ mx: ['margin-inline'] }`. */
export type SideMap = Readonly<Record<string, readonly string[]>>;

/** Map of class suffix to CSS value, e.g. `{ center: 'center' }`. */
export type ValueMap = Readonly<Record<string, string>>;
