import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSelect } from './uc-select';

describe('UcSelect', () => {
  let component: UcSelect<string>;
  let fixture: ComponentFixture<UcSelect<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSelect],
    }).compileComponents();

    fixture = TestBed.createComponent<UcSelect<string>>(UcSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'select-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label when provided and hideLabel is false', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.uc-select-label');
    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(label?.textContent).toContain('Country');
    expect(label?.id).toBe('select-1-label');
    expect(trigger.getAttribute('aria-labelledby')).toBe('select-1-label');
    expect(trigger.getAttribute('aria-label')).toBeNull();
  });

  it('should name the trigger from the label when hideLabel is true', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.componentRef.setInput('hideLabel', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(fixture.nativeElement.querySelector('label.uc-select-label')).toBeFalsy();
    expect(trigger.getAttribute('aria-label')).toBe('Country');
    expect(trigger.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should fall back to the placeholder when there is no label at all', () => {
    fixture.componentRef.setInput('placeholder', 'Select a country');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(trigger.getAttribute('aria-label')).toBe('Select a country');
    expect(trigger.getAttribute('aria-labelledby')).toBeNull();
  });
});
