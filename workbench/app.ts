import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WbSidebar } from './shell/sidebar';

@Component({
  selector: 'wb-app',
  imports: [RouterOutlet, WbSidebar],
  template: `
    <wb-sidebar />
    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 16rem 1fr;
      min-height: 100vh;
    }

    main {
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
