import { bool, defineShowcase, object, text } from '../workbench/core';
import { TreeCustomRowsExample } from './examples/custom-rows';
import { TreeFileExplorerExample } from './examples/file-explorer';
import { UcTree } from './uc-tree';
import type { UcTreeNode } from './uc-tree-node';

const NODES: UcTreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: 'src/components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'src/components/button.ts', label: 'button.ts', icon: 'file-ts' },
          { id: 'src/components/select.ts', label: 'select.ts', icon: 'file-ts' },
          { id: 'src/components/tree.ts', label: 'tree.ts', icon: 'file-ts' },
        ],
      },
      {
        id: 'src/themes',
        label: 'themes',
        icon: 'folder',
        children: [
          { id: 'src/themes/light.css', label: 'light.css', icon: 'file-css' },
          { id: 'src/themes/dark.css', label: 'dark.css', icon: 'file-css' },
        ],
      },
      { id: 'src/index.ts', label: 'index.ts', icon: 'file-ts' },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    icon: 'folder',
    children: [
      { id: 'docs/readme.md', label: 'readme.md', icon: 'file-md' },
      { id: 'docs/legacy.md', label: 'legacy.md', icon: 'file-md', disabled: true },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: 'file-code' },
];

export default defineShowcase({
  id: 'components/tree',
  group: 'Components',
  title: 'Tree',
  layout: 'padded',
  component: UcTree,
  knobs: {
    nodes: object(NODES),
    ariaLabel: text('Project files'),
    expandedIds: object(['src']),
    selectedId: text('src/index.ts'),
    filter: text(''),
    indent: text(''),
    emptyText: text('No matches.'),
    expandOnActivate: bool(true),
    selectBranches: bool(false),
  },
  examples: [
    { name: 'Branches Selectable', props: { selectBranches: true } },
    { name: 'Filter and Expand Controls', component: TreeFileExplorerExample },
    { name: 'Custom Rows', component: TreeCustomRowsExample },
  ],
});
