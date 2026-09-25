import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcBadge, type UcBadgeSize } from './uc-badge';

@Component({
  imports: [UcBadge],
  template: `
    @if (shown()) {
      <button
        type="button"
        [ucBadge]="content()"
        [ucBadgeSize]="size()"
        [ucBadgeHidden]="hidden()"
        [ucBadgeMax]="max()"
        [ucBadgeOverlap]="overlap()"
        [ucBadgeDescription]="description()"
      >
        Inbox
      </button>
    }
  `,
})
class UcBadgeHost {
  readonly shown = signal(true);
  readonly content = signal<string | number | null>(4);
  readonly size = signal<UcBadgeSize>('medium');
  readonly hidden = signal(false);
  readonly max = signal<number | null>(null);
  readonly overlap = signal(true);
  readonly description = signal<string | null>(null);
}

describe('UcBadge', () => {
  let fixture: ComponentFixture<UcBadgeHost>;
  let host: UcBadgeHost;

  const button = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');
  const badge = (): HTMLElement => fixture.nativeElement.querySelector('uc-badge');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcBadgeHost] }).compileComponents();

    fixture = TestBed.createComponent(UcBadgeHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('appends the badge inside the host with the content', () => {
    expect(badge().parentElement).toBe(button());
    expect(badge().textContent?.trim()).toBe('4');
    expect(badge().classList).toContain('uc-badge--top-end');
    expect(badge().classList).toContain('uc-badge--error');
  });

  it('positions a static host so the badge can sit on its corner', () => {
    expect(button().style.position).toBe('relative');
  });

  it('hides the count from screen readers', () => {
    expect(badge().getAttribute('aria-hidden')).toBe('true');
  });

  it('describes the host with ucBadgeDescription', async () => {
    host.description.set('4 unread messages');
    await fixture.whenStable();

    const describedBy = button().getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.textContent).toBe('4 unread messages');
  });

  it('shows counts above ucBadgeMax as max+', async () => {
    host.content.set(128);
    host.max.set(99);
    await fixture.whenStable();

    expect(badge().textContent?.trim()).toBe('99+');
  });

  it('hides the badge when ucBadgeHidden is set or the content is empty', async () => {
    host.hidden.set(true);
    await fixture.whenStable();
    expect(badge().classList).toContain('uc-badge--hidden');

    host.hidden.set(false);
    host.content.set('');
    await fixture.whenStable();
    expect(badge().classList).toContain('uc-badge--hidden');
  });

  it('shows the small size as a dot without text', async () => {
    host.size.set('small');
    host.content.set(null);
    await fixture.whenStable();

    expect(badge().classList).not.toContain('uc-badge--hidden');
    expect(badge().textContent?.trim()).toBe('');
  });

  it('marks a badge that sits beside the host', async () => {
    host.overlap.set(false);
    await fixture.whenStable();

    expect(badge().classList).toContain('uc-badge--detached');
  });

  it('removes the badge with its host', async () => {
    host.shown.set(false);
    await fixture.whenStable();

    expect(document.querySelector('uc-badge')).toBeNull();
  });
});
