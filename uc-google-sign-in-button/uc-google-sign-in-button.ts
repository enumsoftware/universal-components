import { Component, computed, input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'uc-google-sign-in-button',
  templateUrl: './uc-google-sign-in-button.html',
  styleUrl: './uc-google-sign-in-button.css',
})
export class UcGoogleSignInButton {
  returnUrl = input<string | undefined>(undefined);

  readonly googleSignInUrl = computed(() => {
    const base = `${environment.apiUrl}/api/auth/google`;
    const returnUrl = this.returnUrl();
    return returnUrl ? `${base}?returnUrl=${encodeURIComponent(returnUrl)}` : base;
  });
}
