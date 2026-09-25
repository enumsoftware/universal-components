import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSegmentedToggle, type UcSegmentedToggleVariant } from './uc-segmented-toggle';
import { UcSegmentedToggleItem } from './uc-segmented-toggle-item';

@Component({
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  template: `
    <uc-segmented-toggle [(value)]="selectedValue" [variant]="variant()">
      <uc-segmented-toggle-item value="all" icon="list">All</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="discounts" [disabled]="true">
        Discounts
        <span ucSegmentedTogglePrefix class="test-prefix"></span>
      </uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="favorites" ariaLabel="Favorites">
        <i class="ph-bold ph-star" aria-hidden="true"></i>
      </uc-segmented-toggle-item>
    </uc-segmented-toggle>
  `,
})
class UcSegmentedToggleHostComponent {
  selectedValue = 'all';
  variant = signal<UcSegmentedToggleVariant>('default');
}

describe('UcSegmentedToggle', () => {
  let fixture: ComponentFixture<UcSegmentedToggleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSegmentedToggleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UcSegmentedToggleHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should keep only one selected item at once', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');

    expect(buttons[0].classList.contains('uc-segmented-toggle-item__button--selected')).toBe(true);
    expect(buttons[2].classList.contains('uc-segmented-toggle-item__button--selected')).toBe(false);

    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue).toBe('favorites');
    expect(buttons[0].classList.contains('uc-segmented-toggle-item__button--selected')).toBe(false);
    expect(buttons[2].classList.contains('uc-segmented-toggle-item__button--selected')).toBe(true);
  });

  it('should ignore clicks on disabled items', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');

    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue).toBe('all');
    expect(buttons[1].classList.contains('uc-segmented-toggle-item__button--selected')).toBe(false);
  });

  it('should support projected content', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');
    const textButton = buttons[0] as HTMLButtonElement;
    const iconButton = buttons[2] as HTMLButtonElement;

    expect(textButton.textContent?.trim()).toBe('All');
    expect(iconButton.querySelector('i.ph-star')).not.toBeNull();
  });

  it('should mark the group and every item as pills in the pills variant', () => {
    fixture.componentInstance.variant.set('pills');
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('.uc-segmented-toggle');
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button'),
    );
    expect(group.classList.contains('uc-segmented-toggle--pills')).toBe(true);
    expect(buttons.every((button) => button.classList.contains('uc-segmented-toggle-item__button--pills'))).toBe(true);
  });

  it('should not use pills by default', () => {
    const group = fixture.nativeElement.querySelector('.uc-segmented-toggle');
    const button = fixture.nativeElement.querySelector('.uc-segmented-toggle-item__button');
    expect(group.classList.contains('uc-segmented-toggle--pills')).toBe(false);
    expect(button.classList.contains('uc-segmented-toggle-item__button--pills')).toBe(false);
  });

  it('should render an icon before the text when icon is set', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.uc-segmented-toggle-item__button');
    const icon = button.querySelector('.uc-segmented-toggle-item__icon');

    expect(icon?.querySelector('.ph-list.ph-bold')).not.toBeNull();
    expect(button.firstElementChild).toBe(icon);
    expect(button.textContent?.trim()).toBe('All');
  });

  it('should not render an icon when icon is not set', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');

    expect(buttons[1].querySelector('.uc-segmented-toggle-item__icon')).toBeNull();
  });

  it('should place projected prefix content before the text', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');
    const button = buttons[1] as HTMLButtonElement;

    expect(button.firstElementChild?.classList.contains('test-prefix')).toBe(true);
    expect(button.textContent?.trim()).toBe('Discounts');
  });

  it('should expose aria-label when provided', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');
    const iconButton = buttons[2] as HTMLButtonElement;

    expect(iconButton.getAttribute('aria-label')).toBe('Favorites');
  });
});
