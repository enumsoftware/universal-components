/**
 * Knob descriptors: the typed control vocabulary the playground panel renders.
 *
 * The helpers are generic over their value so a knob still lands in a slot the
 * input declares more loosely - `text(null)` into a `string | null` input, say.
 * A fixed `Knob<string | undefined>` would fail that assignment outright.
 *
 * Every variant keeps its value in covariant positions only (`defaultValue`,
 * `options`), so `Knob<'primary' | 'secondary'>` stays assignable to the
 * `Knob<unknown>` slot an untyped input such as `model.required()` produces.
 */

export type KnobKind = 'text' | 'boolean' | 'number' | 'select' | 'color' | 'date' | 'object';

interface KnobBase<TKind extends KnobKind, TValue> {
  readonly kind: TKind;
  readonly defaultValue: TValue;
  /** Overrides the humanised input name in the controls panel. */
  readonly label?: string;
  readonly description?: string;
}

export type Knob<TValue> =
  | (KnobBase<'text', TValue> & { readonly placeholder?: string })
  | KnobBase<'boolean', TValue>
  | (KnobBase<'number', TValue> & {
      readonly min?: number;
      readonly max?: number;
      readonly step?: number;
    })
  | (KnobBase<'select', TValue> & { readonly options: readonly TValue[] })
  | KnobBase<'color', TValue>
  | (KnobBase<'date', TValue> & {
      readonly placeholder?: string;
      readonly showTime?: boolean;
    })
  | KnobBase<'object', TValue>;

type KnobOptions = { readonly label?: string; readonly description?: string };

export function text<TValue extends string | null | undefined>(
  defaultValue: TValue,
  options: KnobOptions & { readonly placeholder?: string } = {},
): Knob<TValue> {
  return { kind: 'text', defaultValue, ...options };
}

export function bool<TValue extends boolean | null | undefined>(
  defaultValue: TValue,
  options: KnobOptions = {},
): Knob<TValue> {
  return { kind: 'boolean', defaultValue, ...options };
}

export function number<TValue extends number | null | undefined>(
  defaultValue: TValue,
  options: KnobOptions & {
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
  } = {},
): Knob<TValue> {
  return { kind: 'number', defaultValue, ...options };
}

/**
 * Reads its type from `options`, so passing a component's exported
 * `*_OPTIONS` tuple keeps the knob and the input in lockstep.
 */
export function select<TValue>(
  options: readonly TValue[],
  defaultValue: TValue,
  extra: KnobOptions = {},
): Knob<TValue> {
  return { kind: 'select', defaultValue, options, ...extra };
}

/**
 * Picked with the library's own `uc-date-time-picker`, so a date input is never
 * a free-text field the user has to spell `YYYY-MM-DD` into by hand. Values stay
 * strings - `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with `showTime` - and `''` means
 * "unset", which the panel's Clear button restores.
 */
export function date<TValue extends string | null | undefined>(
  defaultValue: TValue,
  options: KnobOptions & { readonly placeholder?: string; readonly showTime?: boolean } = {},
): Knob<TValue> {
  return { kind: 'date', defaultValue, ...options };
}

export function color<TValue extends string | null | undefined>(
  defaultValue: TValue,
  options: KnobOptions = {},
): Knob<TValue> {
  return { kind: 'color', defaultValue, ...options };
}

/** Edited as JSON in the panel. Use for array and record inputs. */
export function object<TValue>(defaultValue: TValue, options: KnobOptions = {}): Knob<TValue> {
  return { kind: 'object', defaultValue, ...options };
}
