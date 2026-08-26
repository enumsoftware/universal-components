import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UcButton } from '../../uc-button/uc-button';
import { UcButtonToggle } from '../../uc-button-toggle/uc-button-toggle';
import { UcButtonToggleItem } from '../../uc-button-toggle/uc-button-toggle-item';
import { UcCard } from '../../uc-card/uc-card';
import { UcPill } from '../../uc-pill/uc-pill';
import { UcSelect, type SelectOption } from '../../uc-select/uc-select';
import { UcTabPanel, UcTabs, type UcTab } from '../../uc-tabs/uc-tabs';
import type { RegistryEntry, ResolvedExample, ResolvedShowcase, ViewportPreset } from '../core';
import { VIEWPORT_PRESETS, decodeArgs, encodeArgs, isViewportPreset, resolveShowcase, viewportWidth } from '../core';
import { WbCanvas } from './canvas';
import { WbComponentHost, type WbAction } from './component-host';
import { WbKnobPanel, type KnobChange } from './knob-panel';
import { ThemeStore, WORKBENCH_THEMES, type WorkbenchTheme } from './theme';

/** Text knobs fire per keystroke; the URL only needs to settle. */
const URL_WRITE_DELAY_MS = 200;

@Component({
  selector: 'wb-showcase-view',
  imports: [
    UcButton,
    UcButtonToggle,
    UcButtonToggleItem,
    UcCard,
    UcPill,
    UcSelect,
    UcTabPanel,
    UcTabs,
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

  protected readonly theme = inject(ThemeStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly viewports = VIEWPORT_PRESETS;

  protected readonly themeOptions: SelectOption<string>[] = WORKBENCH_THEMES.map((theme) => ({
    value: theme,
    label: theme,
  }));

  protected readonly showcase = signal<ResolvedShowcase | null>(null);
  protected readonly failure = signal<string | null>(null);
  protected readonly activeTab = signal('playground');
  protected readonly values = signal<Record<string, unknown>>({});
  protected readonly actions = signal<readonly WbAction[]>([]);
  protected readonly viewport = signal<ViewportPreset>('auto');

  protected readonly canvasWidth = computed(() => viewportWidth(this.viewport()));

  protected readonly docParagraphs = computed(() => (this.showcase()?.docs ?? '').split(/\n{2,}/).filter(Boolean));

  protected readonly tabs = computed<UcTab[]>(() => [
    { key: 'playground', label: 'Playground' },
    { key: 'examples', label: 'Examples' },
    { key: 'docs', label: 'Docs' },
  ]);

  private loadToken = 0;
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
    const theme = params.get('theme');
    const preset = params.get('vw');

    this.values.set({ ...defaultValues(showcase), ...decodeArgs(params.get('args')) });

    if (theme !== null && (WORKBENCH_THEMES as readonly string[]).includes(theme)) {
      this.theme.setCanvas(theme as WorkbenchTheme);
    }

    this.viewport.set(isViewportPreset(preset) ? preset : 'auto');
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

      const preset = this.viewport();
      const next = {
        args: encodeArgs(this.values(), defaultValues(showcase)),
        theme: this.theme.canvas() === 'light' ? null : this.theme.canvas(),
        vw: preset === 'auto' ? null : preset,
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

  protected onCanvasTheme(theme: string | null): void {
    if (theme !== null) {
      this.theme.setCanvas(theme as WorkbenchTheme);
      this.scheduleUrlWrite();
    }
  }

  protected onViewport(preset: string): void {
    if (isViewportPreset(preset)) {
      this.viewport.set(preset);
      this.scheduleUrlWrite();
    }
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
