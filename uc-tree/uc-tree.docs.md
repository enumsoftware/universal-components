A collapsible tree view over nested data, built on `@angular/cdk/tree`.

The CDK owns the parts that are easy to get wrong — roving tabindex, arrow-key
navigation, typeahead, `aria-level` / `aria-posinset` / `aria-setsize` — and
`uc-tree` owns the data shape, the expansion model, the filter and the look.

```ts
import { UcTree, type UcTreeNode } from '@enumsoftware/universal-components';

const nodes: UcTreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [{ id: 'src/index.ts', label: 'index.ts', icon: 'file-ts' }],
  },
];
```

```html
<uc-tree
  ariaLabel="Project files"
  [nodes]="nodes"
  [(selectedId)]="selectedId"
  [(expandedIds)]="expandedIds"
  (nodeActivated)="open($event)"
/>
```

## Data, not components

A tree is described as nested `UcTreeNode` data rather than as nested
components. The CDK needs the whole shape up front to compute `aria-setsize`
and `aria-posinset`, and a component-per-node tree cannot report a set size
until every sibling has already rendered.

`id` has to be unique across the whole tree, not just among siblings: expansion,
selection and view tracking are all keyed by it. That is what lets the filter
rebuild every node object on each keystroke without losing the reader's place.

## One focus stop per row

Rows are a flat list of sibling `role="treeitem"` elements indented by depth,
not nested `<ul>`s. That is what lets one key manager walk the visible rows in
order, and it is why the row itself is the focus stop: <kbd>↑</kbd> /
<kbd>↓</kbd> move between visible rows, <kbd>→</kbd> / <kbd>←</kbd> open and
close a branch, <kbd>Home</kbd> / <kbd>End</kbd> jump to the ends,
<kbd>Enter</kbd> activates, and typing letters jumps to a label.

The twisty is deliberately not a button. A button inside the row would put a
second tab stop on every row and break the roving tabindex the `tree` role
expects, so it is `aria-hidden` and clickable only — the arrow keys are the
keyboard route in and out of a branch.

## Branches are not selected by default

Activating a leaf selects it. Activating a branch toggles it and leaves
`selectedId` alone, because in a navigation tree a branch is a container:
highlighting it as well as the leaf the host navigated to shows two active rows
at once. Set `selectBranches` when a branch is a real choice — a category
picker, say. `nodeActivated` fires either way.

Set `expandOnActivate` to `false` to make the twisty the only way to open a
branch, leaving the whole row to selection.

## Filtering

`filter` is a case-insensitive label match. Rows that do not match are dropped
and every surviving branch is opened, for as long as the filter stands — a
filtered tree is no use with its results shut. Those branches are not written
into `expandedIds`, so clearing the field puts the tree back the way the reader
left it. A branch that matches on its own label keeps its whole subtree, so a
hit on a folder still shows what is inside it.

A branch the reader closes by hand while filtering stays closed until the needle
changes.

## Custom rows

`ucTreeNodeDef` replaces the row body — everything after the twisty:

```html
<uc-tree [nodes]="nodes">
  <ng-template ucTreeNodeDef let-node let-expanded="expanded" let-selected="selected">
    <span>{{ node.label }}</span>
    <uc-pill [text]="node.data.count" />
  </ng-template>
</uc-tree>
```

The twisty, the indentation and the `treeitem` shell stay with the tree, so a
custom row cannot cost the keyboard model or the ARIA wiring.

## Methods

`expand(id)`, `collapse(id)`, `toggle(id)`, `expandAll()` and `collapseAll()`
are public, for a toolbar above the tree. They write through `expandedIds`, so
a host binding it two-way sees every change.

## Theming

Indentation is `--uc-tree-indent` per level, applied as logical padding so an
RTL document indents from the other edge. The `indent` input overrides it for
one tree. The rest of the surface is the usual `--uc-tree-*` tokens: row
padding and radius, hover and selected colours, the twisty and icon sizes.
