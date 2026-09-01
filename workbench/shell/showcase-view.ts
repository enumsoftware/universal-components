import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UcButton } from '../../uc-button/uc-button';
import { UcCard } from '../../uc-card/uc-card';
import { UcPill } from '../../uc-pill/uc-pill';
import { UcTabPanel, UcTabs, type UcTab } from '../../uc-tabs/uc-tabs';
import type { RegistryEntry, ResolvedExample, ResolvedShowcase, ShowcaseDocs } from '../core';
import { decodeArgs, encodeArgs, resolveShowcase } from '../core';
import { WbA11yPanel } from './a11y-panel';
import { WbCanvas } from './canvas';
import { WbComponentHost, type WbAction } from './component-host';
import { WbKnobPanel, type KnobChange } from './knob-panel';

/** Text knobs fire per keystroke; the URL only needs to settle. */
const URL_WRITE_DELAY_MS = 200;

/**
 * Groups whose showcases are driven by knobs and emit outputs. Foundations and
 * Utilities are pages of markup and CSS classes: they take no inputs and fire
 * nothing, so the panels would only ever show two empty cards.
 */
const DRIVABLE_GROUPS: readonly string[] = ['Components', 'Charts'];

@Component({
  selector: 'wb-showcase-view',
  imports: [
    UcButton,
    UcCard,
    UcPill,
    UcTabPanel,
    UcTabs,
    WbA11yPanel,
    WbCanvas,
    WbComponentHost,
    WbKnobPanel,
  ],
  templateUrl: './showcase-view.html',
  styleUrl: './showcase-view.css',
})
export class WbShowcaseView {
  /** Bound from route `data` by `withComponentInputBinding()`. */
  readonly entry = input.required<RegistryEntry>();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly showcase = signal<ResolvedShowcase | null>(null);
  protected readonly failure = signal<string | null>(null);
  protected readonly activeTab = signal('playground');
  protected readonly values = signal<Record<string, unknown>>({});
  protected readonly actions = signal<readonly WbAction[]>([]);
  protected readonly docs = signal<ShowcaseDocs | null>(null);

  protected readonly showsPanels = computed(() => {
    const group = this.showcase()?.group;

    return group !== undefined && DRIVABLE_GROUPS.includes(group);
  });

  protected readonly tabs = computed<UcTab[]>(() => [
    { key: 'playground', label: 'Playground' },
    { key: 'examples', label: 'Examples' },
    { key: 'docs', label: 'Docs' },
    { key: 'a11y', label: 'Accessibility' },
  ]);

  private loadToken = 0;
  private docsToken = 0;
  private urlWriteTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const entry = this.entry();
      const token = ++this.loadToken;

      this.showcase.set(null);
      this.failure.set(null);

      void entry
        .load()
        .then((module) => {
          // A faster click may have started a newer load; drop this result.
          if (token !== this.loadToken) {
            return;
          }

          const resolved = resolveShowcase(module.default);

          this.showcase.set(resolved);
          this.docs.set(null);
          this.actions.set([]);
          this.activeTab.set('playground');
          this.applyUrlState(resolved);
        })
        .catch((error: unknown) => {
          if (token === this.loadToken) {
            this.failure.set(error instanceof Error ? error.message : String(error));
          }
        });
    });
  }

  /** URL wins over the stored defaults, so a shared link opens as it was sent. */
  private applyUrlState(showcase: ResolvedShowcase): void {
    const params = this.route.snapshot.queryParamMap;

    this.values.set({ ...defaultValues(showcase), ...decodeArgs(params.get('args')) });
  }

  /**
   * Writes only what differs from the resting state, and only when it actually
   * differs from what the bar already says - so applying a link back onto
   * itself does not queue a redundant navigation.
   */
  private scheduleUrlWrite(): void {
    clearTimeout(this.urlWriteTimer);

    this.urlWriteTimer = setTimeout(() => {
      const showcase = this.showcase();

      if (showcase === null) {
        return;
      }

      const next = {
        args: encodeArgs(this.values(), defaultValues(showcase)),
      };
      const current = this.route.snapshot.queryParamMap;
      const unchanged = (Object.keys(next) as (keyof typeof next)[]).every(
        (key) => (current.get(key) ?? null) === next[key],
      );

      if (unchanged) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: next,
        replaceUrl: true,
      });
    }, URL_WRITE_DELAY_MS);
  }

  /**
   * Docs are a separate lazy chunk, so they are fetched the first time the tab
   * is opened rather than alongside the showcase.
   */
  protected onTabChange(tab: string): void {
    this.activeTab.set(tab);

    if (tab !== 'docs' || this.docs() !== null) {
      return;
    }

    const token = ++this.docsToken;

    void this.entry()
      .loadDocs()
      .then((loaded) => {
        if (token === this.docsToken) {
          this.docs.set(loaded);
        }
      })
      .catch(() => {
        if (token === this.docsToken) {
          this.docs.set({ html: '', api: [] });
        }
      });
  }

  protected onKnobChange(change: KnobChange): void {
    this.values.update((current) => ({ ...current, [change.name]: change.value }));
    this.scheduleUrlWrite();
  }

  protected resetKnobs(): void {
    const showcase = this.showcase();

    if (showcase !== null) {
      this.values.set(defaultValues(showcase));
      this.scheduleUrlWrite();
    }
  }

  protected onAction(action: WbAction): void {
    this.actions.update((current) => [action, ...current].slice(0, 50));
  }

  protected clearActions(): void {
    this.actions.set([]);
  }

  /** Presets reuse the showcase component; richer examples bring their own. */
  protected exampleComponent(example: ResolvedExample) {
    return example.component ?? this.showcase()?.component ?? null;
  }

  protected formatPayload(payload: unknown): string {
    return payload === undefined ? '(void)' : JSON.stringify(payload);
  }

  protected formatTime(at: number): string {
    return new Date(at).toLocaleTimeString();
  }
}

function defaultValues(showcase: ResolvedShowcase): Record<string, unknown> {
  return Object.fromEntries(showcase.knobs.map((entry) => [entry.name, entry.knob.defaultValue]));
}
