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

## Cluster icons

Clusters are drawn as a circle with the number of markers in them, from 0 to 99 and then `99+`. Style
them with CSS custom properties on `uc-map` or in the theme:

| Variable | Default |
|---|---|
| `--uc-map-cluster-background` | `--uc-primary-color` |
| `--uc-map-cluster-color` | `--uc-inverse-foreground-color`, the number |
| `--uc-map-cluster-border-color` | `--uc-background-color` |
| `--uc-map-cluster-border-width` | `0`, no border; set a width such as `2px` to add one |

```css
uc-map.reports {
  --uc-map-cluster-background: #d32f2f;
  --uc-map-cluster-color: #fff;
  --uc-map-cluster-border-color: #fff;
  --uc-map-cluster-border-width: 2px;
}
```

Like the other map colours they are read when the map loads and again whenever the theme changes, so
clusters, areas and pins follow a switch between light and dark. The icon is an SVG image, so its
number uses the system font rather than the page's web font. `clusterLabel` (default
`'{count} markers'`) names each cluster for screen readers and its tooltip.

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

## Showing and hiding areas

`showPolygons` (default `true`) shows or hides the area and exclusion polygons, for example behind a
"Show service areas" switch. In `polygons` mode they are always shown, since they are drawn and edited
there. The polygons themselves are kept: hiding them only stops drawing them.

```html
<uc-map [apiKey]="key" [polygons]="serviceAreas()" [showPolygons]="showAreas()" />
```

## Fitting service areas

When the map has `area` polygons, it zooms and moves so all of them fit on screen, with
`fitPadding` pixels (48 by default) kept free around them. It does this when the map loads and
whenever the app passes in new polygons, for example after loading them or when switching records.
Areas the user draws, reshapes or deletes on the map never move the view, and exclusions are not
fitted on their own. Hidden areas (`showPolygons` off) are not fitted; showing them fits them. Set `fitToAreas` to `false` to keep `center` and `zoom` instead.

```html
<uc-map [apiKey]="key" mode="view" [polygons]="serviceAreas()" [fitPadding]="64" />
```

## Scrolling and touch

`gestureHandling` sets how scrolling and touch move the map, as in the Google Maps SDK. Left unset, it
follows the device: `greedy` when the main input is a touch screen (`(pointer: coarse)`), so one finger
moves the map, and `cooperative` with a mouse or trackpad, so scrolling the page is not caught by the
map. It updates if that changes, such as a tablet getting a keyboard and trackpad attached.

On a phone, `greedy` means a swipe that starts on the map moves the map, not the page. For a tall map in
a long page, set `cooperative` so the page can still be scrolled past it.

| Value | Behaviour |
|---|---|
| `cooperative` | Ctrl + scroll, or two fingers on touch, moves the map. Plain scrolling scrolls the page, so a map in a long page does not trap it. |
| `greedy` | Every scroll and touch gesture moves the map. Suits a full-screen map. |
| `none` | Gestures never move the map; only its buttons do. |
| `auto` | Google picks: `cooperative` when the page scrolls or the map is in an iframe, otherwise `greedy`. |

```html
<uc-map [apiKey]="key" gestureHandling="greedy" />
```

It can change while the map is shown without resetting the view.

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
| `streetViewControl` | The Street View button, bottom left. **Off by default**, see below. |

```html
<uc-map [apiKey]="key" [cameraControl]="false" [fullscreenControl]="false" />
```

The buttons are labelled for screen readers with `zoomInLabel`, `zoomOutLabel`, `panUpLabel`,
`panDownLabel`, `panLeftLabel`, `panRightLabel`, `mapTypeLabel`, `roadmapLabel`, `satelliteLabel`,
`fullscreenLabel`, `exitFullscreenLabel`, `cameraControlsLabel`, `streetViewLabel` and
`exitStreetViewLabel`, which default to English.

## Street View

`streetViewControl` adds a person button in the bottom-left corner, drawn like the other controls
instead of Google's Pegman, and used the same way:

1. **Drag and drop.** Drag the button onto the map. A person follows the pointer, Google's blue lines
   show where Street View exists and `streetViewDragHint` is shown over the map. Dropping it opens the
   panorama nearest to the drop point (Google's own outdoor imagery, as with its Pegman, not uploaded photos), within `streetViewRadius` metres (default 50), turned
   to face that spot. Dropped outside the map, nothing happens. Works with a mouse, a pen and touch.
2. **Press, then click.** Pressing the button without dragging shows the blue lines, turns the cursor
   into a crosshair and shows `streetViewHint`; the next click on the map opens the panorama the same
   way. Pressing it again, or Escape, cancels. This is the way that works from the keyboard. In
   `pick` mode that click does not move the marker.
3. With no panorama nearby, `noStreetViewLabel` is shown instead.
4. While the panorama is open the button becomes a map button (`exitStreetViewLabel`) that goes back;
   the Map / Satellite switch, the camera controls and the drawing toolbar are hidden, and the full
   screen button stays. The panorama keeps Google's own pan, zoom and address controls.

```html
<uc-map [apiKey]="key" [streetViewControl]="true" />
```

It is off by default because every opened panorama is billed as a Dynamic Street View load on the
Maps key; it needs no other API than the Maps JavaScript API. Advanced markers (used when there is a
`mapId`) are not drawn inside panoramas, so the picked point is not visible there.

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

Google Maps needs concrete colour values, so these are read when the map loads and again whenever the
theme changes: a `data-theme`, class or style change on the map or any element above it, or the system
light and dark setting.

## Accessibility

Picking a point on a map is not possible with a keyboard. Pair `pick` mode with another way to
enter a location, such as an address search.

The same goes for opening Street View: dragging needs a pointer, and pressing the button from the
keyboard waits for a click on the map. The button and Escape themselves work from the keyboard.
