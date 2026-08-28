import { Component, signal, viewChild } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcInput } from '../../uc-input/uc-input';
import { UcTree } from '../uc-tree';
import type { UcTreeNode } from '../uc-tree-node';

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
    children: [{ id: 'docs/readme.md', label: 'readme.md', icon: 'file-md' }],
  },
];

/**
 * The composition the workbench sidebar itself uses: a filter field above the
 * tree, and the expansion methods driven from outside. Typing opens the
 * branches that lead to a hit and puts them back as they were when the field is
 * cleared - the tree does that, not this example.
 */
@Component({
  selector: 'uc-tree-file-explorer-example',
  imports: [UcButton, UcInput, UcTree],
  template: `
    <div class="explorer">
      <uc-input
        [id]="'tree-example-filter'"
        label="Filter files"
        placeholder="Filter…"
        [value]="filter()"
        (valueChange)="onFilter($event)"
      />

      <div class="explorer__actions">
        <uc-button text="Expand all" variant="secondary" size="small" (clicked)="tree().expandAll()" />
        <uc-button text="Collapse all" variant="secondary" size="small" (clicked)="tree().collapseAll()" />
      </div>

      <uc-tree
        ariaLabel="Project files"
        [nodes]="nodes"
        [filter]="filter()"
        [(selectedId)]="selectedId"
        emptyText="Nothing matches that."
      />

      <p class="explorer__status">Selected: {{ selectedId() ?? 'nothing' }}</p>
    </div>
  `,
  styles: `
    .explorer {
      display: grid;
      gap: 0.75rem;
      inline-size: min(26rem, 100%);
    }

    .explorer__actions {
      display: flex;
      gap: 0.5rem;
    }

    .explorer__status {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--paragraph-text-color);
    }
  `,
})
export class TreeFileExplorerExample {
  protected readonly tree = viewChild.required(UcTree);
  protected readonly nodes = NODES;
  protected readonly filter = signal('');
  protected readonly selectedId = signal<string | null>('src/index.ts');

  protected onFilter(value: string | number | null): void {
    this.filter.set(value === null ? '' : String(value));
  }
}
