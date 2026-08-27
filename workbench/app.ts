import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WbSidebar } from './shell/sidebar';

@Component({
  selector: 'wb-app',
  imports: [RouterOutlet, WbSidebar],
  template: `
    <wb-sidebar />
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
      min-height: 100vh;
    }

    .wb-main {
      overflow-x: hidden;
    }

    @media (max-width: 48rem) {
      :host {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class WbApp {}
