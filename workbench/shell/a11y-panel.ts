import { Component, ElementRef, Type, afterNextRender, inject, input, signal } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcCard } from '../../uc-card/uc-card';
import { UcPill } from '../../uc-pill/uc-pill';
import type { A11yImpact, A11yIssue, A11yReport, AxeResultLike, ShowcaseLayout } from '../core';
import { A11Y_CANVAS_SELECTOR, A11Y_RUN_OPTIONS, toReport } from '../core';
import { WbCanvas } from './canvas';
import { WbComponentHost } from './component-host';

/** Minimal surface of the axe module - the workbench never needs axe's own types. */
interface AxeLike {
  run(context: unknown, options: unknown): Promise<AxeResultLike>;
}

/**
 * Runs axe against a live canvas and reports what it finds.
 *
 * The panel renders its own canvas rather than reaching for the Playground's:
 * `uc-tabs` destroys the inactive panel, so by the time this tab is open the
 * other canvas is gone from the DOM. Rendering here also means the check sees
 * the current knob values and the current app theme, which is the whole point
 * of having it in the app instead of only in CI.
 *
 * axe itself is ~600KB, so it is a dynamic import: opening a component does not
 * pay for it, opening this tab does.
 */
@Component({
  selector: 'wb-a11y-panel',
  imports: [UcButton, UcCard, UcPill, WbCanvas, WbComponentHost],
  templateUrl: './a11y-panel.html',
  styleUrl: './a11y-panel.css',
})
export class WbA11yPanel {
  readonly component = input.required<Type<unknown>>();
  readonly props = input<Record<string, unknown>>({});
  readonly layout = input<ShowcaseLayout>('centered');

  protected readonly report = signal<A11yReport | null>(null);
  protected readonly running = signal(false);
  protected readonly failure = signal<string | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private axe: AxeLike | null = null;

  constructor() {
    // The canvas has to exist before axe can be pointed at it, and the panel is
    // built fresh every time the tab opens - so one run on first paint is the
    // whole auto-run story. Re-running after a knob edit is the button's job.
    afterNextRender(() => void this.run());
  }

  protected async run(): Promise<void> {
    if (this.running()) {
      return;
    }

    this.running.set(true);
    this.failure.set(null);

    try {
      const axe = await this.loadAxe();
      const targets = this.host.nativeElement.querySelectorAll(A11Y_CANVAS_SELECTOR);

      if (targets.length === 0) {
        throw new Error('The canvas has not rendered yet.');
      }

      this.report.set(toReport(await axe.run({ include: [[A11Y_CANVAS_SELECTOR]] }, A11Y_RUN_OPTIONS)));
    } catch (error: unknown) {
      this.report.set(null);
      this.failure.set(error instanceof Error ? error.message : String(error));
    } finally {
      this.running.set(false);
    }
  }

  private async loadAxe(): Promise<AxeLike> {
    if (this.axe === null) {
      const module: unknown = await import('axe-core');
      const candidate = (module as { default?: unknown }).default ?? module;

      this.axe = candidate as AxeLike;
    }

    return this.axe;
  }

  protected countNodes(issues: readonly A11yIssue[]): number {
    return issues.reduce((total, issue) => total + issue.nodes.length, 0);
  }

  protected impactVariant(impact: A11yImpact | null): 'error' | 'info' | 'default' {
    if (impact === 'critical' || impact === 'serious') {
      return 'error';
    }

    return impact === 'moderate' ? 'info' : 'default';
  }

  /** Long DOM snippets make the list unreadable; the rest is one click away in devtools. */
  protected truncate(html: string): string {
    return html.length > 180 ? `${html.slice(0, 180)}…` : html;
  }
}
