import { bool, defineShowcase, text } from '../workbench/core';
import { UcFlag } from './uc-flag';

export default defineShowcase({
  id: 'components/flag',
  group: 'Components',
  title: 'Flag',
  component: UcFlag,
  knobs: {
    countryCode: text('us', { description: 'ISO 3166-1 alpha-2, lowercase.' }),
    size: text('2em'),
    circular: bool(false),
  },
  examples: [
    { name: 'Circular', props: { circular: true } },
    { name: 'Large', props: { size: '4em' } },
    { name: 'GB', props: { countryCode: 'gb' } },
    { name: 'Unknown', props: { countryCode: null } },
  ],
});
