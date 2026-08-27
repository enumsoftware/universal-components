import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcAccordion } from './uc-accordion';
import { UcAccordionItem } from './uc-accordion-item';

describe('UcAccordion', () => {
  let component: UcAccordion;
  let fixture: ComponentFixture<UcAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcAccordion, UcAccordionItem],
    }).compileComponents();

    fixture = TestBed.createComponent(UcAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items content children', () => {
    expect(component.items).toBeDefined();
  });
});
