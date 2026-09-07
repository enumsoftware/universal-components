import { afterNextRender, Component, effect, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { WbSidebar } from './shell/sidebar';

@Component({
  selector: 'wb-app',
  imports: [RouterOutlet, UcIconButton, WbSidebar],
  host: {
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <!--
      Mobile only: the sidebar is off-canvas below the breakpoint, so the shell
      needs somewhere to put the handle that pulls it back in. A bar rather
      than a floating button, so it displaces the canvas instead of covering
      whatever the showcase happens to render in its top-left corner.
    -->
    <div class="wb-topbar" #topbar>
      <uc-icon-button phosphorIcon="list" label="Open navigation" variant="secondary" (clicked)="open()" />
      <strong>Universal Components</strong>
    </div>

    <wb-sidebar #sidebar [(open)]="sidebarOpen" />

    <!--
      The scrim is decoration: Escape and the drawer's own close button are the
      accessible ways out, and this only exists so a tap outside does the
      obvious thing. Hidden from assistive tech rather than given a role.
    -->
    <div class="wb-scrim" [class.wb-scrim--visible]="sidebarOpen()" aria-hidden="true" (click)="close()"></div>

    <!--
      Deliberately not a <main>, and the same goes for the sidebar's footer and
      the showcase header elsewhere in the shell.

      The canvas renders whole page fragments, and several legitimately carry
      landmarks of their own - uc-side-navigation emits a <main>, and the
      utilities overview demonstrates a full page layout with a header and a
      footer. Any landmark the chrome claims collides with the one being
      demonstrated, and axe is right to call that a failure. It is the chrome's
      to give up: nothing here is the page's main content, the preview is.
    -->
    <div class="wb-main">
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 16rem 1fr;
      min-height: 100dvh;
    }

    .wb-main {
      overflow-x: hidden;
    }

    .wb-topbar {
      display: none;
    }

    .wb-scrim {
      display: none;
    }

    @media (max-width: 48rem) {
      :host {
        /* One column, one row per band: the topbar sits above the canvas and
           the sidebar is out of flow entirely, floating over both. */
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .wb-topbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background-color: var(--sidebar-background-color);
        border-block-end: 1px solid var(--uc-content-hr-color);
        position: sticky;
        top: 0;
        z-index: 20;
      }

      .wb-scrim {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 30;
        background-color: rgb(0 0 0 / 45%);
        opacity: 0;
        /*
          The visibility step is timed rather than eased, and it comes late on
          the way out so the fade is not cut short. Same shape as the drawer's
          own transition next door - see sidebar.css, where the timing also
          decides when the drawer can take focus.
        */
        visibility: hidden;
        transition:
          opacity 200ms ease,
          visibility 0s linear 200ms;
      }

      .wb-scrim--visible {
        opacity: 1;
        visibility: visible;
        transition:
          opacity 200ms ease,
          visibility 0s;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .wb-scrim {
        transition-duration: 0ms;
        transition-delay: 0ms;
      }
    }
  `,
})
export class WbApp {
  private readonly injector = inject(Injector);
  private readonly topbar = viewChild.required<ElementRef<HTMLElement>>('topbar');
  // Read as ElementRef: a template ref on a component element resolves to
  // the component instance otherwise, and what is wanted here is its host node.
  private readonly sidebar = viewChild.required('sidebar', { read: ElementRef });

  protected readonly sidebarOpen = signal(false);

  constructor() {
    /*
      The drawer covers the canvas, so the page behind it must not scroll under
      the finger. Scoped to the breakpoint in CSS rather than here, so a resize
      to desktop while it is open cannot leave the body stuck.
    */
    effect(() => {
      document.body.classList.toggle('wb-nav-open', this.sidebarOpen());
    });
  }

  protected open(): void {
    this.sidebarOpen.set(true);
    // The drawer is visibility: hidden until the class lands, and a hidden
    // element cannot take focus - so wait for the render that reveals it.
    afterNextRender(() => focusFirstButton(this.sidebar().nativeElement), { injector: this.injector });
  }

  protected close(): void {
    if (!this.sidebarOpen()) {
      return;
    }

    this.sidebarOpen.set(false);
    focusFirstButton(this.topbar().nativeElement);
  }
}

function focusFirstButton(host: HTMLElement): void {
  host.querySelector('button')?.focus();
}
