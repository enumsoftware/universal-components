import { Component, input, linkedSignal, signal } from '@angular/core';

import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcBottomSheet, type UcBottomSheetSnapPoint } from '../uc-bottom-sheet';

interface Line {
  code: string;
  name: string;
}

/**
 * A phone-sized map with the list of lines in a sheet over it. The map's stops stay clickable while the sheet
 * is open at any height - nothing traps focus or covers the page.
 */
@Component({
  selector: 'uc-inline-bottom-sheet-preview',
  imports: [UcBottomSheet, UcPhosphorIcon],
  styles: `
    .phone {
      position: relative;
      width: min(100%, 24rem);
      height: 36rem;
      margin-inline: auto;
      border: 1px solid var(--uc-divider-color);
      border-radius: 1rem;
      overflow: hidden;
      background:
        linear-gradient(90deg, oklch(from var(--uc-foreground-color) l c h / 0.06) 1px, transparent 1px) 0 0 / 2rem 2rem,
        linear-gradient(oklch(from var(--uc-foreground-color) l c h / 0.06) 1px, transparent 1px) 0 0 / 2rem 2rem,
        var(--uc-background-color);
    }

    .stop {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border: 0;
      border-radius: 999px;
      background: var(--uc-primary-color);
      color: var(--uc-inverse-foreground-color);
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .status {
      position: absolute;
      inset: 0.75rem 0.75rem auto;
      margin: 0;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--uc-card-background-color);
      color: var(--uc-foreground-color);
      font-size: 0.85rem;
    }

    .title {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }

    .lines {
      display: grid;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .line {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem;
      border: 0;
      border-radius: var(--uc-menu-item-border-radius);
      background: none;
      color: var(--uc-foreground-color);
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .line:hover,
    .line:focus-visible {
      background: var(--uc-menu-item-hover-background);
    }

    .code {
      min-width: 2.25rem;
      padding: 0.125rem 0.375rem;
      border-radius: 0.375rem;
      background: var(--uc-primary-color);
      color: var(--uc-inverse-foreground-color);
      font-weight: 600;
      text-align: center;
    }
  `,
  template: `
    <div class="phone">
      <p class="status" aria-live="polite">{{ status() }}</p>
      <button type="button" class="stop" style="top: 30%; left: 20%" (click)="select('Stop Pile')">
        <uc-phosphor-icon icon="bus" aria-hidden="true" /> Pile
      </button>
      <button type="button" class="stop" style="top: 42%; left: 58%" (click)="select('Stop Gruž')">
        <uc-phosphor-icon icon="bus" aria-hidden="true" /> Gruž
      </button>

      <uc-bottom-sheet
        [label]="label()"
        [handleLabel]="handleLabel()"
        [snapPoints]="snapPoints"
        [snapLabels]="snapLabels"
        [(snapIndex)]="index"
      >
        <h2 ucBottomSheetHeader class="title">{{ label() }}</h2>
        <ul class="lines">
          @for (line of lines; track line.code) {
            <li>
              <button type="button" class="line" (click)="select('Line ' + line.code)">
                <span class="code">{{ line.code }}</span>
                <span>{{ line.name }}</span>
              </button>
            </li>
          }
        </ul>
      </uc-bottom-sheet>
    </div>
  `,
})
export class InlineBottomSheetPreview {
  readonly label = input<string>('Bus lines');
  readonly handleLabel = input<string>('Sheet height');
  readonly snapIndex = input<number>(0);

  readonly index = linkedSignal(() => this.snapIndex());
  readonly status = signal('Tap a stop, or drag the sheet.');

  readonly snapPoints: readonly UcBottomSheetSnapPoint[] = ['5.5rem', '50%', '85%'];
  readonly snapLabels = ['Collapsed', 'Half', 'Expanded'];

  readonly lines: readonly Line[] = [
    { code: '1A', name: 'Pile - Gruž' },
    { code: '2', name: 'Pile - Ploče' },
    { code: '3', name: 'Pile - Lapad' },
    { code: '4', name: 'Pile - Babin Kuk' },
    { code: '6', name: 'Dubrovnik - Babin Kuk' },
    { code: '7', name: 'Lapad - Mokošica' },
    { code: '8', name: 'Pile - Zaton' },
    { code: '9', name: 'Dubrovnik - Orašac' },
    { code: '10', name: 'Dubrovnik - Cavtat' },
    { code: '11', name: 'Dubrovnik - Molunat' },
  ];

  select(what: string): void {
    this.status.set(`Selected: ${what}`);
  }
}
