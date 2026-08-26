import {
  ApplicationRef,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  Type,
  createComponent,
  effect,
  inject,
  input,
  output,
  reflectComponentType,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

export interface WbAction {
  readonly name: string;
  readonly payload: unknown;
  readonly at: number;
}

interface Unsubscribable {
  unsubscribe(): void;
}

/**
 * Renders an arbitrary component into the canvas and keeps its inputs in sync
 * with the knob values.
 *
 * Uses `createComponent(..., { hostElement })` rather than
 * `ViewContainerRef.createComponent` so the instance renders *inside* this
 * element instead of as a sibling of it, which keeps canvas layout rules
 * (centred, padded, fullscreen) applying to the thing they look like they
 * apply to. Each instantiation gets a fresh host element, so host bindings from
 * a previous component can never linger.
 *
 * The host element is created with the component's own tag name, so the canvas
 * DOM is byte-for-byte what a consuming app would render. Falling back to a
 * `div` would drop the custom element from the tree, quietly breaking global
 * styles and axe rules that key off it.
 */
@Component({
  selector: 'wb-component-host',
  template: `<div #anchor class="wb-host-anchor"></div>`,
  styles: `
    :host,
    .wb-host-anchor {
      display: contents;
    }
  `,
})
export class WbComponentHost {
  readonly component = input.required<Type<unknown>>();
  readonly props = input<Record<string, unknown>>({});
  readonly action = output<WbAction>();

  private readonly anchor = viewChild.required<ElementRef<HTMLElement>>('anchor');
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly applicationRef = inject(ApplicationRef);

  private ref: ComponentRef<unknown> | null = null;
  private hostElement: HTMLElement | null = null;
  private subscriptions: Unsubscribable[] = [];
  /**
   * Property name to template name. Knobs and presets are keyed by the class
   * property, but `setInput` resolves against the public name, so an aliased
   * input - `interpolationMode` published as `interpolation` - is only
   * settable through the alias.
   */
  private inputAliases = new Map<string, string>();

  /** Bumped on every instantiation so the input-sync effect re-runs for the new ref. */
  private readonly generation = signal(0);

  constructor() {
    effect(() => {
      const type = this.component();
      const anchor = this.anchor().nativeElement;

      untracked(() => {
        this.teardown();

        const hostElement = document.createElement(hostTagFor(type));
        anchor.appendChild(hostElement);

        const ref = createComponent(type, {
          environmentInjector: this.environmentInjector,
          hostElement,
        });
        this.applicationRef.attachView(ref.hostView);

        this.ref = ref;
        this.hostElement = hostElement;
        this.inputAliases = new Map(
          reflectComponentType(type)?.inputs.map((input) => [input.propName, input.templateName]) ?? [],
        );
        this.wireOutputs(ref, type);
        this.applyProps(this.props());
        this.generation.update((value) => value + 1);
      });
    });

    effect(() => {
      this.generation();
      const props = this.props();

      untracked(() => this.applyProps(props));
    });

    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  private applyProps(props: Record<string, unknown>): void {
    const ref = this.ref;

    if (ref === null) {
      return;
    }

    for (const [name, value] of Object.entries(props)) {
      const templateName = this.inputAliases.get(name);

      // `setInput` throws on an unknown name, and a preset may legitimately
      // carry a key the component no longer declares.
      if (templateName !== undefined) {
        ref.setInput(templateName, value);
      }
    }
  }

  private wireOutputs(ref: ComponentRef<unknown>, type: Type<unknown>): void {
    const outputs = reflectComponentType(type)?.outputs ?? [];
    const instance = ref.instance as Record<string, unknown>;

    for (const { propName, templateName } of outputs) {
      // A `model()` surfaces as both an input and an output. Skip those: every
      // knob edit would otherwise echo straight back into the actions log.
      if (this.inputAliases.has(propName)) {
        continue;
      }

      const emitter = instance[propName];

      if (!isSubscribable(emitter)) {
        continue;
      }

      this.subscriptions.push(
        emitter.subscribe((payload: unknown) => {
          this.action.emit({ name: templateName, payload, at: Date.now() });
        }),
      );
    }
  }

  private teardown(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];

    if (this.ref !== null) {
      this.applicationRef.detachView(this.ref.hostView);
      this.ref.destroy();
      this.ref = null;
    }

    this.hostElement?.remove();
    this.hostElement = null;
  }
}

/** `uc-button` from `uc-button`, `button` from `button[ucThing]`, `div` when there is no tag. */
function hostTagFor(type: Type<unknown>): string {
  const selector = reflectComponentType(type)?.selector ?? '';
  const tag = /^[a-z][a-z0-9-]*/i.exec(selector)?.[0];

  return tag ?? 'div';
}

function isSubscribable(value: unknown): value is { subscribe(next: (payload: unknown) => void): Unsubscribable } {
  return (
    typeof value === 'object' && value !== null && typeof (value as { subscribe?: unknown }).subscribe === 'function'
  );
}
