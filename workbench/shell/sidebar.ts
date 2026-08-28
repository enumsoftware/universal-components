import { Component, computed, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UcDivider } from '../../uc-divider/uc-divider';
import { UcIconButton } from '../../uc-icon-button/uc-icon-button';
import { UcInput } from '../../uc-input/uc-input';
import { UcSelect, type SelectOption } from '../../uc-select/uc-select';
import { UcTree } from '../../uc-tree/uc-tree';
import type { UcTreeNode } from '../../uc-tree/uc-tree-node';
import { SHOWCASE_REGISTRY } from '../generated/registry';
import { ThemeStore, WORKBENCH_THEMES, type WorkbenchTheme } from './theme';

/** Namespaced so a group can never collide with a showcase id. */
function groupId(group: string): string {
  return `group:${group}`;
}

@Component({
  selector: 'wb-sidebar',
  imports: [UcDivider, UcIconButton, UcInput, UcSelect, UcTree],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: {
    '[class.wb-sidebar--open]': 'open()',
  },
})
export class WbSidebar {
  protected readonly theme = inject(ThemeStore);
  private readonly router = inject(Router);

  /**
   * Drawer state, and only meaningful below the 48rem breakpoint - above it the
   * sidebar is a permanent column and this flag styles nothing. Two-way, so the
   * shell can open it from the topbar while the drawer still closes itself on
   * navigation.
   */
  readonly open = model(false);

  protected readonly query = signal('');
  protected readonly activeId = signal(currentId(this.router.url));
  protected readonly expandedIds = signal<string[]>([]);

  protected readonly themeOptions: SelectOption<string>[] = WORKBENCH_THEMES.map((theme) => ({
    value: theme,
    label: theme,
  }));

  /**
   * The registry is already grouped and ordered, so this only has to bucket it.
   * Filtering is the tree's: it drops what does not match and opens the groups
   * that lead to a hit, then puts them back when the field is cleared.
   */
  protected readonly nodes = computed<UcTreeNode[]>(() => {
    const grouped = new Map<string, UcTreeNode[]>();

    for (const entry of SHOWCASE_REGISTRY) {
      const bucket = grouped.get(entry.group) ?? [];

      bucket.push({ id: entry.id, label: entry.title });
      grouped.set(entry.group, bucket);
    }

    return [...grouped].map(([group, children]) => ({
      id: groupId(group),
      label: group,
      children,
    }));
  });

  constructor() {
    this.router.events.subscribe(() => {
      const id = currentId(this.router.url);

      this.activeId.set(id);
      this.revealGroupOf(id);
    });

    // A deep link lands with every group shut, and the showcase it names would
    // be the one row the sidebar does not show.
    this.revealGroupOf(this.activeId());
  }

  protected onQuery(value: string | number | null): void {
    this.query.set(value === null ? '' : String(value));
  }

  protected onChromeTheme(theme: string | null): void {
    if (theme !== null) {
      this.theme.setChrome(theme as WorkbenchTheme);
    }
  }

  /** Groups are containers here, so only a showcase row navigates. */
  protected onActivate(node: UcTreeNode): void {
    if (node.children) {
      return;
    }

    // Below the breakpoint the drawer covers the canvas it has just navigated,
    // so picking a showcase has to dismiss it as well.
    this.open.set(false);
    void this.router.navigateByUrl(`/${node.id}`);
  }

  private revealGroupOf(id: string): void {
    const entry = SHOWCASE_REGISTRY.find((candidate) => candidate.id === id);

    if (!entry) {
      return;
    }

    const group = groupId(entry.group);

    this.expandedIds.update((ids) => (ids.includes(group) ? ids : [...ids, group]));
  }
}

function currentId(url: string): string {
  return url.replace(/^\/+/, '').split('?')[0] ?? '';
}
