import { Directive, TemplateRef, inject, input } from '@angular/core';

import type { UcTreeNode } from './uc-tree-node';

/** Context handed to a custom node template. */
export interface UcTreeNodeContext<T = unknown> {
  readonly $implicit: UcTreeNode<T>;
  /** Depth of the node, 0 for a root. */
  readonly level: number;
  readonly expanded: boolean;
  readonly selected: boolean;
}

/**
 * Replaces the row body - everything after the twisty - with a caller-supplied
 * template:
 *
 * ```html
 * <uc-tree [nodes]="nodes">
 *   <ng-template [ucTreeNodeDef]="nodes" let-node let-selected="selected">
 *     <span>{{ node.label }}</span>
 *   </ng-template>
 * </uc-tree>
 * ```
 *
 * Binding the tree's own array is what types `let-node`: a template context has
 * nothing else to infer from, so leaving the binding off still renders but
 * leaves `node.data` as `unknown`.
 *
 * The twisty, the indentation and the whole `treeitem` shell stay with the
 * tree, so a custom body cannot cost the keyboard model or the ARIA wiring.
 */
@Directive({
  selector: 'ng-template[ucTreeNodeDef]',
})
export class UcTreeNodeDef<T = unknown> {
  /** Type hint only, never read. */
  readonly nodeType = input<UcTreeNode<T>[] | ''>('', { alias: 'ucTreeNodeDef' });

  readonly templateRef = inject<TemplateRef<UcTreeNodeContext<T>>>(TemplateRef);

  /** Types `let-node` as a `UcTreeNode` rather than `any` in the caller's template. */
  static ngTemplateContextGuard<T>(
    _directive: UcTreeNodeDef<T>,
    context: unknown,
  ): context is UcTreeNodeContext<T> {
    return true;
  }
}
