import { Component, input, signal } from '@angular/core';

import { UcBottomNavigation } from '../uc-bottom-navigation';
import { UcBottomNavigationItem } from '../uc-bottom-navigation-item';

interface Destination {
  key: string;
  label: string;
  icon: string;
}

/**
 * A phone-sized frame with a bar of four destinations. The items are plain buttons here; in an app they are
 * usually `<a ucBottomNavigationItem routerLink="...">`.
 */
@Component({
  selector: 'uc-bottom-navigation-preview',
  imports: [UcBottomNavigation, UcBottomNavigationItem],
  styles: `
    .phone {
      display: flex;
      flex-direction: column;
      width: min(100%, 24rem);
      height: 22rem;
      border: 1px solid var(--uc-divider-color);
      border-radius: 1rem;
      overflow: hidden;
      background: var(--uc-background-color);
    }

    .phone__page {
      flex: 1;
      display: grid;
      place-items: center;
      color: var(--uc-paragraph-text-color);
    }
  `,
  template: `
    <div class="phone">
      <div class="phone__page">{{ current() }}</div>
      <uc-bottom-navigation [label]="label()" [hideFrom]="hideFrom()" [fixed]="fixed()" [showLabels]="showLabels()">
        @for (destination of destinations; track destination.key) {
          <button
            type="button"
            ucBottomNavigationItem
            [icon]="destination.icon"
            [active]="current() === destination.label"
            [ariaLabel]="showLabels() ? null : destination.label"
            (click)="current.set(destination.label)"
          >
            {{ destination.label }}
          </button>
        }
      </uc-bottom-navigation>
    </div>
  `,
})
export class BottomNavigationPreview {
  readonly label = input<string | null>('Main navigation');
  readonly hideFrom = input<number | null>(null);
  readonly fixed = input<boolean>(false);
  readonly showLabels = input<boolean>(true);

  protected readonly destinations: Destination[] = [
    { key: 'lines', label: 'Lines', icon: 'bus' },
    { key: 'stops', label: 'Stops', icon: 'map-pin' },
    { key: 'favourites', label: 'Favourites', icon: 'star' },
    { key: 'info', label: 'Info', icon: 'info' },
  ];

  protected readonly current = signal('Lines');
}
