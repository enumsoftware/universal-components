import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcButtonToggle } from './uc-button-toggle';
import { UcButtonToggleItem } from './uc-button-toggle-item';

@Component({
  imports: [UcButtonToggle, UcButtonToggleItem],
  template: `
    <uc-button-toggle [(value)]="selectedValue">
      <uc-button-toggle-item value="all">All</uc-button-toggle-item>
      <uc-button-toggle-item value="discounts" [disabled]="true">Discounts</uc-button-toggle-item>
      <uc-button-toggle-item value="favorites" ariaLabel="Favorites">
        <i class="ph-bold ph-star" aria-hidden="true"></i>
      </uc-button-toggle-item>
    </uc-button-toggle>
  `,
})
class UcButtonToggleHostComponent {
  selectedValue = 'all';
}

describe('UcButtonToggle', () => {
  let fixture: ComponentFixture<UcButtonToggleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcButtonToggleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UcButtonToggleHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should keep only one selected item at once', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-button-toggle-item__button');

    expect(buttons[0].classList.contains('uc-button-toggle-item__button--selected')).toBe(true);
    expect(buttons[2].classList.contains('uc-button-toggle-item__button--selected')).toBe(false);

    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue).toBe('favorites');
    expect(buttons[0].classList.contains('uc-button-toggle-item__button--selected')).toBe(false);
    expect(buttons[2].classList.contains('uc-button-toggle-item__button--selected')).toBe(true);
  });

  it('should ignore clicks on disabled items', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-button-toggle-item__button');

    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue).toBe('all');
    expect(buttons[1].classList.contains('uc-button-toggle-item__button--selected')).toBe(false);
  });

  it('should support projected content', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-button-toggle-item__button');
    const textButton = buttons[0] as HTMLButtonElement;
    const iconButton = buttons[2] as HTMLButtonElement;

    expect(textButton.textContent?.trim()).toBe('All');
    expect(iconButton.querySelector('i.ph-star')).not.toBeNull();
  });

  it('should expose aria-label when provided', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-button-toggle-item__button');
    const iconButton = buttons[2] as HTMLButtonElement;

    expect(iconButton.getAttribute('aria-label')).toBe('Favorites');
  });
});
