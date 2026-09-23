/// <reference types="google.maps" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcMap } from './uc-map';

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
});
