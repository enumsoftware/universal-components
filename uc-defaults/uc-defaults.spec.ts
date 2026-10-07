import { Component, createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UcButton } from '../uc-button/uc-button';
import { UcPill } from '../uc-pill/uc-pill';
import { provideUcDefaults, UC_DEFAULTS } from './uc-defaults';

@Component({
  imports: [UcButton, UcPill],
  template: `
    <uc-button class="default" text="Save" />
    <uc-button class="explicit" text="Delete" variant="error" />
    <uc-pill text="New" />
  `,
})
class UcDefaultsHost {}

function render(): HTMLElement {
  const fixture = TestBed.createComponent(UcDefaultsHost);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('provideUcDefaults', () => {
  it('keeps the built-in variants when nothing is provided', () => {
    const host = render();

    expect(host.querySelector('.default button')?.classList).toContain('uc-primary');
  });

  it('uses the provided variant where the template does not set one', () => {
    TestBed.configureTestingModule({
      providers: [provideUcDefaults({ button: { variant: 'secondary' }, pill: { variant: 'info' } })],
    });

    const host = render();

    expect(host.querySelector('.default button')?.classList).toContain('uc-secondary');
    expect(host.querySelector('.uc-pill')?.classList).toContain('uc-pill--info');
  });

  it('lets a variant set on the element win over the default', () => {
    TestBed.configureTestingModule({ providers: [provideUcDefaults({ button: { variant: 'secondary' } })] });

    const host = render();

    expect(host.querySelector('.explicit button')?.classList).toContain('uc-error');
  });

  it('merges a route-level provider over the parent defaults per control', () => {
    TestBed.configureTestingModule({
      providers: [provideUcDefaults({ button: { variant: 'secondary' }, tabs: { variant: 'pills' } })],
    });
    const parent = TestBed.inject(EnvironmentInjector);

    const route = createEnvironmentInjector([provideUcDefaults({ button: { variant: 'text' } })], parent);

    expect(route.get(UC_DEFAULTS)).toEqual({ button: { variant: 'text' }, tabs: { variant: 'pills' } });
    route.destroy();
  });
});
