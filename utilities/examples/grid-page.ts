import { Component } from '@angular/core';

interface ColumnDemo {
  readonly columns: number;
  readonly cells: readonly number[];
}

const range = (count: number): number[] => Array.from({ length: count }, (_, index) => index + 1);

const COLUMN_DEMOS: ColumnDemo[] = [2, 3, 4, 6].map((columns) => ({ columns, cells: range(columns * 2) }));

@Component({
  selector: 'uc-utilities-grid-page',
  styleUrl: '../utilities-demo.css',
  template: `
    <div class="uc-demo-block">
      <div class="uc-demo-title">grid-template-columns</div>
      <div class="uc-demo-note">
        uc-grid-cols-1 through uc-grid-cols-12 create equal tracks. Combine with a gap helper for spacing.
      </div>
      @for (demo of columnDemos; track demo.columns) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-grid-cols-{{ demo.columns }}</span>
          </div>
          <div class="uc-demo-canvas uc-grid uc-gap-2" [class]="'uc-grid-cols-' + demo.columns">
            @for (cell of demo.cells; track cell) {
              <div class="uc-demo-item">{{ cell }}</div>
            }
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">grid-column span</div>
      <div class="uc-demo-note">
        uc-col-span-* widens an item across tracks; uc-col-span-full stretches it edge to edge.
      </div>
      <div class="uc-demo-canvas uc-grid uc-grid-cols-6 uc-gap-2">
        <div class="uc-demo-item uc-col-span-full uc-demo-item-accent">uc-col-span-full</div>
        <div class="uc-demo-item uc-col-span-4 uc-demo-item-accent">uc-col-span-4</div>
        <div class="uc-demo-item uc-col-span-2">uc-col-span-2</div>
        <div class="uc-demo-item uc-col-span-3 uc-demo-item-accent">uc-col-span-3</div>
        <div class="uc-demo-item uc-col-span-3">uc-col-span-3</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Line-based placement</div>
      <div class="uc-demo-note">
        uc-col-start-* and uc-col-end-* place an item on named grid lines. A 6 column grid has 7 lines, so
        uc-col-start-2 uc-col-end-6 covers tracks 2 to 5.
      </div>
      <div class="uc-demo-canvas uc-grid uc-grid-cols-6 uc-gap-2">
        <div class="uc-demo-item uc-col-start-2 uc-col-end-6 uc-demo-item-accent">uc-col-start-2 uc-col-end-6</div>
        <div class="uc-demo-item uc-col-start-1 uc-col-end-3">uc-col-start-1 uc-col-end-3</div>
        <div class="uc-demo-item uc-col-start-5 uc-col-end-7 uc-demo-item-accent">uc-col-start-5 uc-col-end-7</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">grid-template-rows</div>
      <div class="uc-demo-note">
        uc-grid-rows-1 through uc-grid-rows-6 create equal row tracks. Pair with uc-grid-flow-col to fill down first.
      </div>
      <div class="uc-demo-canvas uc-grid uc-grid-rows-3 uc-grid-flow-col uc-gap-2 uc-demo-canvas-h12">
        @for (cell of six; track cell) {
          <div class="uc-demo-item">{{ cell }}</div>
        }
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Row span</div>
      <div class="uc-demo-note">uc-row-span-* makes an item cover several row tracks.</div>
      <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-grid-rows-2 uc-gap-2 uc-demo-canvas-h12">
        <div class="uc-demo-item uc-row-span-2 uc-demo-item-accent">uc-row-span-2</div>
        @for (cell of four; track cell) {
          <div class="uc-demo-item">{{ cell }}</div>
        }
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">grid-auto-flow</div>
      <div class="uc-demo-note">
        uc-grid-flow-row (default) fills across then down. uc-grid-flow-col fills down then across. The dense variants
        backfill holes left by spanning items.
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-grid-flow-row</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-cols-4 uc-grid-flow-row uc-gap-2">
          @for (cell of eight; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-grid-flow-col</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-rows-2 uc-grid-flow-col uc-gap-2">
          @for (cell of eight; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-grid-flow-row-dense</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-cols-4 uc-grid-flow-row-dense uc-gap-2">
          <div class="uc-demo-item uc-col-span-3 uc-demo-item-accent">span 3</div>
          @for (cell of seven; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">grid-auto-columns and grid-auto-rows</div>
      <div class="uc-demo-note">
        Sizes the tracks the grid creates on its own. uc-auto-cols-fr gives every implicit column an equal share;
        uc-auto-rows-min collapses implicit rows to their content.
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-auto-cols-fr</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-flow-col uc-auto-cols-fr uc-gap-2">
          @for (cell of five; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-auto-cols-max</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-flow-col uc-auto-cols-max uc-gap-2">
          <div class="uc-demo-item">short</div>
          <div class="uc-demo-item">a much longer cell</div>
          <div class="uc-demo-item">mid size</div>
        </div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Box alignment</div>
      <div class="uc-demo-note">
        uc-place-items-* sets align-items and justify-items together. uc-justify-items-* and uc-items-* still work on
        their own, and uc-place-content-* distributes the whole grid inside a taller container.
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-place-items-center</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-items-center uc-demo-canvas-h8">
          @for (cell of three; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-place-items-start</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-items-start uc-demo-canvas-h8">
          @for (cell of three; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>

      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-place-content-between</span></div>
        <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-content-between uc-demo-canvas-h10">
          @for (cell of six; track cell) {
            <div class="uc-demo-item">{{ cell }}</div>
          }
        </div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">uc-grid-auto-fit and uc-grid-auto-fill</div>
      <div class="uc-demo-note">
        Both fit as many tracks as will hold --uc-grid-min (16rem by default). Override the variable inline or in your
        own CSS for a different card width. auto-fit collapses empty tracks, auto-fill keeps them. Resize the canvas -
        the column count changes without a single media query.
      </div>
      <div class="uc-demo-canvas uc-grid-auto-fit uc-gap-4 uc-mb-4 uc-demo-grid-min-12">
        @for (cell of five; track cell) {
          <div class="uc-demo-item">{{ cell }}</div>
        }
      </div>
      <div class="uc-demo-note"><span class="uc-demo-code">--uc-grid-min: 12rem</span> on the container above.</div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Breakpoint variants</div>
      <div class="uc-demo-note">
        uc-grid uc-grid-cols-1 uc-sm-grid-cols-2 uc-lg-grid-cols-4 - the standard responsive card grid. One column on
        phones, two from 640px, four from 1024px.
      </div>
      <div class="uc-demo-canvas uc-grid uc-grid-cols-1 uc-sm-grid-cols-2 uc-lg-grid-cols-4 uc-gap-3">
        @for (cell of eight; track cell) {
          <div class="uc-demo-item">{{ cell }}</div>
        }
      </div>
    </div>
  `,
})
export class UtilitiesGridPage {
  protected readonly columnDemos = COLUMN_DEMOS;
  protected readonly three = range(3);
  protected readonly four = range(4);
  protected readonly five = range(5);
  protected readonly six = range(6);
  protected readonly seven = range(7);
  protected readonly eight = range(8);
}
