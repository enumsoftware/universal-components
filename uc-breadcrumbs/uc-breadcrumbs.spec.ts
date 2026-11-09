import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcBreadcrumb, UcBreadcrumbs, UcBreadcrumbSeparator, type UcBreadcrumbsVariant } from './uc-breadcrumbs';

@Component({
  imports: [UcBreadcrumbs, UcBreadcrumb],
  template: `
    <uc-breadcrumbs
      [variant]="variant()"
      [maxItems]="maxItems()"
      [itemsBeforeCollapse]="before()"
      [itemsAfterCollapse]="after()"
    >
      @for (crumb of crumbs(); track crumb; let last = $last) {
        @if (last) {
          <span *ucBreadcrumb aria-current="page">{{ crumb }}</span>
        } @else {
          <a *ucBreadcrumb href="/{{ crumb }}">{{ crumb }}</a>
        }
      }
    </uc-breadcrumbs>
  `,
})
class UcBreadcrumbsHost {
  readonly crumbs = signal(['home', 'catalog', 'shoes']);
  readonly variant = signal<UcBreadcrumbsVariant>('plain');
  readonly maxItems = signal(8);
  readonly before = signal(1);
  readonly after = signal(1);
}

@Component({
  imports: [UcBreadcrumbs, UcBreadcrumb, UcBreadcrumbSeparator],
  template: `
    <uc-breadcrumbs separator="ignored">
      <a *ucBreadcrumb href="/">Home</a>
      <span *ucBreadcrumb>Shoes</span>
      <ng-template ucBreadcrumbSeparator><i class="custom-separator"></i></ng-template>
    </uc-breadcrumbs>
  `,
})
class UcBreadcrumbsCustomSeparatorHost {}

describe('UcBreadcrumbs', () => {
  let fixture: ComponentFixture<UcBreadcrumbsHost>;
  const query = <T extends Element>(selector: string): T[] =>
    Array.from(fixture.nativeElement.querySelectorAll(selector));
  const crumbTexts = () => query('.uc-breadcrumbs__item').map((item) => item.textContent!.trim());
  const collapseButton = () => query<HTMLButtonElement>('.uc-breadcrumbs__collapse')[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcBreadcrumbsHost, UcBreadcrumbsCustomSeparatorHost],
    }).compileComponents();
    fixture = TestBed.createComponent(UcBreadcrumbsHost);
    fixture.detectChanges();
  });

  it('should render a labelled nav around an ordered list of crumbs', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.querySelector('ol')).toBeTruthy();
    expect(crumbTexts()).toEqual(['home', 'catalog', 'shoes']);
  });

  it('should render the consumer elements unchanged', () => {
    expect(query<HTMLAnchorElement>('.uc-breadcrumbs__item a')[0].getAttribute('href')).toBe('/home');
    expect(query('.uc-breadcrumbs__item span')[0].getAttribute('aria-current')).toBe('page');
  });

  it('should draw a hidden separator between crumbs only', () => {
    const separators = query('.uc-breadcrumbs__separator');
    expect(separators.length).toBe(2);
    expect(separators.every((separator) => separator.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(separators[0].textContent!.trim()).toBe('/');
  });

  it('should use a projected separator template over the separator text', () => {
    const customFixture = TestBed.createComponent(UcBreadcrumbsCustomSeparatorHost);
    customFixture.detectChanges();

    const separator: HTMLElement = customFixture.nativeElement.querySelector('.uc-breadcrumbs__separator');
    expect(separator.querySelector('.custom-separator')).toBeTruthy();
    expect(separator.textContent!.trim()).toBe('');
  });

  it('should apply the variant class, defaulting to plain', () => {
    const nav = (): HTMLElement => fixture.nativeElement.querySelector('nav');
    expect(nav().classList.contains('uc-plain')).toBe(true);

    fixture.componentInstance.variant.set('pills');
    fixture.detectChanges();

    expect(nav().classList.contains('uc-pills')).toBe(true);
  });

  it('should not collapse while the crumbs fit within maxItems', () => {
    fixture.componentInstance.maxItems.set(3);
    fixture.detectChanges();

    expect(collapseButton()).toBeUndefined();
  });

  it('should collapse the middle crumbs past maxItems', () => {
    fixture.componentInstance.crumbs.set(['a', 'b', 'c', 'd', 'e']);
    fixture.componentInstance.maxItems.set(3);
    fixture.detectChanges();

    expect(crumbTexts()).toEqual(['a', '…', 'e']);
    expect(collapseButton().getAttribute('aria-label')).toBe('Show path');
  });

  it('should honour itemsBeforeCollapse and itemsAfterCollapse', () => {
    fixture.componentInstance.crumbs.set(['a', 'b', 'c', 'd', 'e', 'f']);
    fixture.componentInstance.maxItems.set(3);
    fixture.componentInstance.before.set(2);
    fixture.componentInstance.after.set(2);
    fixture.detectChanges();

    expect(crumbTexts()).toEqual(['a', 'b', '…', 'e', 'f']);
  });

  it('should not collapse when the kept crumbs already cover the whole trail', () => {
    fixture.componentInstance.maxItems.set(1);
    fixture.componentInstance.before.set(2);
    fixture.detectChanges();

    expect(collapseButton()).toBeUndefined();
  });

  it('should expand the full path and focus the first revealed crumb', async () => {
    fixture.componentInstance.crumbs.set(['a', 'b', 'c', 'd', 'e']);
    fixture.componentInstance.maxItems.set(3);
    fixture.detectChanges();

    collapseButton().click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(crumbTexts()).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(document.activeElement?.getAttribute('href')).toBe('/b');
  });

  it('should style the projected crumbs, which carry the consumer encapsulation attribute', () => {
    const styles = (UcBreadcrumbs as unknown as { ɵcmp: { styles: string[] } }).ɵcmp.styles.join('');
    // Without ::ng-deep the rule would read `> a[_ngcontent-%COMP%]` and never match a crumb.
    expect(styles).toMatch(/\.uc-breadcrumbs__item\[_ngcontent-%COMP%\]\s+> :is\(a, ?span\) ?[,{]/);
  });
});
