import { defineShowcase } from '../../core';
import { WbTeamDirectoryExample } from './team-directory';

export default defineShowcase({
  id: 'examples/team-directory',
  group: 'Examples',
  title: 'Team Directory',
  order: 2,
  layout: 'padded',
  component: WbTeamDirectoryExample,
});
