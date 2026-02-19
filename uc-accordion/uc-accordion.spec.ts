import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UcAccordion } from './uc-accordion';
import { UcAccordionItem } from './uc-accordion-item';

describe('UcAccordion', () => {
  let component: UcAccordion;
  let fixture: ComponentFixture<UcAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcAccordion, UcAccordionItem, BrowserAnimationsModule],
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
