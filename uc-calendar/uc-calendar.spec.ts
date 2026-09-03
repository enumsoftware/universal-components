import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcCalendar } from './uc-calendar';
import { todayPlainDate } from './uc-calendar-date';

describe('UcCalendar', () => {
  let component: UcCalendar;
  let fixture: ComponentFixture<UcCalendar>;

  const selectedDay = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('.uc-calendar__day--selected');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show today\'s month with nothing selected', () => {
    const today = todayPlainDate();

    expect(component.resolvedYear()).toBe(today.year);
    expect(component.resolvedMonth()).toBe(today.month);
    expect(selectedDay()).toBeNull();
  });

  it('should follow the selected date when no view month is pinned', () => {
    fixture.componentRef.setInput('selectedDate', '2026-08-13');
    fixture.detectChanges();

    expect(component.resolvedYear()).toBe(2026);
    expect(component.resolvedMonth()).toBe(8);

    const day = selectedDay();
    expect(day).not.toBeNull();
    expect(day?.textContent?.trim()).toBe('13');
    expect(day?.classList.contains('uc-calendar__day--other-month')).toBe(false);
  });

  it('should follow the range start in range mode', () => {
    fixture.componentRef.setInput('mode', 'range');
    fixture.componentRef.setInput('rangeStart', '2026-10-05');
    fixture.componentRef.setInput('rangeEnd', '2026-10-09');
    fixture.detectChanges();

    expect(component.resolvedYear()).toBe(2026);
    expect(component.resolvedMonth()).toBe(10);

    const start = fixture.nativeElement.querySelector('.uc-calendar__day--range-start');
    expect(start?.textContent?.trim()).toBe('5');
  });

  it('should let a pinned view month win over the selection', () => {
    fixture.componentRef.setInput('selectedDate', '2026-08-13');
    fixture.componentRef.setInput('viewYear', 2026);
    fixture.componentRef.setInput('viewMonth', 10);
    fixture.detectChanges();

    expect(component.resolvedMonth()).toBe(10);
    // August 13 is outside the rendered October grid, so nothing is marked.
    expect(selectedDay()).toBeNull();
  });

  it('should fall back to today for an unparseable date', () => {
    const today = todayPlainDate();
    fixture.componentRef.setInput('selectedDate', '2026-0');
    fixture.detectChanges();

    expect(component.resolvedYear()).toBe(today.year);
    expect(component.resolvedMonth()).toBe(today.month);
    expect(selectedDay()).toBeNull();
  });
});
