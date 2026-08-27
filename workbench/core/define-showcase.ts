import type { InputSignalWithTransform, Type } from '@angular/core';

import type { Knob } from './knobs';

export type ShowcaseLayout = 'centered' | 'padded' | 'fullscreen';

/**
 * The value you are allowed to *write* to a signal input.
 *
 * `InputSignal<T>` is `InputSignalWithTransform<T, T>` and `ModelSignal<T>`
 * extends `InputSignal<T>`, so one conditional covers `input()`, `input()` with
 * a transform, and `model()`. Anything else on the class - plain signals,
 * outputs, methods - resolves to `never` and gets filtered out below.
 * The read slot is `any` on purpose: `InputSignalWithTransform` carries its read
 * type through an invariant `[SIGNAL]` brand, so matching it against `unknown`
 * silently fails for every input except an untyped `model()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SettableValue<TMember> = TMember extends InputSignalWithTransform<any, infer TWrite> ? TWrite : never;

type SettableKeys<TComponent> = {
  [K in keyof TComponent]: SettableValue<TComponent[K]> extends never ? never : K;
}[keyof TComponent];

/** Knob map keyed to the component's real inputs - a renamed input breaks the build. */
export type Knobs<TComponent> = {
  readonly [K in SettableKeys<TComponent>]?: Knob<SettableValue<TComponent[K]>>;
};

/** Preset input values applied to the showcase component. */
export type PresetProps<TComponent> = {
  readonly [K in SettableKeys<TComponent>]?: SettableValue<TComponent[K]>;
};

/**
 * One entry under the Examples tab.
 *
 * Simple variations set `props` and reuse the showcase component, which keeps
 * arg-only cases as cheap as they were as stories. Anything involving content
 * projection, sibling components or local state declares a real `component`,
 * which is AOT compiled and type checked - the raw template strings this
 * replaces never were.
 */
export interface ShowcaseExample<TComponent = unknown> {
  readonly name: string;
  readonly description?: string;
  readonly layout?: ShowcaseLayout;
  readonly component?: Type<unknown>;
  readonly props?: PresetProps<TComponent>;
}

export interface Showcase<TComponent = unknown> {
  /** Route path and stable deep link, e.g. `components/button`. */
  readonly id: string;
  /** Sidebar section, e.g. `Components`. */
  readonly group: string;
  readonly title: string;
  /** Sort weight inside the group. Ties fall back to `title`. */
  readonly order?: number;
  /** Omit for docs-only pages that have no single component to drive. */
  readonly component?: Type<TComponent>;
  readonly layout?: ShowcaseLayout;
  readonly knobs?: Knobs<TComponent>;
  readonly examples?: readonly ShowcaseExample<TComponent>[];
}

/**
 * A showcase with its component type erased. `any` rather than `unknown` or
 * `never`: `Showcase<T>` is invariant in `T` through both `Type<T>` and the knob
 * map, so no single concrete type accepts every showcase.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyShowcase = Showcase<any>;

/** Identity function; exists so `TComponent` is inferred from `component`. */
export function defineShowcase<TComponent>(showcase: Showcase<TComponent>): Showcase<TComponent> {
  return showcase;
}

/**
 * Generic-erased view of a showcase, so the shell can walk knobs and examples
 * without threading `TComponent` through every component in the app.
 */
export interface ResolvedShowcase {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly order: number;
  readonly component: Type<unknown> | undefined;
  readonly layout: ShowcaseLayout;
  readonly knobs: readonly ResolvedKnob[];
  readonly examples: readonly ResolvedExample[];
}

export interface ResolvedKnob {
  readonly name: string;
  readonly label: string;
  readonly knob: Knob<unknown>;
}

export interface ResolvedExample {
  readonly name: string;
  readonly description: string | undefined;
  readonly layout: ShowcaseLayout;
  readonly component: Type<unknown> | undefined;
  readonly props: Record<string, unknown>;
}

function knobDefaults(entries: readonly [string, Knob<unknown>][]): Record<string, unknown> {
  return Object.fromEntries(entries.map(([name, knob]) => [name, knob.defaultValue]));
}

const humanise = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (character) => character.toUpperCase());

export function resolveShowcase(showcase: AnyShowcase): ResolvedShowcase {
  const knobEntries = Object.entries((showcase.knobs ?? {}) as Record<string, Knob<unknown>>);

  return {
    id: showcase.id,
    group: showcase.group,
    title: showcase.title,
    order: showcase.order ?? 0,
    component: showcase.component,
    layout: showcase.layout ?? 'centered',
    knobs: knobEntries.map(([name, knob]) => ({
      name,
      label: knob.label ?? humanise(name),
      knob,
    })),
    examples: (showcase.examples ?? []).map((example) => ({
      name: example.name,
      description: example.description,
      layout: example.layout ?? showcase.layout ?? 'centered',
      component: example.component,
      // A preset states only what it changes, so the knob defaults have to sit
      // underneath it - otherwise a required input the preset does not mention
      // is never set and the component throws NG0950. An example that brings
      // its own component owns all of its inputs and gets no merge.
      props: (example.component === undefined
        ? { ...knobDefaults(knobEntries), ...(example.props ?? {}) }
        : (example.props ?? {})) as Record<string, unknown>,
    })),
  };
}
