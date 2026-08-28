import { Component, signal } from '@angular/core';

import { UcPill } from '../../uc-pill/uc-pill';
import { UcTree } from '../uc-tree';
import { UcTreeNodeDef } from '../uc-tree-node-def';
import type { UcTreeNode } from '../uc-tree-node';

interface Team {
  readonly members: number;
}

const NODES: UcTreeNode<Team>[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    data: { members: 24 },
    children: [
      { id: 'engineering/web', label: 'Web', data: { members: 9 } },
      { id: 'engineering/platform', label: 'Platform', data: { members: 11 } },
      { id: 'engineering/mobile', label: 'Mobile', data: { members: 4 } },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    data: { members: 6 },
    children: [
      { id: 'design/product', label: 'Product', data: { members: 4 } },
      { id: 'design/brand', label: 'Brand', data: { members: 2 } },
    ],
  },
];

/**
 * `ucTreeNodeDef` replaces the row body only. The twisty, the indentation and
 * the `treeitem` shell stay with the tree, so a custom row cannot cost the
 * keyboard model or the ARIA wiring.
 */
@Component({
  selector: 'uc-tree-custom-rows-example',
  imports: [UcPill, UcTree, UcTreeNodeDef],
  template: `
    <uc-tree
      ariaLabel="Teams"
      class="teams"
      [nodes]="nodes"
      [selectBranches]="true"
      [(selectedId)]="selectedId"
      [(expandedIds)]="expandedIds"
    >
      <ng-template [ucTreeNodeDef]="nodes" let-node let-expanded="expanded">
        <span class="teams__label">{{ node.label }}</span>
        <uc-pill
          [text]="(node.data?.members ?? 0) + ' members'"
          [variant]="expanded ? 'info' : 'default'"
          size="compact"
        />
      </ng-template>
    </uc-tree>
  `,
  styles: `
    .teams {
      inline-size: min(22rem, 100%);
    }

    .teams__label {
      flex: 1;
    }
  `,
})
export class TreeCustomRowsExample {
  protected readonly nodes = NODES;
  protected readonly selectedId = signal<string | null>(null);
  protected readonly expandedIds = signal<string[]>(['engineering']);
}
