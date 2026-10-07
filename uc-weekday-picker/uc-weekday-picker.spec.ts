import { Component, LOCALE_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, FormField, requiredError, validate } from '@angular/forms/signals';

import { provideUcDateLocale } from '../uc-calendar/uc-date-locale';
import { UcWeekdayPicker } from './uc-weekday-picker';

describe('UcWeekdayPicker', () => {
  let fixture: ComponentFixture<UcWeekdayPicker>;

  const create = async (providers: unknown[] = []) => {
    await TestBed.configureTestingModule({ imports: [UcWeekdayPicker], providers: providers as never[] }).compileComponents();
    fixture = TestBed.createComponent(UcWeekdayPicker);
    fixture.componentRef.setInput('id', 'days');
    fixture.detectChanges();
  };

  const buttons = (): HTMLButtonElement[] =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));

  it('should start with Sunday in US English', async () => {
    await create();

    expect(buttons().map((button) => button.textContent?.trim())).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(buttons()[0].getAttribute('aria-label')).toBe('Sunday');
  });

  it('should start with Monday and use Croatian names under LOCALE_ID hr-HR', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);

    expect(buttons()[0].textContent?.trim()).toBe('Pon');
    expect(buttons()[0].getAttribute('aria-label')).toBe('Ponedjeljak');
    expect(buttons()[6].getAttribute('aria-label')).toBe('Nedjelja');
  });

  it('should let provideUcDateLocale and the inputs choose the first day', async () => {
    await create([provideUcDateLocale({ locale: 'en-GB' })]);
    expect(buttons()[0].getAttribute('aria-label')).toBe('Monday');

    fixture.componentRef.setInput('firstDayOfWeek', 6);
    fixture.detectChanges();
    expect(buttons()[0].getAttribute('aria-label')).toBe('Saturday');
  });

  it('should toggle days and keep the value sorted', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);
    const picker = fixture.componentInstance;

    buttons()[4].click(); // Friday
    buttons()[0].click(); // Monday
    fixture.detectChanges();
    expect(picker.value()).toEqual([1, 5]);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('false');

    buttons()[0].click();
    fixture.detectChanges();
    expect(picker.value()).toEqual([5]);
  });

  it('should not change while disabled', async () => {
    await create();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    fixture.componentInstance.toggle(3);
    expect(fixture.componentInstance.value()).toEqual([]);
    expect(buttons().every((button) => button.disabled)).toBe(true);
  });

  it('should name the group by its label, else by the locale text', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);
    const group = () => (fixture.nativeElement as HTMLElement).querySelector('[role="group"]')!;
    expect(group().getAttribute('aria-label')).toBe('Dani u tjednu');

    fixture.componentRef.setInput('label', 'Vozi');
    fixture.detectChanges();
    expect(group().getAttribute('aria-labelledby')).toBe('days-label');
    expect((fixture.nativeElement as HTMLElement).querySelector('#days-label')?.textContent).toBe('Vozi');
  });

  it('should work as a signal forms field and show its errors once touched', async () => {
    @Component({
      imports: [UcWeekdayPicker, FormField],
      template: `<uc-weekday-picker id="days" [formField]="daysForm.days" />`,
    })
    class HostComponent {
      readonly model = signal({ days: [] as number[] });
      // required() does not count an empty array as missing, so the rule checks the length itself.
      readonly daysForm = form(this.model, (path) =>
        validate(path.days, ({ value }) => (value().length > 0 ? null : requiredError({ message: 'Pick a day' }))),
      );
    }

    const host = TestBed.createComponent(HostComponent);
    host.detectChanges();
    const element: HTMLElement = host.nativeElement;
    const first = element.querySelector<HTMLButtonElement>('button')!;
    expect(element.querySelector('.uc-weekday-picker__error')).toBeNull();

    first.dispatchEvent(new FocusEvent('blur'));
    host.detectChanges();
    expect(element.querySelector('.uc-weekday-picker__error')?.textContent).toBe('Pick a day');

    first.click();
    host.detectChanges();
    expect(host.componentInstance.model().days).toEqual([7]);
    expect(element.querySelector('.uc-weekday-picker__error')).toBeNull();
  });
});
