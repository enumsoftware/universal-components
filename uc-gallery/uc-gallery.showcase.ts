import { defineShowcase, object, text } from '../workbench/core';
import { samplePhoto } from './sample-images';
import { UcGallery, type UcGalleryImage } from './uc-gallery';

const IMAGES: UcGalleryImage[] = [
  { url: samplePhoto('Photo 1', '#3a6ea5'), alt: 'Damaged pavement' },
  { url: samplePhoto('Photo 2', '#5a8f29'), alt: 'Overgrown hedge' },
  { url: samplePhoto('Photo 3', '#a55a3a'), alt: 'Broken street light' },
];

export default defineShowcase({
  id: 'components/gallery',
  group: 'Components',
  title: 'Gallery',
  layout: 'padded',
  component: UcGallery,
  knobs: {
    images: object(IMAGES),
    closeLabel: text('Close'),
    previousLabel: text('Previous image'),
    nextLabel: text('Next image'),
  },
  examples: [
    { name: 'Single image', props: { images: [IMAGES[0]] } },
    {
      name: 'Croatian labels',
      props: {
        closeLabel: 'Zatvori',
        previousLabel: 'Prethodna slika',
        nextLabel: 'Sljedeća slika',
        openLabel: 'Otvori sliku {index} od {count}',
      },
    },
  ],
});
