import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcRating } from './uc-rating';

describe('UcRating', () => {
  let fixture: ComponentFixture<UcRating>;
  let component: UcRating;

  const stars = () => [...fixture.nativeElement.querySelectorAll('[role="radio"]')] as HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcRating] }).compileComponents();
    fixture = TestBed.createComponent(UcRating);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ariaLabel', 'How was it?');
    fixture.detectChanges();
  });

  it('is a named radio group of five stars, reachable with one tab stop', () => {
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBe('How was it?');
    expect(stars()).toHaveLength(5);
    expect(stars()[2].getAttribute('aria-label')).toBe('3 of 5');
    expect(stars().map((star) => star.tabIndex)).toEqual([0, -1, -1, -1, -1]);
  });

  it('chooses the clicked star', () => {
    stars()[3].click();
    fixture.detectChanges();

    expect(component.value()).toBe(4);
    expect(stars()[3].getAttribute('aria-checked')).toBe('true');
    expect(stars()[3].tabIndex).toBe(0);
  });

  it('moves with the arrow keys, Home and End', () => {
    const press = (index: number, key: string) => {
      stars()[index].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    press(0, 'ArrowRight');
    expect(component.value()).toBe(2);
    press(1, 'End');
    expect(component.value()).toBe(5);
    press(4, 'ArrowLeft');
    expect(component.value()).toBe(4);
    press(3, 'Home');
    expect(component.value()).toBe(1);
  });

  it('does not change when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    stars()[2].click();

    expect(component.value()).toBeNull();
    expect(stars().every((star) => star.tabIndex === -1)).toBe(true);
  });

  it('shows a fractional value read-only, as one labelled image', () => {
    fixture.componentRef.setInput('readonly', true);
    component.value.set(3.6);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('[role="img"]') as HTMLElement;
    expect(image.getAttribute('aria-label')).toBe('3.6 of 5');
    expect(stars()).toHaveLength(0);
    const fills = [...fixture.nativeElement.querySelectorAll('.uc-rating__full')].map((el) => (el as HTMLElement).style.width);
    expect(fills).toEqual(['100%', '100%', '100%', '60%', '0%']);
  });
});
