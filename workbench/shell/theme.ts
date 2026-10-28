import { Injectable, effect, signal } from '@angular/core';

export const WORKBENCH_THEMES = ['light', 'dark', 'aurora', 'midnight'] as const;
export type WorkbenchTheme = (typeof WORKBENCH_THEMES)[number];

/** `theme` leaves `data-font` off, so the theme's own pairing applies. */
export const WORKBENCH_FONTS = ['theme', 'poppins', 'inter', 'dm-sans', 'plus-jakarta-sans', 'system'] as const;
export type WorkbenchFont = (typeof WORKBENCH_FONTS)[number];

const CHROME_KEY = 'uc-workbench-chrome-theme';
const FONT_KEY = 'uc-workbench-font';

const isTheme = (value: string | null): value is WorkbenchTheme =>
  value !== null && (WORKBENCH_THEMES as readonly string[]).includes(value);

const isFont = (value: string | null): value is WorkbenchFont =>
  value !== null && (WORKBENCH_FONTS as readonly string[]).includes(value);

/** Stores the app theme and font preset used by both the workbench chrome and component previews. */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly chrome = signal<WorkbenchTheme>(read(CHROME_KEY, isTheme, prefersDark() ? 'dark' : 'light'));
  readonly font = signal<WorkbenchFont>(read(FONT_KEY, isFont, 'theme'));

  constructor() {
    effect(() => {
      const theme = this.chrome();

      // The theme sheets nest a `body` rule inside `[data-theme]`, so this has
      // to sit on `<html>` for the page background to follow along.
      document.documentElement.setAttribute('data-theme', theme);
      write(CHROME_KEY, theme);
    });

    effect(() => {
      const font = this.font();

      if (font === 'theme') {
        document.documentElement.removeAttribute('data-font');
      } else {
        document.documentElement.setAttribute('data-font', font);
      }
      write(FONT_KEY, font);
    });
  }

  setChrome(theme: WorkbenchTheme): void {
    this.chrome.set(theme);
  }

  setFont(font: WorkbenchFont): void {
    this.font.set(font);
  }
}

function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function read<T extends string>(key: string, isValid: (value: string | null) => value is T, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);

    if (isValid(stored)) {
      return stored;
    }
  } catch {
    // Private browsing or blocked storage: fall through to the default.
  }

  return fallback;
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The picker still works for the rest of the session.
  }
}
