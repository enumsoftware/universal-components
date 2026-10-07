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

  const dayButton = (dayNumber: string): HTMLButtonElement | undefined => {
    const days: HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.uc-calendar__day'),
    );
    return days.find((el) => el.textContent?.trim() === dayNumber);
  };

  it('should select a day on click even with no daySelect listener attached', () => {
    fixture.componentRef.setInput('selectedDate', '2026-08-13');
    fixture.detectChanges();

    dayButton('20')?.click();
    fixture.detectChanges();

    expect(component.selectedDate()).toBe('2026-08-20');
    expect(selectedDay()?.textContent?.trim()).toBe('20');
  });

  it('should still emit daySelect on click', () => {
    fixture.componentRef.setInput('selectedDate', '2026-08-13');
    fixture.detectChanges();

    const emitted: string[] = [];
    component.daySelect.subscribe((day) => emitted.push(day.iso));

    dayButton('20')?.click();

    expect(emitted).toEqual(['2026-08-20']);
  });

  const weekdayHeadings = (): string[] =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.uc-calendar__weekday-label'))
      .map((el) => el.textContent?.trim() ?? '');

  it('should start US English weeks on Sunday', () => {
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('selectedDate', '2026-09-07');
    fixture.detectChanges();

    expect(weekdayHeadings()[0]).toBe('Sun');
    // September 2026 starts on a Tuesday: two days of August lead the grid.
    expect(component.calendarDays()[0].iso).toBe('2026-08-30');
  });

  it('should use Croatian names and Monday-first weeks for hr-HR', () => {
    fixture.componentRef.setInput('locale', 'hr-HR');
    fixture.componentRef.setInput('selectedDate', '2026-09-07');
    fixture.detectChanges();

    expect(weekdayHeadings()).toEqual(['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']);
    expect(component.calendarDays()[0].iso).toBe('2026-08-31');
    expect(selectedDay()?.getAttribute('aria-label')).toBe('ponedjeljak, 7. rujna 2026.');
  });

  it('should let firstDayOfWeek override the locale', () => {
    fixture.componentRef.setInput('locale', 'hr-HR');
    fixture.componentRef.setInput('firstDayOfWeek', 7);
    fixture.detectChanges();

    expect(weekdayHeadings()[0]).toBe('Ned');
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
