import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcCheckbox } from './uc-checkbox';

describe('UcCheckbox', () => {
  let component: UcCheckbox;
  let fixture: ComponentFixture<UcCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcCheckbox);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'check-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the native input in step with the value', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(fixture.nativeElement.querySelector('.uc-checkbox').getAttribute('aria-hidden')).toBe('true');
  });

  it('toggles when its label is clicked', () => {
    fixture.componentRef.setInput('label', 'Accept');
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('label') as HTMLLabelElement).click();
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).checked).toBe(true);
  });

  it('does not change when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('label', 'Accept');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.checked()).toBe(false);
    expect(input.checked).toBe(false);
  });
});
