import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcTablePill } from './uc-table-pill';

describe('UcTablePill', () => {
  let component: UcTablePill;
  let fixture: ComponentFixture<UcTablePill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTablePill],
    }).compileComponents();

    fixture = TestBed.createComponent(UcTablePill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant as info', () => {
    expect(component.variant()).toBe('info');
  });

  it('should apply correct class for valid variant', () => {
    fixture.componentRef.setInput('variant', 'valid');
    fixture.detectChanges();
    const pill = fixture.nativeElement.querySelector('.pill');
    expect(pill.classList.contains('pill--valid')).toBe(true);
  });

  it('should apply correct class for error variant', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();
    const pill = fixture.nativeElement.querySelector('.pill');
    expect(pill.classList.contains('pill--error')).toBe(true);
  });
});
