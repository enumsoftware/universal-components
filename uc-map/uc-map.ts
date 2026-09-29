/// <reference types="google.maps" />
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import {
  UcButton,
  UcIconButton,
  UcSegmentedToggle,
  UcSegmentedToggleItem,
} from '@enumsoftware/universal-components';
import { GoogleMap, MapAdvancedMarker, MapMarker, MapMarkerClusterer, MapPolygon } from '@angular/google-maps';
import { CLUSTER_ICON_SIZE, clusterIconSvg, type UcMapClusterStyle } from './uc-map-cluster';
import { loadGoogleMaps, loadMarkerClusterer } from './uc-map-loader';
import type {
  MapGestureHandling,
  MapMode,
  MapPolygonKind,
  UcMapMarker,
  UcMapMarkerIcon,
  UcMapPolygon,
  UcMapPosition,
} from './uc-map-types';

interface DraftPolygon {
  kind: MapPolygonKind;
  path: UcMapPosition[];
}

const DEFAULT_ICON_SIZE = 32;

/**
 * The part of @googlemaps/markerclusterer's `Renderer` that uc-map implements. Typed here so type
 * checking an app never needs that optional package.
 */
interface ClusterRenderer {
  render(cluster: {
    count: number;
    position: google.maps.LatLng;
  }): google.maps.Marker | google.maps.marker.AdvancedMarkerElement;
}

let nextControlsId = 0;

/** Cache key for the pick marker's icon element, so it never collides with a marker id. */
const PICK_MARKER = Symbol('pick-marker');

function iconBox(icon: UcMapMarkerIcon): { width: number; height: number; anchor: { x: number; y: number } } {
  const width = icon.width ?? DEFAULT_ICON_SIZE;
  const height = icon.height ?? width;
  return { width, height, anchor: icon.anchor ?? { x: width / 2, y: height } };
}

/** The box around every service area (`area` polygon), or null when there is none to fit. */
function areaBounds(polygons: readonly UcMapPolygon[]): google.maps.LatLngBoundsLiteral | null {
  const points = polygons.filter((polygon) => polygon.kind === 'area').flatMap((polygon) => polygon.path);
  if (points.length === 0) {
    return null;
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  return { north: Math.max(...lats), south: Math.min(...lats), east: Math.max(...lngs), west: Math.min(...lngs) };
}

/** A touch screen as the main input, where a swipe on the map should move it rather than the page. */
const TOUCH_FIRST = '(pointer: coarse)';

/** Inline markup becomes a data URL so it is loaded as an image and never parsed into the page. */
function svgSource(svg: string): string {
  const trimmed = svg.trim();
  return trimmed.startsWith('<') ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmed)}` : trimmed;
}

/**
 * Google Maps wrapper for Enum apps. Loads the Maps API on first use, shows markers (optionally
 * clustered), lets the user pick a position, or draw area and exclusion polygons. Advanced
 * markers need a `mapId`; without one classic markers are used.
 */
@Component({
  selector: 'uc-map',
  imports: [
    GoogleMap,
    MapAdvancedMarker,
    MapMarker,
    MapMarkerClusterer,
    MapPolygon,
    UcButton,
    UcIconButton,
    UcSegmentedToggle,
    UcSegmentedToggleItem,
  ],
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
  /**
   * How scrolling and touch move the map. See `MapGestureHandling`. Unset, it follows the device:
   * `greedy` when the main input is touch, so one finger moves the map, and `cooperative` with a
   * mouse or trackpad, so scrolling the page does not get caught by the map.
   */
  gestureHandling = input<MapGestureHandling | null>(null);
  markers = input<readonly UcMapMarker[]>([]);
  /** Groups nearby markers in `view` mode. The clusterer library is loaded only when this is on. */
  cluster = input<boolean>(true);
  /** A cluster's name for screen readers and its tooltip. `{count}` is the number of markers in it. */
  clusterLabel = input<string>('{count} markers');
  /** Default icon for every marker and for the pick marker. A marker's own `icon` wins. */
  markerIcon = input<UcMapMarkerIcon | null>(null);

  /*
   * The map's own controls, drawn with library components in place of Google's. Each can be hidden;
   * zooming with the wheel or a pinch and dragging the map keep working without them.
   */
  /** The + and - zoom buttons. */
  zoomControl = input<boolean>(true);
  /** The arrow buttons that pan the map. */
  cameraControl = input<boolean>(true);
  /** The Map / Satellite switch. */
  mapTypeControl = input<boolean>(true);
  /** The full screen button. Also hidden where the browser cannot show an element full screen. */
  fullscreenControl = input<boolean>(true);

  selectedPosition = model<UcMapPosition | null>(null);
  polygons = model<UcMapPolygon[]>([]);
  /**
   * Shows the area and exclusion polygons. In `polygons` mode they are always shown, since they are
   * being drawn and edited there. Hidden areas are not fitted on screen; showing them fits them.
   */
  showPolygons = input<boolean>(true);
  /**
   * Zoom and move the map so every service area (`area` polygon) fits on screen, when the map loads
   * and whenever the app passes in new polygons. Areas the user draws or edits never move the view.
   */
  fitToAreas = input<boolean>(true);
  /** Space in pixels kept between the fitted areas and the edge of the map. */
  fitPadding = input<number>(48);

  loadingLabel = input<string>('Loading map');
  errorLabel = input<string>('The map could not be loaded.');
  newAreaLabel = input<string>('New area');
  newExclusionLabel = input<string>('New exclusion');
  finishLabel = input<string>('Finish shape');
  cancelLabel = input<string>('Cancel');
  deleteLabel = input<string>('Delete selected');
  drawingHint = input<string>('Click on the map to add points. At least three are needed.');
  zoomInLabel = input<string>('Zoom in');
  zoomOutLabel = input<string>('Zoom out');
  panUpLabel = input<string>('Move up');
  panDownLabel = input<string>('Move down');
  panLeftLabel = input<string>('Move left');
  panRightLabel = input<string>('Move right');
  mapTypeLabel = input<string>('Map type');
  roadmapLabel = input<string>('Map');
  satelliteLabel = input<string>('Satellite');
  fullscreenLabel = input<string>('Full screen');
  exitFullscreenLabel = input<string>('Exit full screen');
  cameraControlsLabel = input<string>('Map camera controls');

  markerClick = output<UcMapMarker>();

  private readonly polygonComponents = viewChildren(MapPolygon);
  private readonly mapInstance = signal<google.maps.Map | null>(null);
  protected readonly polygonsVisible = computed(() => this.showPolygons() || this.mode() === 'polygons');
  /** Read once up front for the map's first options, then kept current by a media query listener. */
  private readonly touchFirst = signal(typeof matchMedia === 'function' && matchMedia(TOUCH_FIRST).matches);
  protected readonly resolvedGestureHandling = computed<MapGestureHandling>(
    () => this.gestureHandling() ?? (this.touchFirst() ? 'greedy' : 'cooperative'),
  );
  /** The last polygons this component produced itself, so its own edits are not fitted to. */
  private ownPolygons: readonly UcMapPolygon[] | null = null;
  private fittedPolygons: readonly UcMapPolygon[] | null = null;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly clustererLoaded = signal(false);
  /** Markers show unclustered until the clusterer has loaded, and stay so if it fails to load. */
  protected readonly clustered = computed(() => this.cluster() && this.clustererLoaded());
  protected readonly draft = signal<DraftPolygon | null>(null);
  protected readonly selectedPolygonId = signal<string | null>(null);
  protected readonly colors = signal({
    area: '#2f5bd3',
    exclusion: '#d32f2f',
    marker: '#2f5bd3',
    cluster: { background: '#2f5bd3', color: '#ffffff', borderColor: '#ffffff', borderWidth: 0 } as UcMapClusterStyle,
  });

  /**
   * Draws each cluster as an SVG circle with its count (`99+` above 99), in the `--uc-map-cluster-*`
   * colours. Advanced markers are used with a `mapId`, classic ones without, as for single markers.
   *
   * A new renderer is made whenever those colours change, such as on a theme switch: the clusterer
   * keeps the icons it has drawn, and google-map rebuilds it, redrawing every icon, only when its
   * `renderer` input changes.
   */
  protected readonly clusterRenderer = computed<ClusterRenderer>(() => {
    const style = this.colors().cluster;
    return { render: (cluster) => this.renderCluster(cluster, style) };
  });

  private renderCluster(
    { count, position }: { count: number; position: google.maps.LatLng },
    style: UcMapClusterStyle,
  ): google.maps.Marker | google.maps.marker.AdvancedMarkerElement {
    const url = svgSource(clusterIconSvg(count, style));
    const title = this.clusterLabel().replaceAll('{count}', String(count));
    // Above every single marker, and bigger clusters above smaller ones.
    const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;

    if (this.mapId()) {
      const icon = document.createElement('img');
      icon.src = url;
      icon.width = CLUSTER_ICON_SIZE;
      icon.height = CLUSTER_ICON_SIZE;
      icon.alt = '';
      // Advanced markers put the bottom centre of their content on the position; centre it instead.
      icon.style.transform = 'translateY(50%)';
      return new google.maps.marker.AdvancedMarkerElement({ position, content: icon, title, zIndex });
    }

    return new google.maps.Marker({
      position,
      title,
      zIndex,
      icon: {
        url,
        scaledSize: new google.maps.Size(CLUSTER_ICON_SIZE, CLUSTER_ICON_SIZE),
        anchor: new google.maps.Point(CLUSTER_ICON_SIZE / 2, CLUSTER_ICON_SIZE / 2),
      },
    });
  }

  /** `hybrid` is satellite imagery with labels, which is what Google's own Satellite button shows. */
  protected readonly mapType = signal<string>('roadmap');
  /** Bound to google-map's own input: changing `options` would reset the view to `center` and `zoom`. */
  protected readonly mapTypeId = computed(() => this.mapType() as google.maps.MapTypeId);
  protected readonly fullscreenSupported = signal(false);
  protected readonly isFullscreen = signal(false);
  /** The pan and zoom panel starts closed behind one button, as Google's camera control does. */
  protected readonly controlsOpen = signal(false);
  protected readonly controlsId = `uc-map-camera-controls-${nextControlsId++}`;

  protected readonly options = computed<google.maps.MapOptions>(() => ({
    mapId: this.mapId() ?? undefined,
    clickableIcons: false,
    // Google's buttons are replaced by the library's own, in the template.
    disableDefaultUI: true,
    // Read untracked: a later change is applied to the map directly, see the constructor.
    gestureHandling: untracked(() => this.resolvedGestureHandling()),
  }));

  protected readonly pickMarker = PICK_MARKER;

  private readonly pins = new Map<string, google.maps.marker.PinElement>();
  private readonly iconElements = new Map<unknown, { icon: UcMapMarkerIcon; element: HTMLImageElement }>();
  private readonly classicIcons = new WeakMap<
    UcMapMarkerIcon,
    { static: google.maps.MarkerOptions; draggable: google.maps.MarkerOptions }
  >();
  private readonly classicDefault: google.maps.MarkerOptions = {};
  private readonly classicDraggable: google.maps.MarkerOptions = { draggable: true };

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Set on the map directly rather than through `options`: google-map re-applies `center` and `zoom`
    // whenever `options` change, which would throw away a fitted or panned view on every mode switch.
    effect(() => {
      this.mapInstance()?.setOptions({ draggableCursor: this.mode() === 'view' ? null : 'crosshair' });
    });

    effect(() => {
      this.mapInstance()?.setOptions({ gestureHandling: this.resolvedGestureHandling() });
    });

    effect(() => {
      const map = this.mapInstance();
      const polygons = this.polygons();
      if (
        !map ||
        !this.fitToAreas() ||
        !this.polygonsVisible() ||
        polygons === this.ownPolygons ||
        polygons === this.fittedPolygons
      ) {
        return;
      }

      const bounds = areaBounds(polygons);
      if (bounds) {
        this.fittedPolygons = polygons;
        map.fitBounds(bounds, this.fitPadding());
      }
    });

    effect(() => {
      if (this.cluster() && !this.clustererLoaded() && typeof window !== 'undefined') {
        loadMarkerClusterer()
          .then(() => this.clustererLoaded.set(true))
          .catch(() => undefined);
      }
    });

    afterNextRender(() => {
      const host = this.host.nativeElement;
      const onFullscreenChange = () => this.isFullscreen.set(document.fullscreenElement === host);
      this.fullscreenSupported.set(document.fullscreenEnabled === true);
      document.addEventListener('fullscreenchange', onFullscreenChange);
      destroyRef.onDestroy(() => document.removeEventListener('fullscreenchange', onFullscreenChange));

      // A tablet can gain or lose a keyboard and trackpad while the map is open.
      if (typeof matchMedia === 'function') {
        const touchQuery = matchMedia(TOUCH_FIRST);
        const onTouchChange = (event: MediaQueryListEvent) => this.touchFirst.set(event.matches);
        touchQuery.addEventListener('change', onTouchChange);
        destroyRef.onDestroy(() => touchQuery.removeEventListener('change', onTouchChange));
      }

      this.readColors();
      this.watchTheme(destroyRef);
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

  protected toggleControls(): void {
    this.controlsOpen.update((open) => !open);
  }

  protected zoomBy(step: number): void {
    const map = this.map();
    if (map) {
      map.setZoom((map.getZoom() ?? this.zoom()) + step);
    }
  }

  /** Moves the view by a third of the map in the given direction, as Google's own arrows do. */
  protected pan(x: -1 | 0 | 1, y: -1 | 0 | 1): void {
    const map = this.map();
    if (map) {
      const canvas = map.getDiv();
      map.panBy((x * canvas.clientWidth) / 3, (y * canvas.clientHeight) / 3);
    }
  }

  /** The whole component goes full screen, so the library's controls and the toolbar come along. */
  protected toggleFullscreen(): void {
    const host = this.host.nativeElement;
    if (document.fullscreenElement === host) {
      void document.exitFullscreen();
    } else {
      void host.requestFullscreen();
    }
  }

  protected map(): google.maps.Map | undefined {
    return this.mapInstance() ?? undefined;
  }

  protected onMapInitialized(map: google.maps.Map): void {
    this.mapInstance.set(map);
  }

  private setOwnPolygons(polygons: UcMapPolygon[]): void {
    this.ownPolygons = polygons;
    this.polygons.set(polygons);
  }

  /** Advanced marker content: the custom icon when there is one, otherwise a coloured pin. */
  protected contentFor(
    key: unknown,
    icon: UcMapMarkerIcon | null | undefined,
    color: string | undefined,
  ): Node | google.maps.marker.PinElement {
    return icon ? this.iconElement(key, icon) : this.pinFor(color);
  }

  /** Classic marker options. Cached per icon so change detection does not reset the marker. */
  protected classicOptionsFor(icon: UcMapMarkerIcon | null | undefined, draggable = false): google.maps.MarkerOptions {
    if (!icon) {
      return draggable ? this.classicDraggable : this.classicDefault;
    }

    let options = this.classicIcons.get(icon);
    if (!options) {
      const { width, height, anchor } = iconBox(icon);
      const markerIcon: google.maps.Icon = {
        url: svgSource(icon.svg),
        scaledSize: new google.maps.Size(width, height),
        anchor: new google.maps.Point(anchor.x, anchor.y),
      };
      options = { static: { icon: markerIcon }, draggable: { icon: markerIcon, draggable: true } };
      this.classicIcons.set(icon, options);
    }

    return draggable ? options.draggable : options.static;
  }

  protected polygonOptions(kind: MapPolygonKind, selected: boolean, editable: boolean): google.maps.PolygonOptions {
    const color = kind === 'area' ? this.colors().area : this.colors().exclusion;
    return {
      strokeColor: color,
      strokeWeight: selected ? 3 : 2,
      fillColor: color,
      fillOpacity: kind === 'area' ? 0.12 : 0.25,
      editable,
      // Only when editing polygons: in pick mode a click inside an area (such as a service area)
      // must reach the map and place the marker, and in view mode areas are just shown.
      clickable: this.mode() === 'polygons',
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

    this.setOwnPolygons([...this.polygons(), { id: crypto.randomUUID(), kind: draft.kind, path: draft.path }]);
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
    this.setOwnPolygons(this.polygons().filter((polygon) => polygon.id !== id));
    this.selectedPolygonId.set(null);
  }

  /** Reads the shape back after the user dragged a vertex of an editable polygon. */
  protected syncPolygon(index: number): void {
    const googlePolygon = this.polygonComponents()[index]?.polygon;
    if (!googlePolygon) {
      return;
    }

    const path = googlePolygon.getPath().getArray().map((latLng) => latLng.toJSON());
    this.setOwnPolygons(this.polygons().map((polygon, i) => (i === index ? { ...polygon, path } : polygon)));
  }

  /** Each marker needs its own element: a DOM node can only be shown by one marker at a time. */
  private iconElement(key: unknown, icon: UcMapMarkerIcon): HTMLImageElement {
    const cached = this.iconElements.get(key);
    if (cached?.icon === icon) {
      return cached.element;
    }

    const { width, height, anchor } = iconBox(icon);
    const element = document.createElement('img');
    element.src = svgSource(icon.svg);
    element.width = width;
    element.height = height;
    element.alt = '';
    element.draggable = false;
    // Advanced markers put the bottom centre of their content on the position; shift to the anchor.
    element.style.transform = `translate(${width / 2 - anchor.x}px, ${height - anchor.y}px)`;
    this.iconElements.set(key, { icon, element });
    return element;
  }

  private colorProbe: HTMLElement | null = null;
  private colorCanvas: CanvasRenderingContext2D | null | undefined;

  /**
   * A CSS colour as plain rgb() or rgba(). Theme tokens are often relative or wide-gamut colours
   * (`oklch(from #161c2d calc(l * 0.8) c h)`), which some browsers cannot draw inside the SVG images
   * used for pins and clusters. The browser resolves the colour on a hidden element, and one pixel
   * drawn on a canvas turns it into sRGB. Without a canvas (tests, very old browsers) the value is
   * returned as the browser computed it.
   */
  private resolveColor(value: string): string {
    if (!value || typeof document === 'undefined') {
      return value;
    }

    if (!this.colorProbe) {
      this.colorProbe = document.createElement('span');
      this.colorProbe.hidden = true;
      this.colorProbe.setAttribute('aria-hidden', 'true');
      this.host.nativeElement.appendChild(this.colorProbe);
    }

    const probe = this.colorProbe;
    probe.style.color = '';
    probe.style.color = value;
    if (!probe.style.color) {
      return value;
    }
    const computed = getComputedStyle(probe).color || value;

    if (this.colorCanvas === undefined) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.colorCanvas = canvas.getContext('2d', { willReadFrequently: true });
      } catch {
        this.colorCanvas = null;
      }
    }

    const context = this.colorCanvas;
    if (!context) {
      return computed;
    }

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = computed;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    return alpha === 255
      ? `rgb(${red}, ${green}, ${blue})`
      : `rgba(${red}, ${green}, ${blue}, ${Number((alpha / 255).toFixed(3))})`;
  }

  /**
   * Reads the colours again when the theme changes. A theme is switched with `data-theme` (or a class
   * or inline style) on the map or any element above it, not only on <html>, or by the system light
   * and dark setting.
   */
  private watchTheme(destroyRef: DestroyRef): void {
    const observer = new MutationObserver(() => this.readColors());
    for (let element: Element | null = this.host.nativeElement; element; element = element.parentElement) {
      observer.observe(element, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    }
    destroyRef.onDestroy(() => observer.disconnect());

    if (typeof matchMedia === 'function') {
      const scheme = matchMedia('(prefers-color-scheme: dark)');
      const onSchemeChange = () => this.readColors();
      scheme.addEventListener('change', onSchemeChange);
      destroyRef.onDestroy(() => scheme.removeEventListener('change', onSchemeChange));
    }
  }

  /**
   * Google Maps needs real colour strings, so the CSS custom properties are resolved here, on load and
   * on every theme change. Unchanged colours are not set again, so an unrelated class change on an
   * ancestor does not rebuild the clusterer.
   */
  private readColors(): void {
    const style = getComputedStyle(this.host.nativeElement);
    const read = (name: string, fallback: string) => this.resolveColor(style.getPropertyValue(name).trim()) || fallback;

    const colors = {
      area: read('--uc-map-area-color-resolved', '#2f5bd3'),
      exclusion: read('--uc-map-exclusion-color-resolved', '#d32f2f'),
      marker: read('--uc-map-marker-color-resolved', '#2f5bd3'),
      cluster: {
        background: read('--uc-map-cluster-background-resolved', '#2f5bd3'),
        color: read('--uc-map-cluster-color-resolved', '#ffffff'),
        borderColor: read('--uc-map-cluster-border-color-resolved', '#ffffff'),
        borderWidth: parseFloat(style.getPropertyValue('--uc-map-cluster-border-width-resolved')) || 0,
      },
    };
    if (JSON.stringify(colors) !== JSON.stringify(this.colors())) {
      this.colors.set(colors);
    }
  }
}
