import { Component, computed, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UcDivider } from '../../uc-divider/uc-divider';
import { UcIconButton } from '../../uc-icon-button/uc-icon-button';
import { UcInput } from '../../uc-input/uc-input';
import { UcSelect, type SelectOption } from '../../uc-select/uc-select';
import { UcSidebarButton } from '../../uc-sidebar-button/uc-sidebar-button';
import { SHOWCASE_REGISTRY } from '../generated/registry';
import { ThemeStore, WORKBENCH_THEMES, type WorkbenchTheme } from './theme';

interface SidebarGroup {
  readonly name: string;
  readonly entries: readonly { readonly id: string; readonly title: string }[];
}

@Component({
  selector: 'wb-sidebar',
  imports: [UcDivider, UcIconButton, UcInput, UcSelect, UcSidebarButton],
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

  protected readonly themeOptions: SelectOption<string>[] = WORKBENCH_THEMES.map((theme) => ({
    value: theme,
    label: theme,
  }));

  protected readonly groups = computed<readonly SidebarGroup[]>(() => {
    const needle = this.query().trim().toLowerCase();
    const grouped = new Map<string, { id: string; title: string }[]>();

    for (const entry of SHOWCASE_REGISTRY) {
      if (needle !== '' && !`${entry.group} ${entry.title}`.toLowerCase().includes(needle)) {
        continue;
      }

      const bucket = grouped.get(entry.group) ?? [];

      bucket.push({ id: entry.id, title: entry.title });
      grouped.set(entry.group, bucket);
    }

    return [...grouped].map(([name, entries]) => ({ name, entries }));
  });

  constructor() {
    this.router.events.subscribe(() => this.activeId.set(currentId(this.router.url)));
  }

  protected onQuery(value: string | number | null): void {
    this.query.set(value === null ? '' : String(value));
  }

  protected onChromeTheme(theme: string | null): void {
    if (theme !== null) {
      this.theme.setChrome(theme as WorkbenchTheme);
    }
  }

  protected select(id: string): void {
    // Below the breakpoint the drawer covers the canvas it has just navigated,
    // so picking a showcase has to dismiss it as well.
    this.open.set(false);
    void this.router.navigateByUrl(`/${id}`);
  }
}

function currentId(url: string): string {
  return url.replace(/^\/+/, '').split('?')[0] ?? '';
}
