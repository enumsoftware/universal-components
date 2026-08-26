import { Component, computed, effect, inject, input, signal } from "@angular/core";

import { UcButton } from "../../uc-button/uc-button";
import { UcCard } from "../../uc-card/uc-card";
import { UcPill } from "../../uc-pill/uc-pill";
import { UcSelect, type SelectOption } from "../../uc-select/uc-select";
import { UcTabPanel, UcTabs, type UcTab } from "../../uc-tabs/uc-tabs";
import type { RegistryEntry, ResolvedExample, ResolvedShowcase } from "../core";
import { resolveShowcase } from "../core";
import { WbCanvas } from "./canvas";
import { WbComponentHost, type WbAction } from "./component-host";
import { WbKnobPanel, type KnobChange } from "./knob-panel";
import { ThemeStore, WORKBENCH_THEMES, type WorkbenchTheme } from "./theme";

@Component({
  selector: "wb-showcase-view",
  imports: [UcButton, UcCard, UcPill, UcSelect, UcTabPanel, UcTabs, WbCanvas, WbComponentHost, WbKnobPanel],
  templateUrl: "./showcase-view.html",
  styleUrl: "./showcase-view.css",
})
export class WbShowcaseView {
  /** Bound from route `data` by `withComponentInputBinding()`. */
  readonly entry = input.required<RegistryEntry>();

  protected readonly theme = inject(ThemeStore);

  protected readonly themeOptions: SelectOption<string>[] = WORKBENCH_THEMES.map((theme) => ({
    value: theme,
    label: theme,
  }));

  protected readonly showcase = signal<ResolvedShowcase | null>(null);
  protected readonly failure = signal<string | null>(null);
  protected readonly activeTab = signal("playground");
  protected readonly values = signal<Record<string, unknown>>({});
  protected readonly actions = signal<readonly WbAction[]>([]);

  protected readonly docParagraphs = computed(() => (this.showcase()?.docs ?? "").split(/\n{2,}/).filter(Boolean));

  protected readonly tabs = computed<UcTab[]>(() => [
    { key: "playground", label: "Playground" },
    { key: "examples", label: "Examples" },
    { key: "docs", label: "Docs" },
  ]);

  private loadToken = 0;

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
          this.values.set(defaultValues(resolved));
          this.actions.set([]);
          this.activeTab.set("playground");
        })
        .catch((error: unknown) => {
          if (token === this.loadToken) {
            this.failure.set(error instanceof Error ? error.message : String(error));
          }
        });
    });
  }

  protected onCanvasTheme(theme: string | null): void {
    if (theme !== null) {
      this.theme.setCanvas(theme as WorkbenchTheme);
    }
  }

  protected onKnobChange(change: KnobChange): void {
    this.values.update((current) => ({ ...current, [change.name]: change.value }));
  }

  protected resetKnobs(): void {
    const showcase = this.showcase();

    if (showcase !== null) {
      this.values.set(defaultValues(showcase));
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
    return payload === undefined ? "(void)" : JSON.stringify(payload);
  }

  protected formatTime(at: number): string {
    return new Date(at).toLocaleTimeString();
  }
}

function defaultValues(showcase: ResolvedShowcase): Record<string, unknown> {
  return Object.fromEntries(showcase.knobs.map((entry) => [entry.name, entry.knob.defaultValue]));
}
