import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-google-sign-in-button',
  templateUrl: './uc-google-sign-in-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-google-sign-in-button.css',
})
export class UcGoogleSignInButton {
  returnUrl = input<string | undefined>(undefined);
  apiBaseUrl = input<string>('/api');

  readonly googleSignInUrl = computed(() => {
    const normalizedBase = this.apiBaseUrl().replace(/\/$/, '');
    const base = `${normalizedBase}/auth/google`;
    const returnUrl = this.returnUrl();
    return returnUrl ? `${base}?returnUrl=${encodeURIComponent(returnUrl)}` : base;
  });
}
