import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSegmentedToggle } from './uc-segmented-toggle';
import { UcSegmentedToggleItem } from './uc-segmented-toggle-item';

@Component({
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  template: `
    <uc-segmented-toggle [(value)]="selectedValue">
      <uc-segmented-toggle-item value="all">All</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="discounts" [disabled]="true">Discounts</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="favorites" ariaLabel="Favorites">
        <i class="ph-bold ph-star" aria-hidden="true"></i>
      </uc-segmented-toggle-item>
    </uc-segmented-toggle>
  `,
})
class UcSegmentedToggleHostComponent {
  selectedValue = 'all';
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

  it('should expose aria-label when provided', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-segmented-toggle-item__button');
    const iconButton = buttons[2] as HTMLButtonElement;

    expect(iconButton.getAttribute('aria-label')).toBe('Favorites');
  });
});
