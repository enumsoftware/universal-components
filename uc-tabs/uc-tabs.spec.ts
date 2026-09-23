import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTabs } from './uc-tabs';

describe('UcTabs', () => {
  let component: UcTabs;
  let fixture: ComponentFixture<UcTabs>;

  const tabButton = (label: string): HTMLButtonElement =>
    Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.uc-tabs__tab')).find(
      (button) => button.textContent?.trim() === label,
    )!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(UcTabs);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', [
      { key: 'overview', label: 'Overview' },
      { key: 'details', label: 'Details', disabled: true },
      { key: 'settings', label: 'Settings' },
    ]);
    fixture.componentRef.setInput('activeTab', 'overview');
    fixture.detectChanges();
  });

  it('should select an enabled tab on click', () => {
    tabButton('Settings').click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('settings');
    expect(tabButton('Settings').classList.contains('uc-tabs__tab--active')).toBe(true);
  });

  it('should disable the button of a disabled tab', () => {
    const button = tabButton('Details');

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('uc-tabs__tab--disabled')).toBe(true);
    expect(tabButton('Overview').disabled).toBe(false);
  });

  it('should not select a disabled tab', () => {
    component.selectTab('details');
    fixture.detectChanges();

    expect(component.activeTab()).toBe('overview');
  });

  it('should not render a tab with visible false', () => {
    fixture.componentRef.setInput('tabs', [
      { key: 'overview', label: 'Overview' },
      { key: 'details', label: 'Details', visible: false },
      { key: 'settings', label: 'Settings', visible: true },
    ]);
    fixture.detectChanges();

    expect(tabButton('Details')).toBeUndefined();
    expect(tabButton('Settings')).toBeDefined();
    expect(fixture.nativeElement.querySelectorAll('.uc-tabs__tab').length).toBe(2);
  });

  it('should not select a hidden tab', () => {
    fixture.componentRef.setInput('tabs', [
      { key: 'overview', label: 'Overview' },
      { key: 'details', label: 'Details', visible: false },
    ]);
    fixture.detectChanges();

    component.selectTab('details');

    expect(component.activeTab()).toBe('overview');
  });
});
