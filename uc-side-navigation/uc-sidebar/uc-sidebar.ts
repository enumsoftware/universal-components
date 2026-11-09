import { booleanAttribute, ChangeDetectionStrategy, Component, DOCUMENT, inject, input, model, OnInit } from '@angular/core';

export const SIDEBAR_SIDE_OPTIONS = ['start', 'end'] as const;
export type UcSidebarSide = (typeof SIDEBAR_SIDE_OPTIONS)[number];
export const SIDEBAR_EDGE_OPTIONS = ['line', 'grip', 'none'] as const;
export type UcSidebarEdge = (typeof SIDEBAR_EDGE_OPTIONS)[number];

@Component({
  selector: 'uc-sidebar',
  imports: [],
  templateUrl: './uc-sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-sidebar.css',
})
export class UcSidebar implements OnInit {
  private readonly storage = storageOf(inject(DOCUMENT));

  opened = model(true);
  /**
   * The side of `uc-side-navigation` the sidebar sits on. Write it as a plain attribute (`side="end"`): the
   * navigation picks its slots from the markup, so a bound `[side]` would leave the sidebar at the start.
   */
  readonly side = input<UcSidebarSide>('start');
  /**
   * How the edge facing the content is drawn: `line` a divider, `grip` a divider with a handle in the middle,
   * `none` nothing. A resizable edge also lights up while it is hovered, focused or dragged.
   */
  readonly edge = input<UcSidebarEdge>('line');
  /** Drag the edge, or focus it and use the arrow keys, to change the width; double-click it to reset. */
  readonly resizable = input(false, { transform: booleanAttribute });
  /** The width in px. Unset, the sidebar width token applies. Bind it two-way to keep a width the user dragged. */
  readonly width = model<number | undefined>(undefined);
  readonly minWidth = input<number>(200);
  readonly maxWidth = input<number>(640);
  /** The accessible name of the resizable edge. */
  readonly resizeLabel = input<string>('Resize sidebar');
  /**
   * Remembers a width the user dragged in `localStorage` under this key, and starts from it when the sidebar is
   * created. A reset forgets it. Unset, nothing is stored.
   */
  readonly widthStorageKey = input<string | undefined>(undefined);

  ngOnInit() {
    const key = this.widthStorageKey();
    const stored = key ? Number(this.read(key)) : Number.NaN;

    if (stored > 0) {
      this.width.set(Math.max(this.minWidth(), Math.min(this.maxWidth(), stored)));
    }
  }

  /** A width the user chose on the edge, or undefined for a reset; kept under `widthStorageKey` when there is one. */
  setUserWidth(width: number | undefined) {
    this.width.set(width);
    const key = this.widthStorageKey();

    if (!key) {
      return;
    }

    try {
      if (width === undefined) {
        this.storage?.removeItem(key);
      } else {
        this.storage?.setItem(key, String(width));
      }
    } catch {
      // Storage refused (private mode, quota): the width lasts until the page reloads.
    }
  }

  private read(key: string): string | null {
    try {
      return this.storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
}

/** The window's local storage; reading it can throw where site data is blocked, and there is none on the server. */
function storageOf(document: Document): Storage | null {
  try {
    return document.defaultView?.localStorage ?? null;
  } catch {
    return null;
  }
}
