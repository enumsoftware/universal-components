import { Component, computed, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { SHOWCASE_REGISTRY } from "../generated/registry";

interface SidebarGroup {
  readonly name: string;
  readonly entries: readonly { readonly id: string; readonly title: string }[];
}

@Component({
  selector: "wb-sidebar",
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="wb-brand">
      <strong>Universal Components</strong>
      <span>Workbench</span>
    </div>

    <label class="wb-search">
      <span class="wb-visually-hidden">Filter showcases</span>
      <input type="search" placeholder="Filter…" [value]="query()" (input)="onQuery($event)" />
    </label>

    <nav>
      @for (group of groups(); track group.name) {
        <section>
          <h2>{{ group.name }}</h2>
          <ul>
            @for (entry of group.entries; track entry.id) {
              <li>
                <a [routerLink]="'/' + entry.id" routerLinkActive="wb-active">{{ entry.title }}</a>
              </li>
            }
          </ul>
        </section>
      } @empty {
        <p class="wb-empty">No match.</p>
      }
    </nav>
  `,
  styleUrl: "./sidebar.css",
})
export class WbSidebar {
  protected readonly query = signal("");

  protected readonly groups = computed<readonly SidebarGroup[]>(() => {
    const needle = this.query().trim().toLowerCase();
    const grouped = new Map<string, { id: string; title: string }[]>();

    for (const entry of SHOWCASE_REGISTRY) {
      if (needle !== "" && !`${entry.group} ${entry.title}`.toLowerCase().includes(needle)) {
        continue;
      }

      const bucket = grouped.get(entry.group) ?? [];

      bucket.push({ id: entry.id, title: entry.title });
      grouped.set(entry.group, bucket);
    }

    return [...grouped].map(([name, entries]) => ({ name, entries }));
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
