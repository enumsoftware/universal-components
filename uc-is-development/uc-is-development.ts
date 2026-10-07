import { Directive, inject, isDevMode, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Renders its content only in development builds (`ng serve`, or a build without optimization), for
 * tools such as a "fill test account" dropdown on a login page:
 *
 * ```html
 * <uc-select *ucIsDevelopment [options]="devAccounts" (valueChange)="fill($event)" />
 * ```
 *
 * This hides UI, it does not remove code. The template and everything the component references are
 * still in the production bundle, where anyone can read them. Never put secrets such as passwords in
 * a component.
 */
@Directive({
  selector: '[ucIsDevelopment]',
})
export class UcIsDevelopment {
  constructor() {
    if (isDevMode()) {
      inject(ViewContainerRef).createEmbeddedView(inject(TemplateRef));
    }
  }
}
