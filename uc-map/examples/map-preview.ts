import { JsonPipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { UcMap } from '../uc-map';
import type { MapMode, UcMapMarker, UcMapMarkerIcon, UcMapPolygon, UcMapPosition } from '../uc-map-types';

const LIGHT_ICON: UcMapMarkerIcon = {
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#FDD835" stroke="#5f4b00" stroke-width="2"/>
    <path d="M16 8a6 6 0 0 0-3 11.2V22h6v-2.8A6 6 0 0 0 16 8zm-3 16h6v2h-6z" fill="#5f4b00"/>
  </svg>`,
  width: 32,
  anchor: { x: 16, y: 16 },
};

const MARKER_COLORS = ['#4D4D4D', '#4CAF50', '#2F5BD3', '#D32F2F'];

/**
 * Extra markers scattered around `center`, so clustering has something to group. A fixed-seed
 * generator keeps them in the same places on every render.
 */
function scatteredMarkers(center: UcMapPosition, count: number): UcMapMarker[] {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: count }, (_, index) => ({
    id: `scattered-${index}`,
    position: { lat: center.lat + (random() - 0.5) * 0.04, lng: center.lng + (random() - 0.5) * 0.06 },
    color: MARKER_COLORS[index % MARKER_COLORS.length],
    title: `Report ${index + 1}`,
  }));
}

/** Needs a Google Maps API key; without one the map shows its error state. */
@Component({
  selector: 'uc-map-preview',
  imports: [UcMap, JsonPipe],
  template: `
    <uc-map
      [apiKey]="apiKey()"
      [mapId]="mapId() || null"
      [mode]="mode()"
      [center]="center"
      [zoom]="14"
      [markers]="markers()"
      [cluster]="cluster()"
      [zoomControl]="zoomControl()"
      [cameraControl]="cameraControl()"
      [mapTypeControl]="mapTypeControl()"
      [fullscreenControl]="fullscreenControl()"
      [(selectedPosition)]="selected"
      [(polygons)]="polygons"
    />
    <pre>{{ selected() | json }}</pre>
  `,
})
export class MapPreview {
  readonly apiKey = input<string>('');
  readonly mapId = input<string>('DEMO_MAP_ID');
  readonly mode = input<MapMode>('view');
  readonly cluster = input<boolean>(true);
  readonly zoomControl = input<boolean>(true);
  readonly cameraControl = input<boolean>(true);
  readonly mapTypeControl = input<boolean>(true);
  readonly fullscreenControl = input<boolean>(true);
  /** Extra generated markers on top of the three named ones. */
  readonly markerCount = input<number | null>(0);

  protected readonly center: UcMapPosition = { lat: 42.6498, lng: 18.0933 };
  private readonly namedMarkers: UcMapMarker[] = [
    { id: 1, position: { lat: 42.6505, lng: 18.0912 }, color: '#4D4D4D', title: 'Roads' },
    { id: 2, position: { lat: 42.6489, lng: 18.0951 }, color: '#4CAF50', title: 'Green surfaces' },
    { id: 3, position: { lat: 42.6471, lng: 18.0898 }, title: 'Street lights', icon: LIGHT_ICON },
  ];
  protected readonly markers = computed(() => [
    ...this.namedMarkers,
    ...scatteredMarkers(this.center, Math.max(0, this.markerCount() ?? 0)),
  ]);
  protected readonly selected = signal<UcMapPosition | null>(null);
  protected readonly polygons = signal<UcMapPolygon[]>([]);
}
