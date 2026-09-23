/// <reference types="google.maps" />
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapMarker, MapMarkerClusterer, MapPolygon } from '@angular/google-maps';
import { loadGoogleMaps } from './uc-map-loader';
import type { MapMode, MapPolygonKind, UcMapMarker, UcMapPolygon, UcMapPosition } from './uc-map-types';

interface DraftPolygon {
  kind: MapPolygonKind;
  path: UcMapPosition[];
}

/**
 * Google Maps wrapper for Enum apps. Loads the Maps API on first use, shows (clustered)
 * markers, lets the user pick a position, or draw area and exclusion polygons. Advanced
 * markers need a `mapId`; without one classic markers are used.
 */
@Component({
  selector: 'uc-map',
  imports: [GoogleMap, MapAdvancedMarker, MapMarker, MapMarkerClusterer, MapPolygon],
  templateUrl: './uc-map.html',
  styleUrl: './uc-map.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcMap {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  apiKey = input.required<string>();
  mapId = input<string | null>(null);
  center = input<UcMapPosition>({ lat: 45.815, lng: 15.982 });
  zoom = input<number>(13);
  mode = input<MapMode>('view');
  markers = input<readonly UcMapMarker[]>([]);
  cluster = input<boolean>(true);

  selectedPosition = model<UcMapPosition | null>(null);
  polygons = model<UcMapPolygon[]>([]);

  loadingLabel = input<string>('Loading map');
  errorLabel = input<string>('The map could not be loaded.');
  newAreaLabel = input<string>('New area');
  newExclusionLabel = input<string>('New exclusion');
  finishLabel = input<string>('Finish shape');
  cancelLabel = input<string>('Cancel');
  deleteLabel = input<string>('Delete selected');
  drawingHint = input<string>('Click on the map to add points. At least three are needed.');

  markerClick = output<UcMapMarker>();

  private readonly polygonComponents = viewChildren(MapPolygon);

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly draft = signal<DraftPolygon | null>(null);
  protected readonly selectedPolygonId = signal<string | null>(null);
  protected readonly colors = signal({ area: '#2f5bd3', exclusion: '#d32f2f', marker: '#2f5bd3' });

  protected readonly options = computed<google.maps.MapOptions>(() => ({
    mapId: this.mapId() ?? undefined,
    clickableIcons: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: 'cooperative',
    draggableCursor: this.mode() === 'view' ? undefined : 'crosshair',
  }));

  private readonly pins = new Map<string, google.maps.marker.PinElement>();

  constructor() {
    afterNextRender(() => {
      this.readColors();
      loadGoogleMaps(this.apiKey())
        .then(() => this.status.set('ready'))
        .catch(() => this.status.set('error'));
    });
  }

  protected pinFor(color: string | undefined): google.maps.marker.PinElement {
    const background = color ?? this.colors().marker;
    let pin = this.pins.get(background);
    if (!pin) {
      pin = new google.maps.marker.PinElement({ background, borderColor: background, glyphColor: '#ffffff' });
      this.pins.set(background, pin);
    }

    return pin;
  }

  protected polygonOptions(kind: MapPolygonKind, selected: boolean, editable: boolean): google.maps.PolygonOptions {
    const color = kind === 'area' ? this.colors().area : this.colors().exclusion;
    return {
      strokeColor: color,
      strokeWeight: selected ? 3 : 2,
      fillColor: color,
      fillOpacity: kind === 'area' ? 0.12 : 0.25,
      editable,
      clickable: true,
    };
  }

  protected onMapClick(event: google.maps.MapMouseEvent): void {
    const position = event.latLng?.toJSON();
    if (!position) {
      return;
    }

    if (this.mode() === 'pick') {
      this.selectedPosition.set(position);
    } else if (this.mode() === 'polygons' && this.draft()) {
      this.draft.update((draft) => (draft ? { ...draft, path: [...draft.path, position] } : draft));
    }
  }

  protected onPickDragEnd(event: google.maps.MapMouseEvent): void {
    const position = event.latLng?.toJSON();
    if (position) {
      this.selectedPosition.set(position);
    }
  }

  protected startDraft(kind: MapPolygonKind): void {
    this.selectedPolygonId.set(null);
    this.draft.set({ kind, path: [] });
  }

  protected finishDraft(): void {
    const draft = this.draft();
    if (!draft || draft.path.length < 3) {
      return;
    }

    this.polygons.update((polygons) => [...polygons, { id: crypto.randomUUID(), kind: draft.kind, path: draft.path }]);
    this.draft.set(null);
  }

  protected cancelDraft(): void {
    this.draft.set(null);
  }

  protected selectPolygon(id: string): void {
    if (!this.draft()) {
      this.selectedPolygonId.set(id);
    }
  }

  protected deleteSelected(): void {
    const id = this.selectedPolygonId();
    this.polygons.update((polygons) => polygons.filter((polygon) => polygon.id !== id));
    this.selectedPolygonId.set(null);
  }

  /** Reads the shape back after the user dragged a vertex of an editable polygon. */
  protected syncPolygon(index: number): void {
    const googlePolygon = this.polygonComponents()[index]?.polygon;
    if (!googlePolygon) {
      return;
    }

    const path = googlePolygon.getPath().getArray().map((latLng) => latLng.toJSON());
    this.polygons.update((polygons) => polygons.map((polygon, i) => (i === index ? { ...polygon, path } : polygon)));
  }

  /** Google Maps needs real colour strings, so the CSS custom properties are resolved once. */
  private readColors(): void {
    const style = getComputedStyle(this.host.nativeElement);
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;

    this.colors.set({
      area: read('--uc-map-area-color-resolved', '#2f5bd3'),
      exclusion: read('--uc-map-exclusion-color-resolved', '#d32f2f'),
      marker: read('--uc-map-marker-color-resolved', '#2f5bd3'),
    });
  }
}
