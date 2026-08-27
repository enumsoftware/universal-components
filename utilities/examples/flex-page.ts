import { NgTemplateOutlet } from '@angular/common';
import { Component, type TemplateRef } from '@angular/core';

const DIRECTIONS = ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'];
const WRAPS = ['flex-nowrap', 'flex-wrap', 'flex-wrap-reverse'];
const JUSTIFY = [
  'justify-start',
  'justify-center',
  'justify-end',
  'justify-between',
  'justify-around',
  'justify-evenly',
];
const ALIGN_ITEMS = ['items-stretch', 'items-start', 'items-center', 'items-end', 'items-baseline'];
const ALIGN_CONTENT = ['content-start', 'content-center', 'content-between', 'content-evenly'];

@Component({
  selector: 'uc-utilities-flex-page',
  imports: [NgTemplateOutlet],
  styleUrl: '../utilities-demo.css',
  template: `
    <!-- Bodies reused across the labelled variant canvases below. -->
    <ng-template #threeItems>
      @for (index of three; track index) {
        <div class="uc-demo-item">{{ index }}</div>
      }
    </ng-template>

    <ng-template #wideItems>
      @for (index of eight; track index) {
        <div class="uc-demo-item uc-demo-item-wide">item {{ index }}</div>
      }
    </ng-template>

    <ng-template #mixedHeights>
      <div class="uc-demo-item">short</div>
      <div class="uc-demo-item uc-demo-item-tall">taller</div>
      <div class="uc-demo-item uc-demo-item-taller">tallest</div>
    </ng-template>

    <ng-template #wrappedLines>
      <div class="uc-demo-spacer"></div>
      @for (index of eight; track index) {
        <div class="uc-demo-item uc-demo-item-wider">item {{ index }}</div>
      }
    </ng-template>

    <div class="uc-demo-block">
      <div class="uc-demo-title">uc-flex</div>
      <div class="uc-demo-note">Turns the element into a block-level flex container.</div>
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <ng-container [ngTemplateOutlet]="threeItems" />
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">uc-inline-flex</div>
      <div class="uc-demo-note">Same layout rules, but the container itself flows inline with surrounding text.</div>
      <div class="uc-demo-canvas">
        text before
        <span class="uc-inline-flex uc-gap-2 uc-mx-2">
          <div class="uc-demo-item">1</div>
          <div class="uc-demo-item">2</div>
        </span>
        text after
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">flex-direction</div>
      <div class="uc-demo-note">
        uc-flex-row is the default. uc-flex-col stacks children, and the -reverse variants invert the order.
      </div>
      @for (utility of directions; track utility) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-{{ utility }}</span>
          </div>
          <div class="uc-demo-canvas uc-flex uc-gap-2" [class]="'uc-' + utility">
            <ng-container [ngTemplateOutlet]="threeItems" />
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">flex-wrap</div>
      <div class="uc-demo-note">
        Wrapping is off by default. The demo children are wide enough to overflow one line.
      </div>
      @for (utility of wraps; track utility) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-{{ utility }}</span>
          </div>
          <div class="uc-demo-canvas uc-flex uc-gap-2" [class]="'uc-' + utility">
            <ng-container [ngTemplateOutlet]="wideItems" />
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">justify-content</div>
      <div class="uc-demo-note">
        Distributes children along the main axis. On a row container that is the horizontal axis.
      </div>
      @for (utility of justify; track utility) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-{{ utility }}</span>
          </div>
          <div class="uc-demo-canvas uc-flex uc-gap-2" [class]="'uc-' + utility">
            <ng-container [ngTemplateOutlet]="threeItems" />
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">align-items</div>
      <div class="uc-demo-note">
        Aligns children on the cross axis. Children below have different heights so the effect is visible.
      </div>
      @for (utility of alignItems; track utility) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-{{ utility }}</span>
          </div>
          <div class="uc-demo-canvas uc-flex uc-gap-2 uc-demo-canvas-tall" [class]="'uc-' + utility">
            <ng-container [ngTemplateOutlet]="mixedHeights" />
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">align-content</div>
      <div class="uc-demo-note">
        Distributes wrapped lines in the cross axis. It only applies when the container wraps onto multiple lines.
      </div>
      @for (utility of alignContent; track utility) {
        <div class="uc-mb-4">
          <div class="uc-demo-note uc-mb-1">
            <span class="uc-demo-code">uc-{{ utility }}</span>
          </div>
          <div class="uc-demo-canvas uc-flex uc-flex-wrap uc-gap-2" [class]="'uc-' + utility">
            <ng-container [ngTemplateOutlet]="wrappedLines" />
          </div>
        </div>
      }
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">align-self and justify-self</div>
      <div class="uc-demo-note">uc-self-* overrides the container alignment for a single child.</div>
      <div class="uc-demo-canvas uc-flex uc-items-start uc-gap-2 uc-demo-canvas-tall">
        <div class="uc-demo-item">default</div>
        <div class="uc-demo-item uc-self-center uc-demo-item-accent">uc-self-center</div>
        <div class="uc-demo-item uc-self-end uc-demo-item-accent">uc-self-end</div>
        <div class="uc-demo-item uc-self-stretch uc-demo-item-accent">uc-self-stretch</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">flex shorthand</div>
      <div class="uc-demo-note">
        uc-flex-1 makes an item take the free space and ignore its content size; uc-flex-auto keeps its content size as
        the basis; uc-flex-none opts out of growing and shrinking.
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2 uc-mb-4">
        <div class="uc-demo-item uc-flex-1 uc-demo-item-accent">uc-flex-1</div>
        <div class="uc-demo-item">auto width</div>
        <div class="uc-demo-item uc-flex-1 uc-demo-item-accent">uc-flex-1</div>
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <div class="uc-demo-item uc-flex-auto uc-demo-item-accent">uc-flex-auto with a longer label</div>
        <div class="uc-demo-item uc-flex-auto uc-demo-item-accent">uc-flex-auto</div>
        <div class="uc-demo-item uc-flex-none">uc-flex-none</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">grow and shrink</div>
      <div class="uc-demo-note">
        uc-grow lets one item absorb the remaining space. uc-shrink-0 protects an item from being squeezed - pair it
        with uc-min-w-0 on the neighbour that should truncate instead.
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2 uc-mb-4">
        <div class="uc-demo-item">fixed</div>
        <div class="uc-demo-item uc-grow uc-demo-item-accent">uc-grow</div>
        <div class="uc-demo-item">fixed</div>
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <div class="uc-demo-item uc-min-w-0 uc-demo-truncate">
          uc-min-w-0 lets this long label truncate instead of pushing the row wider
        </div>
        <div class="uc-demo-item uc-shrink-0 uc-demo-item-accent">uc-shrink-0</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">flex-basis</div>
      <div class="uc-demo-note">Fraction helpers set the starting size before free space is distributed.</div>
      <div class="uc-demo-canvas uc-flex uc-flex-wrap uc-gap-2">
        <div class="uc-demo-item uc-basis-1-2 uc-demo-item-accent">uc-basis-1-2</div>
        <div class="uc-demo-item uc-basis-1-4">uc-basis-1-4</div>
        <div class="uc-demo-item uc-basis-1-4">uc-basis-1-4</div>
        <div class="uc-demo-item uc-basis-full uc-demo-item-accent">uc-basis-full</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">order</div>
      <div class="uc-demo-note">
        Visual order only - the DOM order below is A, B, C. Keep the DOM in reading order so keyboard and screen reader
        users get the same sequence.
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <div class="uc-demo-item uc-order-last uc-demo-item-accent">A (uc-order-last)</div>
        <div class="uc-demo-item">B</div>
        <div class="uc-demo-item uc-order-first uc-demo-item-accent">C (uc-order-first)</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Shorthand combinations</div>
      <div class="uc-demo-note">
        Three patterns that show up constantly, bundled into one class each. They exist at the base breakpoint only.
      </div>
      <div class="uc-flex uc-flex-col uc-gap-4">
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-center</span></div>
          <div class="uc-demo-canvas uc-flex-center uc-demo-canvas-tall">
            <div class="uc-demo-item uc-demo-item-accent">1</div>
          </div>
        </div>
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-col-center</span></div>
          <div class="uc-demo-canvas uc-flex-col-center uc-gap-2 uc-demo-canvas-tall">
            <div class="uc-demo-item uc-demo-item-accent">1</div>
            <div class="uc-demo-item uc-demo-item-accent">2</div>
          </div>
        </div>
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-between</span></div>
          <div class="uc-demo-canvas uc-flex-between">
            <div class="uc-demo-item">start</div>
            <div class="uc-demo-item uc-demo-item-accent">end</div>
          </div>
        </div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Stack on small screens, row on large</div>
      <div class="uc-demo-note">
        uc-flex uc-flex-col uc-md-flex-row uc-md-items-center is the standard responsive toolbar pattern - resize the
        canvas to cross the 768px breakpoint.
      </div>
      <div class="uc-demo-canvas uc-flex uc-flex-col uc-md-flex-row uc-md-items-center uc-gap-2">
        <div class="uc-demo-item uc-md-flex-1 uc-demo-item-accent">uc-md-flex-1</div>
        <div class="uc-demo-item">action</div>
        <div class="uc-demo-item">action</div>
      </div>
    </div>
  `,
})
export class UtilitiesFlexPage {
  protected readonly three = [1, 2, 3];
  protected readonly eight = [1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly directions = DIRECTIONS;
  protected readonly wraps = WRAPS;
  protected readonly justify = JUSTIFY;
  protected readonly alignItems = ALIGN_ITEMS;
  protected readonly alignContent = ALIGN_CONTENT;
}
