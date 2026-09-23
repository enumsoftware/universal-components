export interface UcMapPosition {
  lat: number;
  lng: number;
}

export interface UcMapMarker {
  id: string | number;
  position: UcMapPosition;
  color?: string;
  title?: string;
}

export const MAP_POLYGON_KIND_OPTIONS = ['area', 'exclusion'] as const;
export type MapPolygonKind = (typeof MAP_POLYGON_KIND_OPTIONS)[number];

export interface UcMapPolygon {
  id: string;
  kind: MapPolygonKind;
  path: UcMapPosition[];
}

/**
 * - `view`: shows markers; clicks on markers are reported.
 * - `pick`: a click sets `selectedPosition`; the marker can be dragged.
 * - `polygons`: draw, reshape and delete area and exclusion polygons.
 */
export const MAP_MODE_OPTIONS = ['view', 'pick', 'polygons'] as const;
export type MapMode = (typeof MAP_MODE_OPTIONS)[number];
