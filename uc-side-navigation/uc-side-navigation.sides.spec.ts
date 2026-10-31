import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { UcSideNavigation, type UcSidebarMode, type UcSidebarOverlayScope } from './uc-side-navigation';
import { UcSidebar, type UcSidebarEdge } from './uc-sidebar/uc-sidebar';

@Component({
  imports: [UcSideNavigation, UcSidebar],
  template: `
    <button type="button" class="opener">Open</button>
    <uc-side-navigation [sidebarMode]="mode()" [overlayScope]="scope()">
      <uc-sidebar [edge]="startEdge()" [resizable]="startResizable()" [(width)]="startWidth" [minWidth]="160" [maxWidth]="400">
        <p class="start-content">Start</p>
      </uc-sidebar>
      <div ucEndSidebarHeader class="end-header">End header</div>
      <uc-sidebar side="end" edge="grip" resizable [(width)]="endWidth" resizeLabel="Resize settings">
        <p class="end-content">End</p>
      </uc-sidebar>
      <p class="main-content">Main</p>
    </uc-side-navigation>
  `,
})
class TwoSidesHost {
  readonly mode = signal<UcSidebarMode>('side');
  readonly scope = signal<UcSidebarOverlayScope>('viewport');
  readonly startEdge = signal<UcSidebarEdge>('line');
  readonly startResizable = signal(true);
  readonly startWidth = signal<number | undefined>(240);
  readonly endWidth = signal<number | undefined>(300);
  readonly navigation = viewChild.required(UcSideNavigation);
}

describe('UcSideNavigation with start and end sidebars', () => {
  let fixture: ComponentFixture<TwoSidesHost>;
  let host: TwoSidesHost;
  let originalResizeObserver: typeof ResizeObserver | undefined;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement | null;
  const edgeOf = (side: 'start' | 'end') => element(`aside.uc-sidebar-${side} .uc-sidebar-edge`)!;
  const key = (target: HTMLElement, keyName: string, shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: keyName, shiftKey, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    fixture.detectChanges();
    return event;
  };

  beforeEach(async () => {
    originalResizeObserver = window.ResizeObserver;
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    });

    await TestBed.configureTestingModule({ imports: [TwoSidesHost] }).compileComponents();
    fixture = TestBed.createComponent(TwoSidesHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: originalResizeObserver,
    });
  });

  it('projects each sidebar into its own side, both open in side mode', () => {
    const start = element('aside.uc-sidebar-start')!;
    const end = element('aside.uc-sidebar-end')!;

    expect(start.querySelector('.start-content')).not.toBeNull();
    expect(end.querySelector('.end-content')).not.toBeNull();
    expect(end.querySelector('.end-header')).not.toBeNull();
    expect(start.querySelector('.end-content')).toBeNull();
    expect(element('main .main-content')).not.toBeNull();
    expect(end.id).toBe(`${host.navigation().instanceId()}-end`);
    expect(host.navigation().isSidebarOpen()).toBe(true);
    expect(host.navigation().isEndSidebarOpen()).toBe(true);
    expect(element('section')!.classList).toContain('uc-end-opened');
  });

  it('applies a width the user set through the layout custom properties', () => {
    const section = element('section')!;

    expect(section.style.getPropertyValue('--uc-side-navigation-start-width-resolved')).toBe('240px');
    expect(section.style.getPropertyValue('--uc-side-navigation-end-width-resolved')).toBe('300px');
  });

  it('opens and closes the end sidebar on its own', () => {
    host.navigation().closeSidebar('end');
    fixture.detectChanges();

    expect(host.navigation().isEndSidebarOpen()).toBe(false);
    expect(host.navigation().isSidebarOpen()).toBe(true);
    expect(element('aside.uc-sidebar-end')!.hasAttribute('inert')).toBe(true);

    host.navigation().toggleSidebar('end');
    expect(host.navigation().isEndSidebarOpen()).toBe(true);
  });

  it('keeps one over sidebar open at a time', async () => {
    host.mode.set('over');
    await fixture.whenStable();
    expect(host.navigation().sidebarMode()).toBe('over');
    // Only now: Angular's scheduler uses animation frames too.
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    host.navigation().openSidebar('start');
    expect(host.navigation().isSidebarOpen()).toBe(true);

    host.navigation().openSidebar('end');
    expect(host.navigation().isEndSidebarOpen()).toBe(true);
    expect(host.navigation().isEndOverlayVisible()).toBe(true);
    expect(host.navigation().isSidebarOpen()).toBe(false);
  });

  it('closes an over sidebar on Escape, and can open it again after its overlay went away', async () => {
    host.mode.set('over');
    await fixture.whenStable();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const navigation = host.navigation();

    navigation.openSidebar('end');
    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    navigation.onOverlayKeydown('end', escape);
    expect(escape.defaultPrevented).toBe(true);
    expect(navigation.isEndSidebarOpen()).toBe(false);

    navigation.openSidebar('end');
    navigation.onOverlayDetach('end');
    expect(navigation.isEndOverlayMounted()).toBe(false);

    navigation.openSidebar('end');
    expect(navigation.isEndOverlayMounted()).toBe(true);
    expect(navigation.isEndSidebarOpen()).toBe(true);
  });

  it('resizes with the arrow keys: the start sidebar grows to the right, the end one to the left', () => {
    key(edgeOf('start'), 'ArrowRight');
    expect(host.startWidth()).toBe(256);

    key(edgeOf('start'), 'ArrowLeft', true);
    expect(host.startWidth()).toBe(192);

    key(edgeOf('end'), 'ArrowLeft');
    expect(host.endWidth()).toBe(316);
  });

  it('goes to the limits with Home and End, and stops the keys there', () => {
    const windowListener = vi.fn();
    window.addEventListener('keydown', windowListener);

    const event = key(edgeOf('start'), 'End');
    expect(host.startWidth()).toBe(400);
    expect(event.defaultPrevented).toBe(true);

    key(edgeOf('start'), 'Home');
    expect(host.startWidth()).toBe(160);
    expect(windowListener).not.toHaveBeenCalled();
    window.removeEventListener('keydown', windowListener);
  });

  it('follows a pointer drag within the limits', () => {
    const edge = edgeOf('end');
    vi.spyOn(edge.closest('aside')!, 'getBoundingClientRect').mockReturnValue({ width: 300 } as DOMRect);

    edge.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 500, bubbles: true }));
    fixture.detectChanges();
    expect(host.navigation().resizingSide()).toBe('end');

    edge.dispatchEvent(new MouseEvent('pointermove', { clientX: 450 }));
    expect(host.endWidth()).toBe(350);

    edge.dispatchEvent(new MouseEvent('pointermove', { clientX: 100 }));
    expect(host.endWidth()).toBe(640);

    edge.dispatchEvent(new MouseEvent('pointerup'));
    fixture.detectChanges();
    expect(host.navigation().resizingSide()).toBeNull();
  });

  it('resets to the width token on double-click', () => {
    edgeOf('start').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();

    expect(host.startWidth()).toBeUndefined();
    expect(element('section')!.style.getPropertyValue('--uc-side-navigation-start-width-resolved')).toBe('');
  });

  it('describes a resizable edge as a separator', () => {
    const edge = edgeOf('end');

    expect(edge.getAttribute('role')).toBe('separator');
    expect(edge.getAttribute('aria-label')).toBe('Resize settings');
    expect(edge.getAttribute('aria-valuenow')).toBe('300');
    expect(edge.getAttribute('aria-controls')).toBe(`${host.navigation().instanceId()}-end`);
    expect(element('aside.uc-sidebar-end')!.classList).toContain('uc-sidebar-edge-grip');
  });

  it('draws the chosen edge, and no handle on a fixed one', () => {
    host.startResizable.set(false);
    fixture.detectChanges();
    expect(element('aside.uc-sidebar-start .uc-sidebar-edge')).toBeNull();

    host.startEdge.set('grip');
    fixture.detectChanges();
    const grip = element('aside.uc-sidebar-start .uc-sidebar-edge')!;
    expect(grip.getAttribute('aria-hidden')).toBe('true');
    expect(grip.hasAttribute('role')).toBe(false);

    host.startEdge.set('none');
    fixture.detectChanges();
    expect(element('aside.uc-sidebar-start')!.classList).toContain('uc-sidebar-edge-none');
  });

  describe('with the over sidebars contained', () => {
    const useFrames = () =>
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });
    const openFrom = async (side: 'start' | 'end') => {
      const opener = element('.opener')!;
      opener.focus();
      host.navigation().openSidebar(side);
      fixture.detectChanges();
      await fixture.whenStable();
      return opener;
    };

    beforeEach(async () => {
      host.mode.set('over');
      host.scope.set('container');
      fixture.detectChanges();
      await fixture.whenStable();
      useFrames();
    });

    it('renders the sidebar and its backdrop inside the component, not in the CDK overlay', async () => {
      await openFrom('end');

      const aside = element('uc-side-navigation aside.uc-sidebar-contained.uc-sidebar-end')!;
      expect(aside).not.toBeNull();
      expect(aside.querySelector('.end-content')).not.toBeNull();
      expect(aside.classList).toContain('uc-sidebar-opened');
      expect(element('uc-side-navigation .uc-sidebar-backdrop')!.classList).toContain('uc-sidebar-backdrop-visible');
      expect(document.querySelector('.cdk-overlay-container .uc-sidebar-over')).toBeNull();
      expect(element('uc-side-navigation main')!.hasAttribute('inert')).toBe(true);
    });

    it('moves focus in on open and gives it back on Escape', async () => {
      const opener = await openFrom('end');
      const aside = element('aside.uc-sidebar-contained.uc-sidebar-end')!;
      expect(document.activeElement).toBe(aside);

      const escape = key(aside, 'Escape');
      expect(escape.defaultPrevented).toBe(true);
      expect(host.navigation().isEndSidebarOpen()).toBe(false);
      expect(document.activeElement).toBe(opener);
      expect(element('uc-side-navigation main')!.hasAttribute('inert')).toBe(true);
    });

    it('closes the open sidebar on a backdrop click', async () => {
      await openFrom('start');
      element('.uc-sidebar-backdrop')!.click();
      fixture.detectChanges();

      expect(host.navigation().isSidebarOpen()).toBe(false);
      expect(element('.uc-sidebar-backdrop')!.classList).not.toContain('uc-sidebar-backdrop-visible');
    });

    it('starts over when the scope changes', async () => {
      await openFrom('start');
      // Real frames again: the mocked one would run Angular's scheduler in the middle of the change.
      vi.mocked(window.requestAnimationFrame).mockRestore();
      host.scope.set('viewport');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.navigation().isSidebarOpen()).toBe(false);
      expect(element('aside.uc-sidebar-contained')).toBeNull();
      expect(element('uc-side-navigation main')!.hasAttribute('inert')).toBe(false);
    });
  });
});

@Component({
  imports: [UcSideNavigation, UcSidebar],
  template: `
    <uc-side-navigation sidebarMode="side">
      <uc-sidebar resizable widthStorageKey="test.sidebar-width" [minWidth]="160" [maxWidth]="400">
        <p>Start</p>
      </uc-sidebar>
      <p>Main</p>
    </uc-side-navigation>
  `,
})
class StoredWidthHost {
  readonly sidebar = viewChild.required(UcSidebar);
}

describe('UcSidebar with a widthStorageKey', () => {
  const storageKey = 'test.sidebar-width';
  let originalResizeObserver: typeof ResizeObserver | undefined;

  const create = async () => {
    const fixture = TestBed.createComponent(StoredWidthHost);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };
  const edgeOf = (fixture: ComponentFixture<StoredWidthHost>) =>
    fixture.nativeElement.querySelector('aside.uc-sidebar-start .uc-sidebar-edge') as HTMLElement;

  beforeEach(async () => {
    originalResizeObserver = window.ResizeObserver;
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    });
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [StoredWidthHost] }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: originalResizeObserver,
    });
  });

  it('starts from the stored width, within the limits', async () => {
    localStorage.setItem(storageKey, '320');
    expect((await create()).componentInstance.sidebar().width()).toBe(320);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [StoredWidthHost] }).compileComponents();
    localStorage.setItem(storageKey, '900');
    expect((await create()).componentInstance.sidebar().width()).toBe(400);
  });

  it('leaves the width token in charge when nothing usable is stored', async () => {
    localStorage.setItem(storageKey, 'wide');
    expect((await create()).componentInstance.sidebar().width()).toBeUndefined();
  });

  it('stores a width the user set and forgets it on reset', async () => {
    const fixture = await create();
    vi.spyOn(edgeOf(fixture).closest('aside')!, 'getBoundingClientRect').mockReturnValue({ width: 240 } as DOMRect);

    edgeOf(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(localStorage.getItem(storageKey)).toBe('256');

    edgeOf(fixture).dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(fixture.componentInstance.sidebar().width()).toBeUndefined();
  });

  it('keeps working when storage refuses the width', async () => {
    const fixture = await create();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    fixture.componentInstance.sidebar().setUserWidth(300);
    expect(fixture.componentInstance.sidebar().width()).toBe(300);
  });
});
