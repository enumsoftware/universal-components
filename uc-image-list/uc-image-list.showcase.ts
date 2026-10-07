import { bool, defineShowcase, number, object } from '../workbench/core';
import { samplePhoto } from '../uc-gallery/sample-images';
import { UcImageList, type UcImageListItem } from './uc-image-list';

const ITEMS: UcImageListItem[] = [
  { id: 1, url: samplePhoto('1', '#3a6ea5'), alt: 'Photo 1', status: 'ready' },
  { id: 2, url: samplePhoto('2', '#5a8f29'), alt: 'Photo 2', status: 'ready' },
  { id: 3, url: samplePhoto('3', '#a55a3a'), alt: 'Photo 3', status: 'uploading' },
];

export default defineShowcase({
  id: 'components/image-list',
  group: 'Components',
  title: 'Image List',
  layout: 'padded',
  component: UcImageList,
  knobs: {
    items: object(ITEMS),
    max: number(5, { min: 1, max: 10 }),
    disabled: bool(false),
    editable: bool(true),
  },
  examples: [
    { name: 'Empty', props: { items: [] } },
    { name: 'Full', description: 'The add tile disappears when the maximum is reached.', props: { max: 3 } },
    { name: 'With error', props: { items: [{ ...ITEMS[0], status: 'error' }] } },
  ],
});
