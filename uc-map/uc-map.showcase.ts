import { bool, defineShowcase, number, select, text } from '../workbench/core';
import { MapPreview } from './examples/map-preview';
import { MAP_GESTURE_HANDLING_OPTIONS, MAP_MODE_OPTIONS } from './uc-map-types';

export default defineShowcase({
  id: 'components/map',
  group: 'Components',
  title: 'Map',
  layout: 'padded',
  component: MapPreview,
  knobs: {
    apiKey: text('', { placeholder: 'Google Maps API key' }),
    mapId: text('DEMO_MAP_ID'),
    mode: select(MAP_MODE_OPTIONS, 'view'),
    gestureHandling: select([undefined, ...MAP_GESTURE_HANDLING_OPTIONS], undefined, {
      description: 'Unset follows the device: greedy on touch screens, cooperative with a mouse or trackpad.',
    }),
    cluster: bool(true, { description: 'Group nearby markers in view mode.' }),
    withServiceArea: bool(true, { description: 'Start with a sample service area, which the map fits on screen.' }),
    showPolygons: bool(true, { description: 'Show the area and exclusion polygons. Always shown in polygons mode.' }),
    zoomControl: bool(true, { description: 'The + and - zoom buttons.' }),
    cameraControl: bool(true, { description: 'The arrow buttons that pan the map.' }),
    mapTypeControl: bool(true, { description: 'The Map / Satellite switch.' }),
    fullscreenControl: bool(true, { description: 'The full screen button.' }),
    streetViewControl: bool(false, {
      description: 'The Street View button, bottom left. Drag it onto a blue line, or press it and click one.',
    }),
    markerCount: number<number | null>(0, {
      description: 'Extra generated markers, to see clustering at work.',
      min: 0,
      step: 50,
    }),
  },
  examples: [
    {
      name: 'Clustering',
      description: 'Two hundred markers grouped into clusters; zoom in to split them. Turn cluster off to compare.',
      props: { markerCount: 200, cluster: true },
    },
    { name: 'Pick a location', props: { mode: 'pick' } },
    {
      name: 'Street View',
      description: 'Drag the person button bottom left onto a blue line. The map button brings the map back.',
      props: { streetViewControl: true },
    },
    { name: 'Draw service area', props: { mode: 'polygons' } },
    {
      name: 'Fit to service area',
      description: 'The map zooms out from its default view so the whole sample service area fits, with padding.',
      props: { withServiceArea: true },
    },
  ],
});
