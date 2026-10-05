/// <reference types="google.maps" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { headingBetween, UcMap } from './uc-map';
import { loadMarkerClusterer } from './uc-map-loader';
import type { UcMapMarkerIcon, UcMapPolygon } from './uc-map-types';

/** Only the parts of a Google Maps click event the component reads. */
function click(lat: number, lng: number): google.maps.MapMouseEvent {
  return { latLng: { toJSON: () => ({ lat, lng }) } } as unknown as google.maps.MapMouseEvent;
}

interface UcMapInternals {
  clusterRenderer(): {
    render(cluster: { count: number; position: google.maps.LatLng }): unknown;
  };
  colors: { set(value: unknown): void; (): { cluster: object } };
  readColors(): void;
  onMapClick(event: google.maps.MapMouseEvent): void;
  startDraft(kind: 'area' | 'exclusion'): void;
  finishDraft(): void;
  cancelDraft(): void;
  selectPolygon(id: string): void;
  deleteSelected(): void;
  options(): google.maps.MapOptions;
  map(): google.maps.Map | undefined;
  zoomBy(step: number): void;
  pan(x: -1 | 0 | 1, y: -1 | 0 | 1): void;
  toggleControls(): void;
  controlsOpen(): boolean;
  onMapInitialized(map: google.maps.Map): void;
  polygonsVisible(): boolean;
  contentFor(key: unknown, icon: UcMapMarkerIcon | null | undefined, color: string | undefined): Node;
}

/** A 300 x 150 map at zoom 13 that records the zoom, pan and fit calls the component makes. */
function fakeMap() {
  const zooms: number[] = [];
  const pans: [number, number][] = [];
  const fits: [google.maps.LatLngBoundsLiteral, number][] = [];
  const optionUpdates: google.maps.MapOptions[] = [];
  const instance = {
    getZoom: () => 13,
    setZoom: (zoom: number) => zooms.push(zoom),
    getDiv: () => ({ clientWidth: 300, clientHeight: 150 }),
    panBy: (x: number, y: number) => pans.push([x, y]),
    fitBounds: (bounds: google.maps.LatLngBoundsLiteral, padding: number) => fits.push([bounds, padding]),
    setOptions: (options: google.maps.MapOptions) => optionUpdates.push(options),
  } as unknown as google.maps.Map;

  return { instance, zooms, pans, fits, optionUpdates };
}

const SERVICE_AREA: UcMapPolygon = {
  id: 'city',
  kind: 'area',
  path: [
    { lat: 42.64, lng: 18.08 },
    { lat: 42.66, lng: 18.08 },
    { lat: 42.65, lng: 18.11 },
  ],
};

const HARBOUR_EXCLUSION: UcMapPolygon = {
  id: 'harbour',
  kind: 'exclusion',
  path: [
    { lat: 42.7, lng: 18.2 },
    { lat: 42.71, lng: 18.2 },
    { lat: 42.7, lng: 18.21 },
  ],
};

describe('UcMap', () => {
  let fixture: ComponentFixture<UcMap>;
  let component: UcMap;
  let internals: UcMapInternals;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcMap] }).compileComponents();

    fixture = TestBed.createComponent(UcMap);
    component = fixture.componentInstance;
    internals = component as unknown as UcMapInternals;
    fixture.componentRef.setInput('apiKey', 'test-key');
  });

  it('shows the loading message until Google Maps is ready', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading map');
  });

  it('sets the selected position on click in pick mode', () => {
    fixture.componentRef.setInput('mode', 'pick');

    internals.onMapClick(click(42.65, 18.09));

    expect(component.selectedPosition()).toEqual({ lat: 42.65, lng: 18.09 });
  });

  it('lets clicks pass through areas except while editing polygons', () => {
    const clickable = () =>
      (component as unknown as { polygonOptions(kind: 'area', selected: boolean, editable: boolean): google.maps.PolygonOptions })
        .polygonOptions('area', false, false).clickable;

    // A click inside a service area has to reach the map to place the pick marker.
    fixture.componentRef.setInput('mode', 'pick');
    expect(clickable()).toBe(false);

    fixture.componentRef.setInput('mode', 'view');
    expect(clickable()).toBe(false);

    fixture.componentRef.setInput('mode', 'polygons');
    expect(clickable()).toBe(true);
  });

  it('hides the Google map controls, which the library draws instead', () => {
    expect(internals.options().disableDefaultUI).toBe(true);
  });

  it('keeps the pan and zoom controls closed until their button is used', () => {
    expect(internals.controlsOpen()).toBe(false);

    internals.toggleControls();
    expect(internals.controlsOpen()).toBe(true);

    internals.toggleControls();
    expect(internals.controlsOpen()).toBe(false);
  });

  it('fits the service areas on screen once the map has loaded', () => {
    const map = fakeMap();
    component.polygons.set([SERVICE_AREA, HARBOUR_EXCLUSION]);

    internals.onMapInitialized(map.instance);
    TestBed.tick();

    // Exclusions are not service areas, so the harbour further out is left out of the box.
    expect(map.fits).toEqual([[{ north: 42.66, south: 42.64, east: 18.11, west: 18.08 }, 48]]);
  });

  it('fits again when the app passes in new polygons, with the given padding', () => {
    const map = fakeMap();
    fixture.componentRef.setInput('fitPadding', 16);
    internals.onMapInitialized(map.instance);
    TestBed.tick();
    expect(map.fits).toEqual([]);

    component.polygons.set([SERVICE_AREA]);
    TestBed.tick();

    expect(map.fits).toHaveLength(1);
    expect(map.fits[0][1]).toBe(16);
  });

  it('does not move the view while the user draws or deletes areas', () => {
    const map = fakeMap();
    fixture.componentRef.setInput('mode', 'polygons');
    internals.onMapInitialized(map.instance);

    internals.startDraft('area');
    internals.onMapClick(click(1, 1));
    internals.onMapClick(click(1, 2));
    internals.onMapClick(click(2, 2));
    internals.finishDraft();
    TestBed.tick();

    internals.selectPolygon(component.polygons()[0].id);
    internals.deleteSelected();
    TestBed.tick();

    expect(map.fits).toEqual([]);
  });

  it('does not fit exclusions alone, or when fitToAreas is off', () => {
    const map = fakeMap();
    internals.onMapInitialized(map.instance);

    component.polygons.set([HARBOUR_EXCLUSION]);
    TestBed.tick();
    fixture.componentRef.setInput('fitToAreas', false);
    component.polygons.set([SERVICE_AREA]);
    TestBed.tick();

    expect(map.fits).toEqual([]);
  });

  it('switches the cursor with the mode without changing the map options, which would reset the view', () => {
    const map = fakeMap();
    const options = internals.options();
    internals.onMapInitialized(map.instance);
    TestBed.tick();

    fixture.componentRef.setInput('mode', 'polygons');
    TestBed.tick();

    expect(internals.options()).toBe(options);
    expect(map.optionUpdates.filter((update) => 'draggableCursor' in update)).toEqual([
      { draggableCursor: null },
      { draggableCursor: 'crosshair' },
    ]);
  });

  it('uses cooperative gesture handling with a mouse or trackpad', () => {
    expect(internals.options().gestureHandling).toBe('cooperative');
  });

  describe('cluster icons', () => {
    const originalGoogle = (globalThis as { google?: unknown }).google;

    /** Records what the renderer builds instead of creating real Google markers. */
    class FakeMarker {
      static MAX_ZINDEX = 1000;
      constructor(readonly options: google.maps.MarkerOptions) {}
    }
    class FakeAdvancedMarker {
      constructor(readonly options: google.maps.marker.AdvancedMarkerElementOptions) {}
    }

    beforeEach(() => {
      (globalThis as { google?: unknown }).google = {
        maps: {
          Marker: FakeMarker,
          Size: class {
            constructor(readonly width: number, readonly height: number) {}
          },
          Point: class {
            constructor(readonly x: number, readonly y: number) {}
          },
          marker: { AdvancedMarkerElement: FakeAdvancedMarker },
        },
      };
    });

    afterEach(() => {
      (globalThis as { google?: unknown }).google = originalGoogle;
    });

    const position = { lat: () => 42.65, lng: () => 18.09 } as unknown as google.maps.LatLng;
    const svgOf = (url: string) => decodeURIComponent(url.slice(url.indexOf(',') + 1));

    it('draws a classic marker with the count, centred on the cluster', () => {
      const marker = internals.clusterRenderer().render({ count: 12, position }) as FakeMarker;
      const icon = marker.options.icon as google.maps.Icon;

      expect(svgOf(icon.url)).toContain('>12</text>');
      expect(icon.anchor).toEqual({ x: 20, y: 20 });
      expect(marker.options.title).toBe('12 markers');
      expect(marker.options.zIndex).toBe(1012);
    });

    it('shows 99+ above 99 and uses the cluster label input', () => {
      fixture.componentRef.setInput('clusterLabel', '{count} prijava');

      const marker = internals.clusterRenderer().render({ count: 180, position }) as FakeMarker;

      expect(svgOf((marker.options.icon as google.maps.Icon).url)).toContain('>99+</text>');
      expect(marker.options.title).toBe('180 prijava');
    });

    it('makes a new renderer when the cluster colours change, and only then', () => {
      // Re-reading unchanged colours, as an unrelated class change above the map does, keeps the
      // renderer, so the clusterer is not rebuilt for nothing.
      internals.readColors();
      const first = internals.clusterRenderer();
      internals.readColors();
      expect(internals.clusterRenderer()).toBe(first);

      const second = internals.clusterRenderer();
      internals.colors.set({
        ...internals.colors(),
        cluster: { background: '#000000', color: '#ffffff', borderColor: '#ffffff', borderWidth: 0 },
      });
      const marker = internals.clusterRenderer().render({ count: 3, position }) as FakeMarker;

      expect(internals.clusterRenderer()).not.toBe(second);
      expect(svgOf((marker.options.icon as google.maps.Icon).url)).toContain('fill="#000000"');
    });

    it('draws an advanced marker when the map has a mapId', () => {
      fixture.componentRef.setInput('mapId', 'DEMO_MAP_ID');

      const marker = internals.clusterRenderer().render({ count: 5, position }) as FakeAdvancedMarker;
      const content = marker.options.content as HTMLImageElement;

      expect(marker).toBeInstanceOf(FakeAdvancedMarker);
      expect(svgOf(content.src)).toContain('>5</text>');
      expect(content.style.transform).toBe('translateY(50%)');
    });
  });

  it('reads the colours again when the theme changes on an element above the map', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const readColors = vi.spyOn(internals, 'readColors');

    document.documentElement.setAttribute('data-theme', 'dark');
    await Promise.resolve();

    expect(readColors).toHaveBeenCalled();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('on a touch-first device', () => {
    const original = globalThis.matchMedia;

    beforeEach(() => {
      globalThis.matchMedia = ((query: string) => ({
        matches: query === '(pointer: coarse)',
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      })) as unknown as typeof matchMedia;
    });

    afterEach(() => {
      globalThis.matchMedia = original;
    });

    it('uses greedy gesture handling, so one finger moves the map', () => {
      const touchFixture = TestBed.createComponent(UcMap);
      touchFixture.componentRef.setInput('apiKey', 'test-key');

      expect((touchFixture.componentInstance as unknown as UcMapInternals).options().gestureHandling).toBe('greedy');
    });

    it('still uses an explicitly set gesture handling', () => {
      const touchFixture = TestBed.createComponent(UcMap);
      touchFixture.componentRef.setInput('apiKey', 'test-key');
      touchFixture.componentRef.setInput('gestureHandling', 'cooperative');

      expect((touchFixture.componentInstance as unknown as UcMapInternals).options().gestureHandling).toBe('cooperative');
    });
  });

  it('applies a gesture handling change to the map without changing its options', () => {
    const map = fakeMap();
    const options = internals.options();
    internals.onMapInitialized(map.instance);
    TestBed.tick();

    fixture.componentRef.setInput('gestureHandling', 'greedy');
    TestBed.tick();

    expect(internals.options()).toBe(options);
    expect(map.optionUpdates.filter((update) => 'gestureHandling' in update)).toEqual([
      { gestureHandling: 'cooperative' },
      { gestureHandling: 'greedy' },
    ]);
  });

  it('hides the polygons with showPolygons, but always shows them in polygons mode', () => {
    expect(internals.polygonsVisible()).toBe(true);

    fixture.componentRef.setInput('showPolygons', false);
    expect(internals.polygonsVisible()).toBe(false);

    fixture.componentRef.setInput('mode', 'polygons');
    expect(internals.polygonsVisible()).toBe(true);
  });

  it('does not fit hidden areas, and fits them once they are shown', () => {
    const map = fakeMap();
    fixture.componentRef.setInput('showPolygons', false);
    component.polygons.set([SERVICE_AREA]);
    internals.onMapInitialized(map.instance);
    TestBed.tick();
    expect(map.fits).toEqual([]);

    fixture.componentRef.setInput('showPolygons', true);
    TestBed.tick();

    expect(map.fits).toHaveLength(1);
  });

  it('zooms the map one step in or out', () => {
    const map = fakeMap();
    internals.map = () => map.instance;

    internals.zoomBy(1);
    internals.zoomBy(-1);

    expect(map.zooms).toEqual([14, 12]);
  });

  it('pans by a third of the map in the given direction', () => {
    const map = fakeMap();
    internals.map = () => map.instance;

    internals.pan(1, 0);
    internals.pan(0, -1);

    expect(map.pans).toEqual([
      [100, 0],
      [0, -50],
    ]);
  });

  it('ignores clicks in view mode', () => {
    internals.onMapClick(click(42.65, 18.09));

    expect(component.selectedPosition()).toBeNull();
  });

  it('adds a polygon after three points and finish', () => {
    fixture.componentRef.setInput('mode', 'polygons');

    internals.startDraft('exclusion');
    internals.onMapClick(click(1, 1));
    internals.onMapClick(click(1, 2));
    internals.onMapClick(click(2, 2));
    internals.finishDraft();

    const [polygon] = component.polygons();
    expect(component.polygons()).toHaveLength(1);
    expect(polygon.kind).toBe('exclusion');
    expect(polygon.path).toHaveLength(3);
  });

  it('does not finish a shape with fewer than three points', () => {
    fixture.componentRef.setInput('mode', 'polygons');

    internals.startDraft('area');
    internals.onMapClick(click(1, 1));
    internals.onMapClick(click(1, 2));
    internals.finishDraft();

    expect(component.polygons()).toHaveLength(0);
  });

  it('deletes the selected polygon', () => {
    component.polygons.set([
      { id: 'a', kind: 'area', path: [] },
      { id: 'b', kind: 'exclusion', path: [] },
    ]);

    internals.selectPolygon('a');
    internals.deleteSelected();

    expect(component.polygons().map((polygon) => polygon.id)).toEqual(['b']);
  });

  it('exposes the lazily loaded clusterer under the global @angular/google-maps reads', async () => {
    const global = () => globalThis as { markerClusterer?: { MarkerClusterer?: unknown } };
    delete global().markerClusterer;

    await loadMarkerClusterer();

    expect(typeof global().markerClusterer?.MarkerClusterer).toBe('function');
  });

  it('renders inline SVG markup as an image data URL', () => {
    const icon: UcMapMarkerIcon = { svg: '<svg xmlns="http://www.w3.org/2000/svg"><circle r="4"/></svg>', width: 24 };

    const element = internals.contentFor(1, icon, undefined) as HTMLImageElement;

    expect(element.tagName).toBe('IMG');
    expect(element.src.startsWith('data:image/svg+xml')).toBe(true);
    expect(decodeURIComponent(element.src)).toContain('<circle r="4"/>');
    expect(element.width).toBe(24);
    expect(element.height).toBe(24);
  });

  it('uses an SVG URL as it is', () => {
    const element = internals.contentFor(1, { svg: '/icons/bin.svg' }, undefined) as HTMLImageElement;

    expect(element.getAttribute('src')).toBe('/icons/bin.svg');
  });

  it('shifts the icon so its anchor sits on the position', () => {
    const icon: UcMapMarkerIcon = { svg: '/pin.svg', width: 40, height: 20, anchor: { x: 10, y: 10 } };

    const element = internals.contentFor(1, icon, undefined) as HTMLImageElement;

    expect(element.style.transform).toBe('translate(10px, 10px)');
  });

  it('gives every marker its own icon element and reuses it while the icon is unchanged', () => {
    const icon: UcMapMarkerIcon = { svg: '/pin.svg' };

    const first = internals.contentFor(1, icon, undefined);

    expect(internals.contentFor(1, icon, undefined)).toBe(first);
    expect(internals.contentFor(2, icon, undefined)).not.toBe(first);
    expect(internals.contentFor(1, { svg: '/other.svg' }, undefined)).not.toBe(first);
  });
});

interface StreetViewInternals {
  onMapInitialized(map: google.maps.Map): void;
  onMapClick(event: google.maps.MapMouseEvent): void;
  closeStreetView(): void;
  streetViewPicking: { set(value: boolean): void; (): boolean };
  streetViewOpen(): boolean;
  streetViewMessage(): string | null;
  streetViewDrag(): { x: number; y: number } | null;
  onStreetViewPointerDown(event: { button: number; clientX: number; clientY: number }): void;
}

/** The panorama, coverage layer and lookup service the Street View button uses, recorded. */
function fakeStreetView(nearest: { pano: string; position: google.maps.LatLngLiteral } | null) {
  const listeners: (() => void)[] = [];
  const panorama = {
    options: {} as google.maps.StreetViewPanoramaOptions,
    pano: null as string | null,
    pov: null as google.maps.StreetViewPov | null,
    visible: false,
    setOptions(options: google.maps.StreetViewPanoramaOptions) {
      Object.assign(this.options, options);
    },
    setPano(pano: string) {
      this.pano = pano;
    },
    setPov(pov: google.maps.StreetViewPov) {
      this.pov = pov;
    },
    getVisible() {
      return this.visible;
    },
    setVisible(visible: boolean) {
      this.visible = visible;
      listeners.forEach((listener) => listener());
    },
    addListener(_event: string, listener: () => void) {
      listeners.push(listener);
      return { remove: () => listeners.splice(listeners.indexOf(listener), 1) };
    },
  };
  const coverage = { map: null as unknown };
  const lookups: google.maps.StreetViewLocationRequest[] = [];

  const map = {
    ...fakeMap().instance,
    getStreetView: () => panorama,
    getDiv: () => ({
      clientWidth: 300,
      clientHeight: 150,
      getBoundingClientRect: () => ({ left: 100, top: 50, right: 400, bottom: 200 }),
    }),
  } as unknown as google.maps.Map;

  (globalThis as { google?: unknown }).google = {
    maps: {
      StreetViewPreference: { NEAREST: 'nearest' },
      StreetViewSource: { GOOGLE: 'google', OUTDOOR: 'outdoor' },
      Point: class {
        constructor(
          public x: number,
          public y: number,
        ) {}
      },
      OverlayView: class {
        setMap() {}
        getProjection() {
          return {
            fromContainerPixelToLatLng: (point: { x: number; y: number }) => ({
              toJSON: () => ({ lat: point.y, lng: point.x }),
            }),
          };
        }
      },
      StreetViewCoverageLayer: class {
        setMap(target: unknown) {
          coverage.map = target;
        }
      },
      StreetViewService: class {
        async getPanorama(request: google.maps.StreetViewLocationRequest) {
          lookups.push(request);
          if (!nearest) {
            throw new Error('ZERO_RESULTS');
          }
          return { data: { location: { pano: nearest.pano, latLng: { toJSON: () => nearest.position } } } };
        }
      },
    },
  };

  return { map, panorama, coverage, lookups };
}

describe('UcMap Street View', () => {
  let fixture: ComponentFixture<UcMap>;
  let component: UcMap;
  let internals: StreetViewInternals;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcMap] }).compileComponents();

    fixture = TestBed.createComponent(UcMap);
    component = fixture.componentInstance;
    internals = component as unknown as StreetViewInternals;
    fixture.componentRef.setInput('apiKey', 'test-key');
    fixture.componentRef.setInput('streetViewControl', true);
  });

  afterEach(() => {
    delete (globalThis as { google?: unknown }).google;
  });

  it('replaces the panorama close and full screen buttons with the library ones', () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    expect(streetView.panorama.options).toEqual({
      enableCloseButton: false,
      fullscreenControl: false,
      motionTrackingControl: false,
    });
  });

  it('shows the coverage lines only while waiting for the click', () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();
    expect(streetView.coverage.map).toBeNull();

    internals.streetViewPicking.set(true);
    TestBed.tick();
    expect(streetView.coverage.map).toBe(streetView.map);

    internals.streetViewPicking.set(false);
    TestBed.tick();
    expect(streetView.coverage.map).toBeNull();
  });

  it('opens the nearest panorama facing the clicked spot instead of moving the pick marker', async () => {
    // The panorama is just south of the clicked spot, so it has to look north.
    const streetView = fakeStreetView({ pano: 'pano-1', position: { lat: 42.6495, lng: 18.09 } });
    fixture.componentRef.setInput('mode', 'pick');
    fixture.componentRef.setInput('streetViewRadius', 30);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.streetViewPicking.set(true);
    internals.onMapClick(click(42.65, 18.09));
    await Promise.resolve();
    await Promise.resolve();

    expect(streetView.lookups).toEqual([
      { location: { lat: 42.65, lng: 18.09 }, radius: 30, preference: 'nearest', sources: ['google', 'outdoor'] },
    ]);
    expect(streetView.panorama.pano).toBe('pano-1');
    expect(streetView.panorama.pov?.heading).toBeCloseTo(0, 5);
    expect(streetView.panorama.visible).toBe(true);
    expect(internals.streetViewOpen()).toBe(true);
    expect(internals.streetViewPicking()).toBe(false);
    expect(component.selectedPosition()).toBeNull();
  });

  it('says so when there is no panorama near the clicked spot', async () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.streetViewPicking.set(true);
    internals.onMapClick(click(42.65, 18.09));
    await Promise.resolve();
    await Promise.resolve();

    expect(streetView.panorama.visible).toBe(false);
    expect(internals.streetViewMessage()).toBe('Street View is not available here.');

    // The next press of the button clears it.
    internals.streetViewPicking.set(true);
    TestBed.tick();
    expect(internals.streetViewMessage()).toBeNull();
  });

  it('goes back to the map with the library button', () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();
    streetView.panorama.setVisible(true);
    expect(internals.streetViewOpen()).toBe(true);

    internals.closeStreetView();

    expect(streetView.panorama.visible).toBe(false);
    expect(internals.streetViewOpen()).toBe(false);
  });

  it('turns the crosshair on while waiting for the click', () => {
    const streetView = fakeStreetView(null);
    const updates: google.maps.MapOptions[] = [];
    (streetView.map as unknown as { setOptions(options: google.maps.MapOptions): void }).setOptions = (options) =>
      updates.push(options);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.streetViewPicking.set(true);
    TestBed.tick();

    expect(updates.filter((update) => 'draggableCursor' in update)).toEqual([
      { draggableCursor: null },
      { draggableCursor: 'crosshair' },
    ]);
  });
});

describe('UcMap Street View drag and drop', () => {
  let fixture: ComponentFixture<UcMap>;
  let internals: StreetViewInternals;

  const pointer = (type: string, clientX: number, clientY: number) =>
    window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcMap] }).compileComponents();

    fixture = TestBed.createComponent(UcMap);
    internals = fixture.componentInstance as unknown as StreetViewInternals;
    fixture.componentRef.setInput('apiKey', 'test-key');
    fixture.componentRef.setInput('streetViewControl', true);
  });

  afterEach(() => {
    delete (globalThis as { google?: unknown }).google;
  });

  it('opens the panorama nearest to where the button is dropped', async () => {
    const streetView = fakeStreetView({ pano: 'pano-1', position: { lat: 40, lng: 50 } });
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.onStreetViewPointerDown({ button: 0, clientX: 120, clientY: 190 });
    pointer('pointermove', 150, 100);
    TestBed.tick();

    // The person follows the pointer over the map, with the coverage lines shown.
    expect(internals.streetViewDrag()).toEqual({ x: 50, y: 50 });
    expect(streetView.coverage.map).toBe(streetView.map);

    pointer('pointerup', 150, 100);
    TestBed.tick();
    await Promise.resolve();
    await Promise.resolve();

    expect(streetView.lookups.map((lookup) => lookup.location)).toEqual([{ lat: 50, lng: 50 }]);
    expect(streetView.panorama.visible).toBe(true);
    expect(internals.streetViewDrag()).toBeNull();
    expect(streetView.coverage.map).toBeNull();
  });

  it('leaves a press without movement to the button, which waits for a click', () => {
    const streetView = fakeStreetView({ pano: 'pano-1', position: { lat: 40, lng: 50 } });
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.onStreetViewPointerDown({ button: 0, clientX: 120, clientY: 190 });
    pointer('pointermove', 122, 191);
    pointer('pointerup', 122, 191);

    expect(internals.streetViewDrag()).toBeNull();
    expect(streetView.lookups).toEqual([]);
  });

  it('does nothing when the button is dropped outside the map', async () => {
    const streetView = fakeStreetView({ pano: 'pano-1', position: { lat: 40, lng: 50 } });
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.onStreetViewPointerDown({ button: 0, clientX: 120, clientY: 190 });
    pointer('pointermove', 150, 100);
    pointer('pointerup', 500, 400);
    await Promise.resolve();

    expect(streetView.lookups).toEqual([]);
    expect(streetView.panorama.visible).toBe(false);
    expect(internals.streetViewDrag()).toBeNull();
  });

  it('does not count the release after a drag as a press of the button', () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.onStreetViewPointerDown({ button: 0, clientX: 120, clientY: 190 });
    pointer('pointermove', 150, 100);
    pointer('pointerup', 150, 100);

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.body.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(internals.streetViewPicking()).toBe(false);
  });

  it('ignores presses other than the main button', () => {
    const streetView = fakeStreetView(null);
    internals.onMapInitialized(streetView.map);
    TestBed.tick();

    internals.onStreetViewPointerDown({ button: 2, clientX: 120, clientY: 190 });
    pointer('pointermove', 150, 100);

    expect(internals.streetViewDrag()).toBeNull();
  });
});

describe('headingBetween', () => {
  it('gives the compass bearing between two points', () => {
    expect(headingBetween({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(0, 5);
    expect(headingBetween({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(90, 5);
    expect(headingBetween({ lat: 1, lng: 0 }, { lat: 0, lng: 0 })).toBeCloseTo(180, 5);
    expect(headingBetween({ lat: 0, lng: 1 }, { lat: 0, lng: 0 })).toBeCloseTo(270, 5);
  });
});
