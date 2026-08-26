/**
 * Knob descriptors: the typed control vocabulary the playground panel renders.
 *
 * Every variant keeps its value in covariant positions only (`defaultValue`,
 * `options`), so `Knob<'primary' | 'secondary'>` stays assignable to the
 * `Knob<unknown>` slot an untyped input such as `model.required()` produces.
 */

export type KnobKind = "text" | "boolean" | "number" | "select" | "color" | "object";

interface KnobBase<TKind extends KnobKind, TValue> {
  readonly kind: TKind;
  readonly defaultValue: TValue;
  /** Overrides the humanised input name in the controls panel. */
  readonly label?: string;
  readonly description?: string;
}

export type Knob<TValue> =
  | (KnobBase<"text", TValue> & { readonly placeholder?: string })
  | KnobBase<"boolean", TValue>
  | (KnobBase<"number", TValue> & {
      readonly min?: number;
      readonly max?: number;
      readonly step?: number;
    })
  | (KnobBase<"select", TValue> & { readonly options: readonly TValue[] })
  | KnobBase<"color", TValue>
  | KnobBase<"object", TValue>;

type KnobOptions = { readonly label?: string; readonly description?: string };

export function text(
  defaultValue: string | undefined,
  options: KnobOptions & { readonly placeholder?: string } = {},
): Knob<string | undefined> {
  return { kind: "text", defaultValue, ...options };
}

export function bool(defaultValue: boolean, options: KnobOptions = {}): Knob<boolean> {
  return { kind: "boolean", defaultValue, ...options };
}

export function number(
  defaultValue: number,
  options: KnobOptions & {
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
  } = {},
): Knob<number> {
  return { kind: "number", defaultValue, ...options };
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
  return { kind: "select", defaultValue, options, ...extra };
}

export function color(defaultValue: string, options: KnobOptions = {}): Knob<string> {
  return { kind: "color", defaultValue, ...options };
}

/** Edited as JSON in the panel. Use for array and record inputs. */
export function object<TValue>(defaultValue: TValue, options: KnobOptions = {}): Knob<TValue> {
  return { kind: "object", defaultValue, ...options };
}
