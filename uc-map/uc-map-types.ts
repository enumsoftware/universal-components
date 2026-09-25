export interface UcMapPosition {
  lat: number;
  lng: number;
}

/**
 * A custom SVG marker icon. It is rendered as an image, so scripts and external references inside
 * inline markup never run.
 */
export interface UcMapMarkerIcon {
  /** Inline SVG markup (starting with `<`) or a URL to an SVG file. */
  svg: string;
  /** Width in pixels. Defaults to 32. */
  width?: number;
  /** Height in pixels. Defaults to `width`. */
  height?: number;
  /** The point of the icon that sits on the position, in pixels from its top-left corner. Defaults to the bottom centre. */
  anchor?: { x: number; y: number };
}

export interface UcMapMarker {
  id: string | number;
  position: UcMapPosition;
  color?: string;
  title?: string;
  /** Replaces the coloured pin (and `color`) for this marker. */
  icon?: UcMapMarkerIcon;
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
