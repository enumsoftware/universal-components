/// <reference types="google.maps" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcMap } from './uc-map';
import { loadMarkerClusterer } from './uc-map-loader';
import type { UcMapMarkerIcon, UcMapPolygon } from './uc-map-types';

/** Only the parts of a Google Maps click event the component reads. */
function click(lat: number, lng: number): google.maps.MapMouseEvent {
  return { latLng: { toJSON: () => ({ lat, lng }) } } as unknown as google.maps.MapMouseEvent;
}

interface UcMapInternals {
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
