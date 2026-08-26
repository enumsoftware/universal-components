import { Injectable, effect, signal } from "@angular/core";

export const WORKBENCH_THEMES = ["light", "dark", "aurora", "midnight"] as const;
export type WorkbenchTheme = (typeof WORKBENCH_THEMES)[number];

const STORAGE_KEY = "uc-workbench-theme";

const isTheme = (value: string | null): value is WorkbenchTheme =>
  value !== null && (WORKBENCH_THEMES as readonly string[]).includes(value);

/**
 * The canvas theme. Applied as `data-theme` on the canvas wrapper rather than
 * on `<html>`, because every theme sheet keys off a bare `[data-theme='...']`
 * attribute selector - so the preview can be themed without dragging the
 * surrounding chrome along with it.
 */
@Injectable({ providedIn: "root" })
export class ThemeStore {
  readonly theme = signal<WorkbenchTheme>(readStoredTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();

      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Private browsing or blocked storage: the picker still works in-session.
      }
    });
  }

  set(theme: WorkbenchTheme): void {
    this.theme.set(theme);
  }
}

function readStoredTheme(): WorkbenchTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (isTheme(stored)) {
      return stored;
    }
  } catch {
    // Fall through to the default.
  }

  return "light";
}
