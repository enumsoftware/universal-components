import { Injectable, effect, signal } from '@angular/core';

export const WORKBENCH_THEMES = ['light', 'dark', 'aurora', 'midnight'] as const;
export type WorkbenchTheme = (typeof WORKBENCH_THEMES)[number];

const CANVAS_KEY = 'uc-workbench-theme';
const CHROME_KEY = 'uc-workbench-chrome-theme';

const isTheme = (value: string | null): value is WorkbenchTheme =>
  value !== null && (WORKBENCH_THEMES as readonly string[]).includes(value);

/**
 * Two independent themes.
 *
 * `chrome` themes the workbench itself, which is built out of the library, and
 * is applied to `<html>`. `canvas` themes the preview and is applied to the
 * canvas wrapper. They nest rather than fight: custom properties cascade, so
 * the inner `[data-theme]` simply redefines the tokens for its own subtree.
 *
 * Keeping them apart is what lets you compare a component across themes
 * without the surrounding UI moving underneath you.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly canvas = signal<WorkbenchTheme>(read(CANVAS_KEY, 'light'));
  readonly chrome = signal<WorkbenchTheme>(read(CHROME_KEY, prefersDark() ? 'dark' : 'light'));

  constructor() {
    effect(() => {
      const theme = this.chrome();

      // The theme sheets nest a `body` rule inside `[data-theme]`, so this has
      // to sit on `<html>` for the page background to follow along.
      document.documentElement.setAttribute('data-theme', theme);
      write(CHROME_KEY, theme);
    });

    effect(() => write(CANVAS_KEY, this.canvas()));
  }

  setCanvas(theme: WorkbenchTheme): void {
    this.canvas.set(theme);
  }

  setChrome(theme: WorkbenchTheme): void {
    this.chrome.set(theme);
  }
}

function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function read(key: string, fallback: WorkbenchTheme): WorkbenchTheme {
  try {
    const stored = localStorage.getItem(key);

    if (isTheme(stored)) {
      return stored;
    }
  } catch {
    // Private browsing or blocked storage: fall through to the default.
  }

  return fallback;
}

function write(key: string, theme: WorkbenchTheme): void {
  try {
    localStorage.setItem(key, theme);
  } catch {
    // The picker still works for the rest of the session.
  }
}
