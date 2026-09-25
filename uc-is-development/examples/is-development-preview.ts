import { Component, isDevMode, signal } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcIsDevelopment } from '../uc-is-development';

/**
 * A login-page shortcut. The accounts here are placeholders with no passwords.
 */
@Component({
  selector: 'uc-is-development-preview',
  imports: [UcButton, UcIsDevelopment],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: var(--uc-foreground-color);
    }

    .dev-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px dashed var(--uc-warning-color, currentColor);
      border-radius: 0.75rem;
    }

    p {
      margin: 0;
      color: var(--uc-paragraph-text-color);
    }
  `,
  template: `
    <p>
      This build is in <strong>{{ devMode ? 'development' : 'production' }}</strong> mode, so the dev tools
      below are {{ devMode ? 'shown' : 'hidden' }}.
    </p>
    <div *ucIsDevelopment class="dev-tools">
      @for (account of accounts; track account.email) {
        <uc-button [text]="'Fill ' + account.label" variant="secondary" size="small" (clicked)="email.set(account.email)" />
      }
    </div>
    <p>Email: {{ email() || '(empty)' }}</p>
  `,
})
export class IsDevelopmentPreview {
  protected readonly devMode = isDevMode();
  protected readonly accounts = [
    { label: 'admin', email: 'admin@example.test' },
    { label: 'editor', email: 'editor@example.test' },
  ];
  protected readonly email = signal('');
}
