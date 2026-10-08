import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcBottomNavigation } from './uc-bottom-navigation';
import { UcBottomNavigationItem } from './uc-bottom-navigation-item';

@Component({
  imports: [UcBottomNavigation, UcBottomNavigationItem],
  template: `
    <uc-bottom-navigation label="Main navigation" [showLabels]="showLabels()" [fixed]="fixed()">
      <a href="/lines" ucBottomNavigationItem icon="bus" [active]="current() === 'lines'">Lines</a>
      <a href="/stops" ucBottomNavigationItem icon="map-pin" [badge]="badge()" [active]="current() === 'stops'">Stops</a>
      <button type="button" ucBottomNavigationItem icon="info" ariaLabel="Info" (click)="current.set('info')">Info</button>
    </uc-bottom-navigation>
  `,
})
class HostComponent {
  readonly current = signal('lines');
  readonly showLabels = signal(true);
  readonly fixed = signal(false);
  readonly badge = signal<number | null>(null);
}

describe('UcBottomNavigation', () => {
  let fixture: ComponentFixture<HostComponent>;
  const items = () => [...fixture.nativeElement.querySelectorAll('.uc-bottom-navigation-item')] as HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should name the navigation landmark', () => {
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;

    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
    expect(items().length).toBe(3);
  });

  it('should mark only the current item as the page', () => {
    expect(items().map((item) => item.getAttribute('aria-current'))).toEqual(['page', null, null]);

    fixture.componentInstance.current.set('stops');
    fixture.detectChanges();

    expect(items().map((item) => item.getAttribute('aria-current'))).toEqual([null, 'page', null]);
    expect(items()[1].classList).toContain('uc-bottom-navigation-item--active');
  });

  it('should leave navigation to the app: links keep their href and buttons their click handler', () => {
    expect(items()[0].getAttribute('href')).toBe('/lines');

    items()[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.current()).toBe('info');
    expect(items()[2].getAttribute('aria-current')).toBeNull();
  });

  it('should keep hidden labels for screen readers', () => {
    fixture.componentInstance.showLabels.set(false);
    fixture.detectChanges();

    const label = items()[0].querySelector('.uc-bottom-navigation-item__label') as HTMLElement;
    expect(label.classList).toContain('uc-bottom-navigation-item__label--hidden');
    expect(label.textContent?.trim()).toBe('Lines');
    expect(items()[2].getAttribute('aria-label')).toBe('Info');
  });

  it('should show a badge only when it has one', () => {
    expect(fixture.nativeElement.querySelector('.uc-bottom-navigation-item__badge')).toBeNull();

    fixture.componentInstance.badge.set(3);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.uc-bottom-navigation-item__badge')?.textContent?.trim()).toBe('3');
  });

  it('should always show the bar without a width to hide from', () => {
    const host = fixture.nativeElement.querySelector('uc-bottom-navigation') as HTMLElement;

    expect(host.classList).not.toContain('uc-bottom-navigation--hidden');
  });

  it('should pin the bar to the viewport when fixed', () => {
    const host = fixture.nativeElement.querySelector('uc-bottom-navigation') as HTMLElement;
    expect(host.classList).not.toContain('uc-bottom-navigation--fixed');

    fixture.componentInstance.fixed.set(true);
    fixture.detectChanges();

    expect(host.classList).toContain('uc-bottom-navigation--fixed');
  });
});
