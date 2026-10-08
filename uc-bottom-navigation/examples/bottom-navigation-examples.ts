import { Component, signal } from '@angular/core';

import { UcBottomNavigation } from '../uc-bottom-navigation';
import { UcBottomNavigationItem } from '../uc-bottom-navigation-item';

const frame = `
  .phone {
    display: flex;
    flex-direction: column;
    width: min(100%, 24rem);
    height: 14rem;
    border: 1px solid var(--uc-divider-color);
    border-radius: 1rem;
    overflow: hidden;
  }

  .phone__page {
    flex: 1;
  }
`;

/** A count on an item's icon, e.g. unread messages. Each example names its bar, since landmarks on a page must differ. */
@Component({
  selector: 'uc-bottom-navigation-badge-example',
  imports: [UcBottomNavigation, UcBottomNavigationItem],
  styles: frame,
  template: `
    <div class="phone">
      <div class="phone__page"></div>
      <uc-bottom-navigation label="Navigation with a badge">
        <button type="button" ucBottomNavigationItem icon="house" [active]="current() === 'home'" (click)="current.set('home')">Home</button>
        <button type="button" ucBottomNavigationItem icon="chat-circle" [badge]="3" [active]="current() === 'chat'" (click)="current.set('chat')">
          Messages
        </button>
        <button type="button" ucBottomNavigationItem icon="user" [active]="current() === 'me'" (click)="current.set('me')">Profile</button>
      </uc-bottom-navigation>
    </div>
  `,
})
export class BadgeExample {
  protected readonly current = signal('home');
}

/** Icons only: the labels stay for screen readers, and each item names itself with ariaLabel. */
@Component({
  selector: 'uc-bottom-navigation-icon-only-example',
  imports: [UcBottomNavigation, UcBottomNavigationItem],
  styles: frame,
  template: `
    <div class="phone">
      <div class="phone__page"></div>
      <uc-bottom-navigation label="Icon-only navigation" [showLabels]="false">
        <button type="button" ucBottomNavigationItem icon="house" ariaLabel="Home" [active]="current() === 'home'" (click)="current.set('home')">Home</button>
        <button type="button" ucBottomNavigationItem icon="magnifying-glass" ariaLabel="Search" [active]="current() === 'search'" (click)="current.set('search')">
          Search
        </button>
        <button type="button" ucBottomNavigationItem icon="gear" ariaLabel="Settings" [active]="current() === 'settings'" (click)="current.set('settings')">
          Settings
        </button>
      </uc-bottom-navigation>
    </div>
  `,
})
export class IconOnlyExample {
  protected readonly current = signal('home');
}
