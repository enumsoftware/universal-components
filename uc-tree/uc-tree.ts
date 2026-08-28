import { NgTemplateOutlet } from '@angular/common';
import { CdkTree, CdkTreeNode, CdkTreeNodeDef } from '@angular/cdk/tree';
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  linkedSignal,
  model,
  output,
  viewChild,
} from '@angular/core';

import { UcPhosphorIcon } from '../uc-phosphor-icon/uc-phosphor-icon';
import { UcTreeNodeDef } from './uc-tree-node-def';
import { ucTreeBranchIds, ucTreeFilter, ucTreeNodeIsBranch, type UcTreeNode } from './uc-tree-node';

const NO_AUTO_EXPAND: ReadonlySet<string> = new Set<string>();

/**
 * Collapsible tree view over nested `UcTreeNode` data.
 *
 * The CDK owns the parts that are easy to get wrong - roving tabindex, arrow
 * key navigation, typeahead, `aria-level` / `aria-posinset` / `aria-setsize` -
 * and this component owns the data shape, the expansion model, the filter and
 * the look. Rows are a flat list of `role="treeitem"` elements indented by
 * depth rather than nested `<ul>`s, which is what lets one keyboard manager
 * walk the visible rows in order.
 *
 * Expansion and selection are both `model()`s keyed by node id, so they survive
 * the node objects being rebuilt - which the filter does on every keystroke.
 */
@Component({
  selector: 'uc-tree',
  imports: [CdkTree, CdkTreeNode, CdkTreeNodeDef, NgTemplateOutlet, UcPhosphorIcon],
  templateUrl: './uc-tree.html',
  styleUrl: './uc-tree.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcTree<T = unknown> implements AfterViewInit {
  readonly nodes = input.required<UcTreeNode<T>[]>();

  /** Accessible name for the `role="tree"` element. Required by the role. */
  readonly ariaLabel = input<string>('Tree');

  /** Id of the highlighted row, or `null`. Two-way: activating a row sets it. */
  readonly selectedId = model<string | null>(null);

  /** Ids of the open branches. Two-way, so a host can persist or restore them. */
  readonly expandedIds = model<string[]>([]);

  /**
   * Case-insensitive label filter. Non-matching rows are dropped and the
   * branches leading to a match are opened for as long as the filter stands.
   */
  readonly filter = input<string>('');

  /** Indent per level as a CSS length. Empty defers to `--uc-tree-indent`. */
  readonly indent = input<string>('');

  /** Shown in place of the tree when nothing survives the filter. */
  readonly emptyText = input<string>('No matches.');

  /** Whether clicking a branch row - or pressing Enter on it - toggles it. */
  readonly expandOnActivate = input<boolean>(true);

  /**
   * Whether a branch row can become the selected row. Off by default: in a
   * navigation tree a branch is a container, and highlighting it as well as the
   * leaf the host actually navigated to shows two active rows at once.
   */
  readonly selectBranches = input<boolean>(false);

  /** Every activation, branch or leaf, whether or not it changed the selection. */
  readonly nodeActivated = output<UcTreeNode<T>>();

  protected readonly nodeTemplate = contentChild(UcTreeNodeDef);

  private readonly cdkTree = viewChild(CdkTree);

  private readonly needle = computed(() => this.filter().trim().toLowerCase());

  private readonly filtered = computed(() => {
    const needle = this.needle();

    // Identity matters as well as content: `dataSource` re-renders the whole
    // tree when the array changes, so an unfiltered tree has to hand back the
    // very array it was given.
    return needle === ''
      ? { nodes: this.nodes(), autoExpand: NO_AUTO_EXPAND }
      : ucTreeFilter(this.nodes(), needle);
  });

  protected readonly visibleNodes = computed(() => this.filtered().nodes);

  /** Every rendered node by id, so expansion can be applied without a walk. */
  private readonly visibleById = computed(() => {
    const byId = new Map<string, UcTreeNode<T>>();

    const walk = (level: readonly UcTreeNode<T>[]): void => {
      for (const node of level) {
        byId.set(node.id, node);
        walk(node.children ?? []);
      }
    };

    walk(this.visibleNodes());

    return byId;
  });

  /**
   * Branches the reader closed by hand while a filter was standing, so the
   * filter's auto-expansion does not immediately reopen them. Reset whenever
   * the needle changes, since the branches it opens change with it.
   */
  private readonly reclosed = linkedSignal<string, ReadonlySet<string>>({
    source: () => this.needle(),
    computation: () => new Set<string>(),
  });

  private readonly expandedSet = computed<ReadonlySet<string>>(() => {
    const expanded = new Set(this.expandedIds());
    const auto = this.filtered().autoExpand;

    if (auto.size > 0) {
      const reclosed = this.reclosed();

      for (const id of auto) {
        if (!reclosed.has(id)) {
          expanded.add(id);
        }
      }
    }

    return expanded;
  });

  /** Keyed by id so expansion survives the filter rebuilding the node objects. */
  protected readonly expansionKey = (node: UcTreeNode<T>): string => node.id;
  protected readonly trackById = (_index: number, node: UcTreeNode<T>): string => node.id;
  protected readonly childrenAccessor = (node: UcTreeNode<T>): UcTreeNode<T>[] => node.children ?? [];

  constructor() {
    /*
      Expansion is pushed into the CDK from here rather than through
      `cdk-tree-node[isExpanded]`, and the difference is not cosmetic: that input
      is written while the tree is rendering the very node it is written on, and
      the re-flatten it asks for is lost inside the render already in flight - so
      a branch opened in the same pass that changed the data reports
      `aria-expanded="true"` while showing none of its children, which is exactly
      what the filter does on every keystroke. A component effect runs ahead of
      this view's own bindings, so from its second run on the expansion is
      already settled by the time `dataSource` hands the CDK its new data. The
      first run is too early to be of use - see `ngAfterViewInit`.
    */
    effect(() => this.syncExpansion());
  }

  ngAfterViewInit(): void {
    // The effect's first run lands between this view being created and its
    // bindings being applied, so it finds a CdkTree that has none of them yet
    // and gives up. Nothing it read has changed by the time the tree is usable,
    // so without this the state a host started with would never be applied.
    this.syncExpansion();
  }

  /** Mirrors the expansion model into the CDK, which renders from its own copy. */
  private syncExpansion(): void {
    const expanded = this.expandedSet();
    const byId = this.visibleById();
    const tree = this.cdkTree();

    // Until `expansionKey` is bound the CDK keys expansion by object identity,
    // and a node expanded under that key looks collapsed the moment the real
    // key arrives - silently, since the tree never renders the children.
    if (!tree?.expansionKey) {
      return;
    }

    for (const [id, node] of byId) {
      const shouldExpand = expanded.has(id) && ucTreeNodeIsBranch(node);

      if (tree.isExpanded(node) === shouldExpand) {
        continue;
      }

      if (shouldExpand) {
        tree.expand(node);
      } else {
        tree.collapse(node);
      }
    }
  }

  /** The node def context is untyped, so the template narrows through this. */
  protected asNode(node: UcTreeNode<T>): UcTreeNode<T> {
    return node;
  }

  protected isBranch(node: UcTreeNode<T>): boolean {
    return ucTreeNodeIsBranch(node);
  }

  protected isExpanded(node: UcTreeNode<T>): boolean {
    return this.expandedSet().has(node.id);
  }

  protected isSelected(node: UcTreeNode<T>): boolean {
    return this.selectedId() === node.id;
  }

  /**
   * The CDK is the source of truth while a row is on screen - arrow keys call
   * `expand()` on the node directly - so its expansion events are mirrored back
   * into the model rather than the other way round.
   */
  protected onExpandedChange(node: UcTreeNode<T>, expanded: boolean): void {
    if (this.expandedSet().has(node.id) === expanded) {
      return;
    }

    this.setExpanded(node.id, expanded);
  }

  protected onActivate(node: UcTreeNode<T>): void {
    if (node.disabled) {
      return;
    }

    const branch = this.isBranch(node);

    if (branch && this.expandOnActivate()) {
      this.toggle(node.id);
    }

    if (!branch || this.selectBranches()) {
      this.selectedId.set(node.id);
    }

    this.nodeActivated.emit(node);
  }

  /** The twisty toggles and nothing else, so it works with `expandOnActivate` off. */
  protected onTwistyClick(event: MouseEvent, node: UcTreeNode<T>): void {
    if (node.disabled) {
      return;
    }

    // The row's own click handler is one bubble away and would undo this.
    event.stopPropagation();
    this.toggle(node.id);
  }

  expand(id: string): void {
    this.setExpanded(id, true);
  }

  collapse(id: string): void {
    this.setExpanded(id, false);
  }

  toggle(id: string): void {
    this.setExpanded(id, !this.expandedSet().has(id));
  }

  expandAll(): void {
    this.expandedIds.set(ucTreeBranchIds(this.nodes()));
  }

  collapseAll(): void {
    this.expandedIds.set([]);
  }

  private setExpanded(id: string, expanded: boolean): void {
    // The filter's auto-expansion is tracked apart from the model, so closing a
    // branch it opened has to be recorded there too or the next read reopens it.
    this.reclosed.update((reclosed) => {
      const next = new Set(reclosed);

      if (expanded) {
        next.delete(id);
      } else if (this.filtered().autoExpand.has(id)) {
        next.add(id);
      }

      return next;
    });

    const explicit = new Set(this.expandedIds());

    if (explicit.has(id) === expanded) {
      return;
    }

    if (expanded) {
      explicit.add(id);
    } else {
      explicit.delete(id);
    }

    this.expandedIds.set([...explicit]);
  }
}
