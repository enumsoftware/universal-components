import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideUcDateLocale } from '../uc-calendar/uc-date-locale';
import { UcDateTimePicker } from './uc-date-time-picker';

describe('UcDateTimePicker', () => {
  let fixture: ComponentFixture<UcDateTimePicker>;

  const create = async (providers: unknown[] = []) => {
    await TestBed.configureTestingModule({ imports: [UcDateTimePicker], providers: providers as never[] }).compileComponents();
    fixture = TestBed.createComponent(UcDateTimePicker);
    fixture.componentRef.setInput('id', 'picker');
  };

  const shownText = (): string =>
    (fixture.nativeElement as HTMLElement).querySelector('.uc-date-time-picker__trigger')?.textContent?.trim() ?? '';

  it('should keep the English format by default', async () => {
    await create();
    fixture.componentRef.setInput('value', '2026-09-07');
    fixture.detectChanges();

    expect(shownText()).toBe('Sep 7, 2026');
  });

  it('should follow Angular LOCALE_ID for format, placeholder and texts', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);
    fixture.detectChanges();
    expect(shownText()).toBe('Odaberite datum');

    fixture.componentRef.setInput('value', '2026-09-07');
    fixture.detectChanges();
    expect(shownText()).toBe('7. ruj 2026.');
    expect(fixture.componentInstance.texts().today).toBe('Danas');
    expect(fixture.componentInstance.monthNames()[8]).toBe('Rujan');
  });

  it('should apply a custom date format', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);
    fixture.componentRef.setInput('value', '2026-09-07');
    fixture.componentRef.setInput('dateFormat', { day: '2-digit', month: '2-digit', year: 'numeric' });
    fixture.detectChanges();

    expect(shownText()).toBe('07. 09. 2026.');
  });

  it('should show the time in the locale clock', async () => {
    await create([{ provide: LOCALE_ID, useValue: 'hr-HR' }]);
    fixture.componentRef.setInput('showTime', true);
    fixture.componentRef.setInput('value', '2026-09-07T14:05');
    fixture.detectChanges();

    expect(shownText()).toBe('7. ruj 2026. 14:05');
  });

  it('should let provideUcDateLocale and the labels input override texts', async () => {
    await create([provideUcDateLocale({ locale: 'hr-HR', labels: { today: 'Danas je' } })]);
    fixture.componentRef.setInput('labels', { save: 'Potvrdi' });
    fixture.detectChanges();

    expect(fixture.componentInstance.resolvedLocale()).toBe('hr-HR');
    expect(fixture.componentInstance.texts().today).toBe('Danas je');
    expect(fixture.componentInstance.texts().save).toBe('Potvrdi');
    expect(fixture.componentInstance.texts().cancel).toBe('Odustani');
  });
});
