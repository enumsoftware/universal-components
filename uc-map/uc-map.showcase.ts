import { bool, defineShowcase, number, select, text } from '../workbench/core';
import { MapPreview } from './examples/map-preview';
import { MAP_MODE_OPTIONS } from './uc-map-types';

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
    cluster: bool(true, { description: 'Group nearby markers in view mode.' }),
    zoomControl: bool(true, { description: 'The + and - zoom buttons.' }),
    cameraControl: bool(true, { description: 'The arrow buttons that pan the map.' }),
    mapTypeControl: bool(true, { description: 'The Map / Satellite switch.' }),
    fullscreenControl: bool(true, { description: 'The full screen button.' }),
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
    { name: 'Draw service area', props: { mode: 'polygons' } },
  ],
});
