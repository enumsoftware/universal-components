import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcIsDevelopment } from './uc-is-development';

@Component({
  imports: [UcIsDevelopment],
  template: `
    <p class="always">Sign in</p>
    <p *ucIsDevelopment class="dev-tools">Fill test account</p>
  `,
})
class UcIsDevelopmentHost {}

describe('UcIsDevelopment', () => {
  let fixture: ComponentFixture<UcIsDevelopmentHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcIsDevelopmentHost] }).compileComponents();
    fixture = TestBed.createComponent(UcIsDevelopmentHost);
    fixture.detectChanges();
  });

  // Tests run in dev mode. The production branch is Angular's own isDevMode(), which returns false
  // once a production build defines ngDevMode as false.
  it('renders its content in development mode', () => {
    expect(fixture.nativeElement.querySelector('.dev-tools')?.textContent).toBe('Fill test account');
    expect(fixture.nativeElement.querySelector('.always')).not.toBeNull();
  });
});
