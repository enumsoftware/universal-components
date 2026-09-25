/// <reference types="google.maps" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcMap } from './uc-map';
import { loadMarkerClusterer } from './uc-map-loader';
import type { UcMapMarkerIcon } from './uc-map-types';

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
  contentFor(key: unknown, icon: UcMapMarkerIcon | null | undefined, color: string | undefined): Node;
}

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
