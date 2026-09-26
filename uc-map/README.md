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

## Map controls

Google's own map buttons are turned off and replaced with library components, so the map matches the
rest of the app: a `uc-segmented-toggle` for Map / Satellite in the top-left corner, a full screen
`uc-icon-button` in the top-right, and a camera controls button in the bottom-right. Like Google's own
camera control, that button starts closed and opens a panel with the pan arrows and, beside them, the
zoom buttons; Escape closes it again. Each control can be hidden with an input; all are shown by
default.

| Input | Control |
|---|---|
| `zoomControl` | The + and - zoom buttons. Zooming with the wheel or a pinch still works. |
| `cameraControl` | The arrow buttons that pan the map. Dragging still works. |
| `mapTypeControl` | The Map / Satellite switch. Satellite shows imagery with labels. |
| `fullscreenControl` | The full screen button. It puts the whole component, toolbar included, in full screen, and is hidden where the browser cannot do that (Safari on iPhone). |

```html
<uc-map [apiKey]="key" [cameraControl]="false" [fullscreenControl]="false" />
```

The buttons are labelled for screen readers with `zoomInLabel`, `zoomOutLabel`, `panUpLabel`,
`panDownLabel`, `panLeftLabel`, `panRightLabel`, `mapTypeLabel`, `roadmapLabel`, `satelliteLabel`,
`fullscreenLabel`, `exitFullscreenLabel` and `cameraControlsLabel`, which default to English. Street View is always off.

## Theming

| Variable | Default |
|---|---|
| `--uc-map-height` | `400px` |
| `--uc-map-radius` | `0.75rem` |
| `--uc-map-area-color` | `--uc-primary-color` |
| `--uc-map-exclusion-color` | `--uc-error-color` |
| `--uc-map-marker-color` | `--uc-primary-color` |
| `--uc-map-control-background` | `--uc-background-color` |
| `--uc-map-control-border` | `1px solid` foreground at 8% |
| `--uc-map-control-shadow` | a soft two-layer shadow |
| `--uc-map-control-size` | `2.5rem`, the size of every control button; the pan arrows are 80% of it |
| `--uc-map-control-hover-background` | foreground at 8% |
| `--uc-map-control-radius` | `0.75rem` |
| `--uc-map-control-inset` | `0.75rem`, the gap between the controls and the map edge |

Colours are read once when the map loads, because Google Maps needs concrete colour values.

## Accessibility

Picking a point on a map is not possible with a keyboard. Pair `pick` mode with another way to
enter a location, such as an address search.
