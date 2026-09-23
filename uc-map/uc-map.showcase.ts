import { defineShowcase, select, text } from '../workbench/core';
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
  },
  examples: [
    { name: 'Pick a location', props: { mode: 'pick' } },
    { name: 'Draw service area', props: { mode: 'polygons' } },
  ],
});
