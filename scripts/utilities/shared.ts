/** Shared scale, value maps and rule helpers for the utility sheet modules. */
import type { Rule, SideMap, ValueMap } from './types.ts';

/** Spacing scale shared by margin, padding and gap utilities. */
export const SPACE_SCALE: readonly (readonly [key: string, value: string])[] = [
  ['0', '0rem'],
  ['px', '1px'],
  ['1', '0.25rem'],
  ['2', '0.5rem'],
  ['3', '0.75rem'],
  ['4', '1rem'],
  ['5', '1.25rem'],
  ['6', '1.5rem'],
  ['8', '2rem'],
  ['10', '2.5rem'],
  ['12', '3rem'],
  ['16', '4rem'],
  ['20', '5rem'],
  ['24', '6rem'],
];

export const SPACE_KEYS: readonly string[] = SPACE_SCALE.map(([key]) => key);

/** Steps that get a negative counterpart. Negating 0 or 1px is pointless. */
export const NEGATABLE_KEYS: readonly string[] = SPACE_KEYS.filter((key) => key !== '0' && key !== 'px');

/** Default track width for uc-grid-auto-fit / uc-grid-auto-fill. */
export const GRID_MIN = '16rem';

export const space = (key: string): string => `var(--uc-space-${key})`;

export const negativeSpace = (key: string): string => `calc(var(--uc-space-${key}) * -1)`;

export const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** Builds rules for one property across a value map. */
export function propertyRules(prefix: string, property: string, values: ValueMap): Rule[] {
  return Object.entries(values).map(([suffix, value]) => [`${prefix}-${suffix}`, [[property, value]]]);
}

/**
 * Builds spacing rules for a map of class prefixes to CSS properties.
 * `options.negative` switches the class names to the `n` form (uc-mt-n4).
 */
export function spacingRules(
  sides: SideMap,
  valueFor: (key: string) => string,
  keys: readonly string[],
  options: { negative?: boolean } = {},
): Rule[] {
  const rules: Rule[] = [];
  for (const [prefix, properties] of Object.entries(sides)) {
    for (const key of keys) {
      const name = options.negative ? `${prefix}-n${key}` : `${prefix}-${key}`;
      rules.push([name, properties.map((property): [string, string] => [property, valueFor(key)])]);
    }
  }
  return rules;
}

/** Values shared by justify-content and align-content. */
export const CONTENT_ALIGNMENT: ValueMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  stretch: 'stretch',
};

/** Values shared by align-items and align-self. */
export const ITEM_ALIGNMENT: ValueMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};
