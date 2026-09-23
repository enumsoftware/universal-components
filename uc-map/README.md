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
| `view` | Shows `markers`, clustered when `cluster` is true. `markerClick` reports clicks. |
| `pick` | A click sets `selectedPosition` (two-way). The marker can be dragged. |
| `polygons` | Toolbar to draw `area` and `exclusion` polygons, drag vertices, select and delete. `polygons` is two-way. |

Advanced markers (coloured pins) need a `mapId`; without one classic markers are used.

## Theming

| Variable | Default |
|---|---|
| `--uc-map-height` | `400px` |
| `--uc-map-radius` | `0.75rem` |
| `--uc-map-area-color` | `--primary-color` |
| `--uc-map-exclusion-color` | `--error-color` |
| `--uc-map-marker-color` | `--primary-color` |

Colours are read once when the map loads, because Google Maps needs concrete colour values.

## Accessibility

Picking a point on a map is not possible with a keyboard. Pair `pick` mode with another way to
enter a location, such as an address search.
