import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { UcSideNavigation } from './uc-side-navigation';

describe('UcSideNavigation', () => {
  let component: UcSideNavigation;
  let fixture: ComponentFixture<UcSideNavigation>;
  let originalResizeObserver: typeof ResizeObserver | undefined;

  class ResizeObserverMock {
    static instances: ResizeObserverMock[] = [];

    constructor(private readonly callback: ResizeObserverCallback) {
      ResizeObserverMock.instances.push(this);
    }

    observe = vi.fn();
    disconnect = vi.fn();

    trigger() {
      this.callback([], this as unknown as ResizeObserver);
    }
  }

  const createDomRect = (width: number, height: number): DOMRect => {
    return {
      x: 0,
      y: 0,
      top: 0,
      right: width,
      bottom: height,
      left: 0,
      width,
      height,
      toJSON: () => ({}),
    } as DOMRect;
  };

  beforeEach(async () => {
    ResizeObserverMock.instances = [];
    originalResizeObserver = window.ResizeObserver;
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: ResizeObserverMock,
    });

    await TestBed.configureTestingModule({
      imports: [UcSideNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(UcSideNavigation);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: originalResizeObserver,
    });
  });

  it('should create', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize in over mode with closed sidebar state', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));
    fixture.detectChanges();

    expect(component.sidebarMode()).toBe('over');
    expect(component.isSidebarOpen()).toBe(false);
    expect(component.isOverlayMounted()).toBe(false);
    expect(component.isOverlayVisible()).toBe(false);
  });

  it('should initialize in side mode with opened sidebar state', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));

    fixture.componentRef.setInput('sidebarMode', 'side');
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(true);
    expect(component.isOverlayMounted()).toBe(false);
    expect(component.isOverlayVisible()).toBe(false);
  });

  it('should open and close over-mode sidebar with overlay mount lifecycle', async () => {
    let completeClose: (() => void) | undefined;
    let showOverlay: (() => void) | undefined;
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      showOverlay = () => cb(0);
      return 1;
    });
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '120ms',
    } as unknown as CSSStyleDeclaration);
    vi.spyOn(window, 'setTimeout').mockImplementation((callback): ReturnType<typeof window.setTimeout> => {
      completeClose = callback as () => void;
      return 1 as unknown as ReturnType<typeof window.setTimeout>;
    });

    fixture.detectChanges();
    await fixture.whenStable();

    component.openSidebar();
    expect(showOverlay).toBeDefined();
    showOverlay!();
    expect(component.isSidebarOpen()).toBe(true);
    expect(component.isOverlayMounted()).toBe(true);
    expect(component.isOverlayVisible()).toBe(true);

    component.closeSidebar();
    expect(component.isSidebarOpen()).toBe(false);
    expect(component.isOverlayVisible()).toBe(false);
    expect(component.isOverlayMounted()).toBe(true);

    expect(completeClose).toBeDefined();
    completeClose!();
    expect(component.isOverlayMounted()).toBe(false);
  });

  it('should respect closeOnBackdropClick input', () => {
    let showOverlay: (() => void) | undefined;
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      showOverlay = () => cb(0);
      return 1;
    });

    fixture.componentRef.setInput('closeOnBackdropClick', false);
    fixture.detectChanges();

    component.openSidebar();
    expect(showOverlay).toBeDefined();
    showOverlay!();
    component.onOverlayBackdropClick();

    expect(component.isSidebarOpen()).toBe(true);
    expect(component.isOverlayVisible()).toBe(true);
  });

  it('should update overlay sizing when host container resizes', async () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect')
      .mockReturnValueOnce(createDomRect(640, 480))
      .mockReturnValueOnce(createDomRect(320, 200));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.overlayHeightPx()).toBe(448);
    expect(component.overlayMaxWidthPx()).toBe(608);

    const observer = ResizeObserverMock.instances[0];
    observer.trigger();

    expect(component.overlayHeightPx()).toBe(168);
    expect(component.overlayMaxWidthPx()).toBe(288);
  });

  it('should disconnect resize observer on destroy', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(createDomRect(640, 480));

    fixture.detectChanges();

    const observer = ResizeObserverMock.instances[0];
    fixture.destroy();

    expect(observer.disconnect).toHaveBeenCalled();
  });
});
