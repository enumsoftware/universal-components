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

/**
 * How the map reacts to scrolling and touch, as Google Maps' `gestureHandling`:
 * - `cooperative`: Ctrl + scroll (or two fingers on touch) moves the map; plain scrolling scrolls the page.
 * - `greedy`: every scroll and touch gesture moves the map.
 * - `none`: gestures never move the map; only the map's buttons do.
 * - `auto`: Google picks, which is `cooperative` when the page scrolls or the map is in an iframe.
 */
export const MAP_GESTURE_HANDLING_OPTIONS = ['cooperative', 'greedy', 'none', 'auto'] as const;
export type MapGestureHandling = (typeof MAP_GESTURE_HANDLING_OPTIONS)[number];
