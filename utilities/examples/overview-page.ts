import { Component } from '@angular/core';

interface Row {
  readonly cells: readonly string[];
  /** Cell indexes rendered as `<code>`. */
  readonly code: readonly number[];
}

const BREAKPOINTS: Row[] = [
  { cells: ['(none)', 'all widths', 'uc-flex'], code: [0, 2] },
  { cells: ['sm', 'from 640px', 'uc-sm-flex-row'], code: [0, 2] },
  { cells: ['md', 'from 768px', 'uc-md-grid-cols-2'], code: [0, 2] },
  { cells: ['lg', 'from 1024px', 'uc-lg-p-8'], code: [0, 2] },
  { cells: ['xl', 'from 1280px', 'uc-xl-gap-12'], code: [0, 2] },
];

const GROUPS: Row[] = [
  {
    cells: ['Display', 'uc-block, uc-flex, uc-inline-flex, uc-grid, uc-inline-grid, uc-contents, uc-hidden', 'yes'],
    code: [1],
  },
  {
    cells: ['Sizing', 'uc-w-full|half|auto|fit|min|max, uc-h-*, uc-max-w-*, uc-max-h-*', 'yes'],
    code: [1],
  },
  { cells: ['Box sizing', 'uc-box-border, uc-box-content', 'no'], code: [1] },
  { cells: ['Flex container', 'uc-flex-row|col(-reverse), uc-flex-wrap|nowrap|wrap-reverse', 'yes'], code: [1] },
  {
    cells: ['Flex item', 'uc-flex-1|auto|initial|none, uc-grow(-0), uc-shrink(-0), uc-basis-*, uc-order-*', 'yes'],
    code: [1],
  },
  {
    cells: [
      'Grid container',
      'uc-grid-cols-1..12, uc-grid-rows-1..6, uc-grid-flow-*, uc-auto-cols-*, uc-auto-rows-*',
      'yes',
    ],
    code: [1],
  },
  {
    cells: [
      'Grid item',
      'uc-col-span-*, uc-col-start-*, uc-col-end-*, uc-row-span-*, uc-row-start-*, uc-row-end-*',
      'yes',
    ],
    code: [1],
  },
  {
    cells: [
      'Alignment',
      'uc-justify-*, uc-items-*, uc-content-*, uc-self-*, uc-place-items-*, uc-place-content-*',
      'yes',
    ],
    code: [1],
  },
  { cells: ['Gap', 'uc-gap-*, uc-gap-x-*, uc-gap-y-*', 'yes'], code: [1] },
  { cells: ['Margin', 'uc-m-*, uc-mx|my-*, uc-mt|mb|ms|me-*, uc-m*-auto', 'yes'], code: [1] },
  { cells: ['Padding', 'uc-p-*, uc-px|py-*, uc-pt|pb|ps|pe-*', 'yes'], code: [1] },
  { cells: ['Negative margin', 'uc-mt-n4 and friends', 'no'], code: [1] },
  {
    cells: [
      'Composites',
      'uc-flex-center, uc-flex-col-center, uc-flex-between, uc-grid-auto-fit, uc-grid-auto-fill',
      'no',
    ],
    code: [1],
  },
];

/**
 * One document rather than a set of independently mounted examples.
 *
 * The utilities pages are reference material that only ever reads top to
 * bottom - the sections explain each other in order. The stories this replaced
 * were already sections of one page; splitting them into separate canvases
 * would have been a worse document dressed as better structure.
 */
@Component({
  selector: 'uc-utilities-overview-page',
  styleUrl: '../utilities-demo.css',
  template: `
    <div class="uc-demo-block">
      <div class="uc-demo-title">Breakpoint prefixes</div>
      <div class="uc-demo-note">
        Prefixes are mobile-first: a variant applies from its width upwards, and the unprefixed class is the base.
      </div>
      <div class="uc-demo-scroll">
        <table class="uc-demo-table">
          <caption>
            Breakpoint prefixes and the width each one starts at.
          </caption>
          <thead>
            <tr>
              <th scope="col">Prefix</th>
              <th scope="col">Applies</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            @for (row of breakpoints; track row.cells[0]) {
              <tr>
                @for (cell of row.cells; track $index) {
                  <td>
                    @if (row.code.includes($index)) {
                      <code>{{ cell }}</code>
                    } @else {
                      {{ cell }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Utility groups</div>
      <div class="uc-demo-note">Everything in the layer, and whether it has breakpoint variants.</div>
      <div class="uc-demo-scroll">
        <table class="uc-demo-table uc-demo-table-wide">
          <caption>
            Groups shipped in themes/utilities.css.
          </caption>
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Classes</th>
              <th scope="col">Responsive</th>
            </tr>
          </thead>
          <tbody>
            @for (row of groups; track row.cells[0]) {
              <tr>
                @for (cell of row.cells; track $index) {
                  <td>
                    @if (row.code.includes($index)) {
                      <code>{{ cell }}</code>
                    } @else {
                      {{ cell }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">A realistic layout</div>
      <div class="uc-demo-note">
        Header uses uc-flex-between, the body is a responsive grid, and the sidebar drops below the content on small
        screens. Resize the canvas to see it reflow.
      </div>
      <div class="uc-demo-canvas uc-p-4">
        <header class="uc-flex-between uc-flex-wrap uc-gap-3 uc-mb-6">
          <div class="uc-demo-item uc-demo-item-accent">Logo</div>
          <nav class="uc-flex uc-flex-wrap uc-gap-2" aria-label="Example">
            <span class="uc-demo-item">Docs</span>
            <span class="uc-demo-item">Components</span>
            <span class="uc-demo-item">Utilities</span>
          </nav>
        </header>

        <div class="uc-grid uc-grid-cols-1 uc-lg-grid-cols-4 uc-gap-4">
          <main class="uc-lg-col-span-3 uc-grid uc-grid-cols-1 uc-sm-grid-cols-2 uc-gap-4">
            <div class="uc-demo-item uc-sm-col-span-2 uc-demo-item-tall">Hero (uc-sm-col-span-2)</div>
            <div class="uc-demo-item uc-demo-item-tall">Card</div>
            <div class="uc-demo-item uc-demo-item-tall">Card</div>
          </main>
          <aside class="uc-flex uc-flex-col uc-gap-3">
            <div class="uc-demo-item">Sidebar</div>
            <div class="uc-demo-item uc-grow">uc-grow</div>
          </aside>
        </div>

        <footer class="uc-flex uc-justify-center uc-mt-8 uc-pt-4">
          <span class="uc-demo-item">Footer</span>
        </footer>
      </div>
    </div>
  `,
})
export class UtilitiesOverviewPage {
  protected readonly breakpoints = BREAKPOINTS;
  protected readonly groups = GROUPS;
}
