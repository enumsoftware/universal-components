import { JsonPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { UcMap } from '../uc-map';
import type { MapMode, UcMapMarker, UcMapPolygon, UcMapPosition } from '../uc-map-types';

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
      [markers]="markers"
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

  protected readonly center: UcMapPosition = { lat: 42.6498, lng: 18.0933 };
  protected readonly markers: UcMapMarker[] = [
    { id: 1, position: { lat: 42.6505, lng: 18.0912 }, color: '#4D4D4D', title: 'Roads' },
    { id: 2, position: { lat: 42.6489, lng: 18.0951 }, color: '#4CAF50', title: 'Green surfaces' },
    { id: 3, position: { lat: 42.6471, lng: 18.0898 }, color: '#FDD835', title: 'Street lights' },
  ];
  protected readonly selected = signal<UcMapPosition | null>(null);
  protected readonly polygons = signal<UcMapPolygon[]>([]);
}
