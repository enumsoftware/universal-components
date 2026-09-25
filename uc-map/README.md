# UcMap

Google Maps wrapper, published as a separate entry point so apps without maps do not load
Google Maps code:

```ts
import { UcMap, type UcMapMarker } from '@enumsoftware/universal-components/uc-map';
```

Requires `@angular/google-maps` and `@googlemaps/markerclusterer` in the consuming app (optional
peer dependencies). The Maps JavaScript API is loaded on first use with the `apiKey` input; restrict
the key to the app's domains in the Google Cloud console.

## Modes

| Mode | Behaviour |
|---|---|
| `view` | Shows `markers`, clustered when `cluster` is true (the default). `markerClick` reports clicks. |
| `pick` | A click sets `selectedPosition` (two-way). The marker can be dragged. |
| `polygons` | Toolbar to draw `area` and `exclusion` polygons, drag vertices, select and delete. `polygons` is two-way. |

Advanced markers (coloured pins) need a `mapId`; without one classic markers are used.

## Clustering

With `cluster` on (the default), nearby markers in `view` mode are grouped. `@googlemaps/markerclusterer`
is imported only when clustering is first used; until it has loaded, or if it fails to load, markers are
shown unclustered. Set `[cluster]="false"` to always show every marker on its own.

## Custom icons

Give a marker an `icon` to replace its coloured pin, or set `markerIcon` to use one icon for every
marker and for the `pick` marker. A marker's own `icon` wins over `markerIcon`. Works with both
advanced and classic markers.

```ts
const bin: UcMapMarkerIcon = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>', // or '/assets/bin.svg'
  width: 32, // px, default 32
  height: 32, // px, defaults to width
  anchor: { x: 16, y: 32 }, // point on the position, default bottom centre
};
```

`svg` is either inline markup (starting with `<`) or a URL. The icon is shown as an image, so
scripts inside the SVG never run. Inline markup needs the `xmlns` attribute to render.

## Theming

| Variable | Default |
|---|---|
| `--uc-map-height` | `400px` |
| `--uc-map-radius` | `0.75rem` |
| `--uc-map-area-color` | `--uc-primary-color` |
| `--uc-map-exclusion-color` | `--uc-error-color` |
| `--uc-map-marker-color` | `--uc-primary-color` |

Colours are read once when the map loads, because Google Maps needs concrete colour values.

## Accessibility

Picking a point on a map is not possible with a keyboard. Pair `pick` mode with another way to
enter a location, such as an address search.
