import { color, defineShowcase, text } from '../workbench/core';
import { UcAvatar } from './uc-avatar';

export default defineShowcase({
  id: 'components/avatar',
  group: 'Components',
  title: 'Avatar',
  component: UcAvatar,
  knobs: {
    imageUrl: text(null, { placeholder: 'Falls back to initials, then the icon' }),
    initials: text('JD'),
    backgroundColor: color('#146c94'),
    icon: text('user'),
    size: text('2.5rem'),
    alt: text('Jane Doe'),
  },
  examples: [
    { name: 'Image', props: { imageUrl: 'https://i.pravatar.cc/160?img=47' } },
    { name: 'Icon Fallback', props: { initials: null, icon: 'user' } },
    { name: 'Custom Appearance', props: { initials: 'UC', backgroundColor: '#b42318', size: '4rem' } },
  ],
});
