import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';

interface ColorGroup {
  readonly title: string;
  readonly tokens: readonly string[];
}

interface ResolvedToken {
  readonly token: string;
  /** The colour as the browser computed it, usable as a CSS value. */
  readonly color: string;
  /** `#rrggbb`, or `#rrggbbaa` when translucent; `null` when the theme does not set the token. */
  readonly hex: string | null;
}

interface ResolvedGroup {
  readonly title: string;
  readonly tokens: readonly ResolvedToken[];
}

/**
 * The global colour tokens every theme file defines above its per-component
 * sections. Component tokens (`--uc-button-*`, `--uc-input-*`, ...) are left
 * out on purpose; they mostly derive from these.
 */
const COLOR_GROUPS: readonly ColorGroup[] = [
  {
    title: 'Brand',
    tokens: ['--uc-primary-color', '--uc-primary-contrast-color', '--uc-secondary-color'],
  },
  {
    title: 'Foreground and background',
    tokens: [
      '--uc-foreground-color',
      '--uc-background-color',
      '--uc-background-color-90',
      '--uc-background-color-80',
      '--uc-inverse-foreground-color',
      '--uc-inverse-background-color',
    ],
  },
  {
    title: 'Status',
    tokens: [
      '--uc-error-color',
      '--uc-success-color',
      '--uc-warning-color',
      '--uc-warning-bg',
      '--uc-warning-border',
    ],
  },
  {
    title: 'Text',
    tokens: ['--uc-font-color', '--uc-paragraph-text-color'],
  },
  {
    title: 'Surfaces',
    tokens: ['--uc-card-background-color', '--uc-sidebar-background-color', '--uc-dialog-background-color'],
  },
  {
    title: 'Scrollbar',
    tokens: ['--uc-scrollbar-track-color', '--uc-scrollbar-thumb-color', '--uc-scrollbar-thumb-hover-color'],
  },
  {
    title: 'Content',
    tokens: [
      '--uc-content-heading-color',
      '--uc-content-body-color',
      '--uc-content-muted-color',
      '--uc-content-link-color',
      '--uc-content-link-hover-color',
      '--uc-content-code-background',
      '--uc-content-code-color',
      '--uc-content-pre-background',
      '--uc-content-pre-border-color',
      '--uc-content-blockquote-background',
      '--uc-content-blockquote-border-color',
      '--uc-content-mark-background',
      '--uc-content-mark-color',
      '--uc-content-hr-color',
    ],
  },
  {
    title: 'Table',
    tokens: [
      '--uc-table-background',
      '--uc-table-text',
      '--uc-table-header-background',
      '--uc-table-border-color',
      '--uc-table-row-hover-background',
      '--uc-table-caption-color',
    ],
  },
];

/**
 * A Foundations page: the active theme's global colour tokens as swatches.
 * Values are resolved by the browser, so relative colours such as
 * `oklch(from var(--uc-primary-color) ...)` show their final value, and the
 * page re-reads them whenever `data-theme` on `<html>` changes.
 */
@Component({
  selector: 'uc-theme-colors-preview',
  template: `
    <div class="theme-colors">
      <p class="theme-colors__intro">
        Global colour tokens of the <strong>{{ theme() }}</strong> theme. Component tokens are not listed; most of
        them derive from these. Switch the app theme to compare.
      </p>

      @for (group of groups(); track group.title) {
        <section class="theme-colors__group" [attr.aria-labelledby]="'theme-colors-' + $index">
          <h2 class="theme-colors__title" [id]="'theme-colors-' + $index">{{ group.title }}</h2>
          <ul class="theme-colors__grid">
            @for (item of group.tokens; track item.token) {
              <li class="theme-colors__swatch">
                <span class="theme-colors__chip" aria-hidden="true">
                  <span class="theme-colors__fill" [style.background]="item.color"></span>
                </span>
                <code class="theme-colors__token">{{ item.token }}</code>
                <span class="theme-colors__value">{{ item.hex ?? 'not set' }}</span>
              </li>
            }
          </ul>
        </section>
      }

      <span #probe class="theme-colors__probe" aria-hidden="true"></span>
    </div>
  `,
  styles: `
    .theme-colors {
      display: grid;
      gap: 2rem;
    }

    .theme-colors__intro {
      margin: 0;
      color: var(--uc-paragraph-text-color);
    }

    .theme-colors__group {
      display: grid;
      gap: 0.75rem;
    }

    .theme-colors__title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: var(--uc-font-weight-semibold);
      letter-spacing: normal;
    }

    .theme-colors__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .theme-colors__swatch {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    /* A checkerboard under the fill, so translucent tokens read as translucent. */
    .theme-colors__chip {
      display: block;
      height: 4rem;
      margin-bottom: 0.25rem;
      overflow: hidden;
      border: 1px solid var(--uc-content-pre-border-color);
      border-radius: 0.75rem;
      background:
        repeating-conic-gradient(oklch(from var(--uc-foreground-color) l c h / 0.12) 0 25%, transparent 0 50%) 0 0 /
        1rem 1rem,
        var(--uc-background-color);
    }

    .theme-colors__fill {
      display: block;
      height: 100%;
    }

    /* Opts out of the global inline-code chip; the swatch is the visual here. */
    .theme-colors__token {
      padding: 0;
      background: none;
      color: var(--uc-foreground-color);
      overflow-wrap: anywhere;
      font-family: var(--uc-font-family-mono);
      font-size: 0.8125rem;
    }

    .theme-colors__value {
      color: var(--uc-paragraph-text-color);
      font-family: var(--uc-font-family-mono);
      font-size: 0.8125rem;
    }

    .theme-colors__probe {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `,
})
export class ThemeColorsPreview {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly theme = signal('');
  protected readonly groups = signal<readonly ResolvedGroup[]>([]);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.refresh();

      const observer = new MutationObserver(() => this.refresh());
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private refresh(): void {
    const host = this.host.nativeElement;
    const probe = host.querySelector<HTMLElement>('.theme-colors__probe');

    if (!probe) {
      return;
    }

    const hostStyle = getComputedStyle(host);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    this.theme.set(document.documentElement.getAttribute('data-theme') ?? 'default');
    this.groups.set(
      COLOR_GROUPS.map((group) => ({
        title: group.title,
        tokens: group.tokens.map((token) => {
          if (hostStyle.getPropertyValue(token).trim() === '') {
            return { token, color: 'transparent', hex: null };
          }

          // Routed through a real property so relative colours resolve.
          probe.style.color = `var(${token})`;
          const color = getComputedStyle(probe).color;

          return { token, color, hex: context ? toHex(context, color) : color };
        }),
      })),
    );
  }
}

/** Paints one pixel to normalise any CSS colour (oklch, color(), rgb) to hex. */
function toHex(context: CanvasRenderingContext2D, color: string): string {
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  const hex = (value: number): string => value.toString(16).padStart(2, '0');

  return `#${hex(r)}${hex(g)}${hex(b)}${a === 255 ? '' : hex(a)}`;
}
