/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcIconButton } from './uc-icon-button';

describe('UcImageButton', () => {
  let component: UcIconButton;
  let fixture: ComponentFixture<UcIconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcIconButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcIconButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose an accessible name when label is provided', () => {
    fixture.componentRef.setInput('label', 'Edit item');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBe('Edit item');
    expect(button.getAttribute('title')).toBe('Edit item');
  });

  it('should not render an empty title when no label is provided', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.hasAttribute('title')).toBeFalse();
    expect(button.hasAttribute('aria-label')).toBeFalse();
  });
});
