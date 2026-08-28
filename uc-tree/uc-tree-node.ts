/**
 * One row of a `uc-tree`.
 *
 * Trees are described as plain nested data rather than as nested components:
 * the CDK needs the whole shape up front to compute `aria-level`,
 * `aria-posinset` and `aria-setsize`, and a component-per-node tree cannot
 * report a set size until every sibling has rendered.
 */
export interface UcTreeNode<T = unknown> {
  /**
   * Stable identity. Expansion, selection and view tracking are all keyed by
   * it, so it has to be unique across the whole tree - not just among siblings.
   */
  id: string;
  label: string;
  /** Phosphor icon name rendered before the label, e.g. `folder`. */
  icon?: string;
  /** Absent or empty marks a leaf; the twisty and `aria-expanded` follow it. */
  children?: UcTreeNode<T>[];
  /** Skipped by the keyboard manager and inert to pointer input. */
  disabled?: boolean;
  /** Whatever the host needs handed back on `nodeActivated`. */
  data?: T;
}

/** True when the node renders a twisty and carries `aria-expanded`. */
export function ucTreeNodeIsBranch(node: UcTreeNode<unknown>): boolean {
  return (node.children?.length ?? 0) > 0;
}

/** Ids of every branch in the tree, in render order. Used by `expandAll()`. */
export function ucTreeBranchIds(nodes: readonly UcTreeNode<unknown>[]): string[] {
  const ids: string[] = [];

  const walk = (level: readonly UcTreeNode<unknown>[]): void => {
    for (const node of level) {
      if (ucTreeNodeIsBranch(node)) {
        ids.push(node.id);
        walk(node.children ?? []);
      }
    }
  };

  walk(nodes);

  return ids;
}

/** Result of a label filter: the surviving tree, plus the branches to open. */
export interface UcTreeFilterResult<T> {
  readonly nodes: UcTreeNode<T>[];
  /** Every surviving branch: a filtered tree is no use with its results shut. */
  readonly autoExpand: ReadonlySet<string>;
}

/**
 * Keeps a node when its own label matches - with its subtree intact, so a hit
 * on a folder still shows what is inside it - or when a descendant matched, in
 * which case only the matching branches survive.
 */
export function ucTreeFilter<T>(
  nodes: readonly UcTreeNode<T>[],
  needle: string,
): UcTreeFilterResult<T> {
  const autoExpand = new Set<string>();

  const walk = (level: readonly UcTreeNode<T>[]): UcTreeNode<T>[] => {
    const kept: UcTreeNode<T>[] = [];

    for (const node of level) {
      if (node.label.toLowerCase().includes(needle)) {
        if (ucTreeNodeIsBranch(node)) {
          autoExpand.add(node.id);
        }

        kept.push(node);
        continue;
      }

      const children = walk(node.children ?? []);

      if (children.length > 0) {
        autoExpand.add(node.id);
        kept.push({ ...node, children });
      }
    }

    return kept;
  };

  return { nodes: walk(nodes), autoExpand };
}
