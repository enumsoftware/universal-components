import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

import { UcTabs } from './uc-tabs';

describe('UcTabs', () => {
  let component: UcTabs;
  let fixture: ComponentFixture<UcTabs>;
  let breakpoint: BehaviorSubject<BreakpointState>;

  /** The test DOM has no layout, so sizes are set by hand and the measurement rerun. */
  const layOut = (contentWidth: number, barWidth: number) => {
    const strip: HTMLElement = fixture.nativeElement.querySelector('.uc-tabs__strip');
    const bar = strip.parentElement!;
    Object.defineProperty(strip, 'scrollWidth', { configurable: true, value: contentWidth });
    Object.defineProperty(strip, 'clientWidth', { configurable: true, value: barWidth });
    Object.defineProperty(bar, 'clientWidth', { configurable: true, value: barWidth });
    component.updateOverflowState();
    fixture.detectChanges();
    return strip;
  };

  const setMobile = (matches: boolean) => {
    breakpoint.next({ matches, breakpoints: {} });
    fixture.detectChanges();
  };

  const tabButton = (label: string): HTMLButtonElement =>
    Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.uc-tabs__tab')).find(
      (button) => button.textContent?.trim() === label,
    )!;

  beforeEach(async () => {
    breakpoint = new BehaviorSubject<BreakpointState>({ matches: false, breakpoints: {} });

    await TestBed.configureTestingModule({
      imports: [UcTabs],
      providers: [{ provide: BreakpointObserver, useValue: { observe: () => breakpoint } }],
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

  it('should show neither arrows nor a dropdown when the tabs fit', () => {
    layOut(300, 600);

    expect(fixture.nativeElement.querySelector('.uc-tabs__arrow')).toBeNull();
    expect(fixture.nativeElement.querySelector('uc-select')).toBeNull();
  });

  it('should show scroll arrows when the tabs overflow on desktop', () => {
    layOut(900, 600);

    expect(fixture.nativeElement.querySelectorAll('.uc-tabs__arrow').length).toBe(2);
    expect(fixture.nativeElement.querySelector('uc-select')).toBeNull();
  });

  it('should disable the start arrow at the start and enable the end arrow', () => {
    layOut(900, 600);

    const start: HTMLButtonElement = fixture.nativeElement.querySelector('.uc-tabs__arrow--start');
    const end: HTMLButtonElement = fixture.nativeElement.querySelector('.uc-tabs__arrow--end');
    expect(start.disabled).toBe(true);
    expect(end.disabled).toBe(false);
  });

  it('should scroll the strip when an arrow is clicked', () => {
    const strip = layOut(900, 600);
    const scrollBy = vi.fn();
    strip.scrollBy = scrollBy as unknown as HTMLElement['scrollBy'];

    fixture.nativeElement.querySelector('.uc-tabs__arrow--end').click();

    expect(scrollBy).toHaveBeenCalledWith({ left: 480, behavior: 'smooth' });
  });

  it('should collapse into a dropdown when the tabs overflow on mobile', () => {
    setMobile(true);
    layOut(900, 360);

    expect(fixture.nativeElement.querySelector('uc-select')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.uc-tabs__arrow')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.uc-tabs').classList.contains('uc-tabs--collapsed'),
    ).toBe(true);
  });

  it('should keep the tabs on mobile when they fit', () => {
    setMobile(true);
    layOut(300, 360);

    expect(fixture.nativeElement.querySelector('uc-select')).toBeNull();
  });

  it('should offer visible tabs in the dropdown and keep disabled ones disabled', () => {
    fixture.componentRef.setInput('tabs', [
      { key: 'overview', label: 'Overview' },
      { key: 'details', label: 'Details', disabled: true },
      { key: 'billing', label: 'Billing', visible: false },
    ]);
    fixture.detectChanges();

    expect(component.selectOptions()).toEqual([
      { value: 'overview', label: 'Overview', disabled: undefined },
      { value: 'details', label: 'Details', disabled: true },
    ]);
  });

  it('should select a tab picked from the dropdown, but not a disabled one', () => {
    component.onSelectValueChange('settings');
    expect(component.activeTab()).toBe('settings');

    component.onSelectValueChange('details');
    expect(component.activeTab()).toBe('settings');
  });
});
