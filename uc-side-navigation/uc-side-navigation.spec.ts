import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

    observe = jasmine.createSpy('observe');
    disconnect = jasmine.createSpy('disconnect');

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
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: originalResizeObserver,
    });
  });

  it('should create', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize in over mode with closed sidebar state', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));
    fixture.detectChanges();

    expect(component.sidebarMode()).toBe('over');
    expect(component.isSidebarOpen()).toBeFalse();
    expect(component.isOverlayMounted()).toBeFalse();
    expect(component.isOverlayVisible()).toBeFalse();
  });

  it('should initialize in side mode with opened sidebar state', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));

    fixture.componentRef.setInput('sidebarMode', 'side');
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBeTrue();
    expect(component.isOverlayMounted()).toBeFalse();
    expect(component.isOverlayVisible()).toBeFalse();
  });

  it('should open and close over-mode sidebar with overlay mount lifecycle', fakeAsync(() => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    spyOn(window, 'getComputedStyle').and.returnValue({
      getPropertyValue: () => '120ms',
    } as unknown as CSSStyleDeclaration);

    fixture.detectChanges();

    component.openSidebar();
    expect(component.isSidebarOpen()).toBeTrue();
    expect(component.isOverlayMounted()).toBeTrue();
    expect(component.isOverlayVisible()).toBeTrue();

    component.closeSidebar();
    expect(component.isSidebarOpen()).toBeFalse();
    expect(component.isOverlayVisible()).toBeFalse();
    expect(component.isOverlayMounted()).toBeTrue();

    tick(119);
    expect(component.isOverlayMounted()).toBeTrue();

    tick(1);
    expect(component.isOverlayMounted()).toBeFalse();
  }));

  it('should respect closeOnBackdropClick input', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    fixture.componentRef.setInput('closeOnBackdropClick', false);
    fixture.detectChanges();

    component.openSidebar();
    component.onOverlayBackdropClick();

    expect(component.isSidebarOpen()).toBeTrue();
    expect(component.isOverlayVisible()).toBeTrue();
  });

  it('should update overlay sizing when host container resizes', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValues(createDomRect(640, 480), createDomRect(320, 200));

    fixture.detectChanges();

    expect(component.overlayHeightPx()).toBe(448);
    expect(component.overlayMaxWidthPx()).toBe(608);

    const observer = ResizeObserverMock.instances[0];
    observer.trigger();

    expect(component.overlayHeightPx()).toBe(168);
    expect(component.overlayMaxWidthPx()).toBe(288);
  });

  it('should disconnect resize observer on destroy', () => {
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    spyOn(host, 'getBoundingClientRect').and.returnValue(createDomRect(640, 480));

    fixture.detectChanges();

    const observer = ResizeObserverMock.instances[0];
    fixture.destroy();

    expect(observer.disconnect).toHaveBeenCalled();
  });
});
