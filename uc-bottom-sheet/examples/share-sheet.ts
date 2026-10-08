import { Component, inject } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcBottomSheetRef } from '../uc-bottom-sheet-ref';

interface ShareAction {
  key: string;
  label: string;
  description: string;
  icon: string;
}

/** Sheet content: a list of actions, each of which dismisses the sheet with its key as the result. */
@Component({
  selector: 'uc-share-sheet',
  imports: [UcButton, UcPhosphorIcon],
  styles: `
    .title {
      margin: 0 0 0.5rem;
      padding-inline: 0.75rem;
      font-size: 1rem;
    }

    .actions {
      display: grid;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .action {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 0.75rem;
      border: 0;
      border-radius: var(--uc-menu-item-border-radius);
      background: none;
      color: var(--uc-foreground-color);
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .action:hover,
    .action:focus-visible {
      background: var(--uc-menu-item-hover-background);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      display: grid;
    }

    .action-description {
      color: var(--uc-paragraph-text-color);
      font-size: 0.875rem;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
  `,
  template: `
    <h2 class="title">Share this page</h2>
    <ul class="actions">
      @for (action of actions; track action.key) {
        <li>
          <button type="button" class="action" (click)="sheetRef.dismiss(action.key)">
            <uc-phosphor-icon class="action-icon" [icon]="action.icon" aria-hidden="true" />
            <span class="action-text">
              <span>{{ action.label }}</span>
              <span class="action-description">{{ action.description }}</span>
            </span>
          </button>
        </li>
      }
    </ul>
    <div class="footer">
      <uc-button text="Cancel" variant="secondary" (clicked)="sheetRef.dismiss()" />
    </div>
  `,
})
export class ShareSheet {
  readonly sheetRef = inject<UcBottomSheetRef<ShareSheet, string>>(UcBottomSheetRef);

  readonly actions: readonly ShareAction[] = [
    { key: 'link', label: 'Copy link', description: 'Paste it anywhere', icon: 'link' },
    { key: 'email', label: 'Email', description: 'Send it to a colleague', icon: 'envelope-simple' },
    { key: 'message', label: 'Message', description: 'Open your messaging app', icon: 'chat-circle' },
  ];
}
