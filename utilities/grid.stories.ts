import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Utilities/Grid',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'CSS Grid helpers: column and row templates, item placement, flow and implicit track sizing.',
          '',
          'Column tracks are generated as `repeat(n, minmax(0, 1fr))`, so a long word or a wide child',
          'cannot blow a track past its share of the row. Gap uses the shared spacing scale - see',
          '**Utilities/Spacing**.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const demo = (title: string, note: string, body: string): string => `
  <div class="uc-demo-block">
    <div class="uc-demo-title">${title}</div>
    <div class="uc-demo-note">${note}</div>
    ${body}
  </div>
`;

const cells = (count: number, extraClass = ''): string =>
  Array.from({ length: count }, (_, index) => `<div class="uc-demo-item ${extraClass}">${index + 1}</div>`).join('');

const labelled = (utility: string, body: string): string => `
  <div class="uc-mb-4">
    <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-${utility}</span></div>
    ${body}
  </div>
`;

export const Columns: Story = {
  render: () => ({
    template: demo(
      'grid-template-columns',
      'uc-grid-cols-1 through uc-grid-cols-12 create equal tracks. Combine with a gap helper for spacing.',
      [2, 3, 4, 6]
        .map((columns) =>
          labelled(
            `grid-cols-${columns}`,
            `<div class="uc-demo-canvas uc-grid uc-grid-cols-${columns} uc-gap-2">${cells(columns * 2)}</div>`,
          ),
        )
        .join(''),
    ),
  }),
};

export const ColumnSpan: Story = {
  render: () => ({
    template: demo(
      'grid-column span',
      'uc-col-span-* widens an item across tracks; uc-col-span-full stretches it edge to edge.',
      `
      <div class="uc-demo-canvas uc-grid uc-grid-cols-6 uc-gap-2">
        <div class="uc-demo-item uc-col-span-full uc-demo-item-accent">uc-col-span-full</div>
        <div class="uc-demo-item uc-col-span-4 uc-demo-item-accent">uc-col-span-4</div>
        <div class="uc-demo-item uc-col-span-2">uc-col-span-2</div>
        <div class="uc-demo-item uc-col-span-3 uc-demo-item-accent">uc-col-span-3</div>
        <div class="uc-demo-item uc-col-span-3">uc-col-span-3</div>
      </div>
    `,
    ),
  }),
};

export const ExplicitPlacement: Story = {
  render: () => ({
    template: demo(
      'Line-based placement',
      'uc-col-start-* and uc-col-end-* place an item on named grid lines. A 6 column grid has 7 lines, so uc-col-start-2 uc-col-end-6 covers tracks 2 to 5.',
      `
      <div class="uc-demo-canvas uc-grid uc-grid-cols-6 uc-gap-2">
        <div class="uc-demo-item uc-col-start-2 uc-col-end-6 uc-demo-item-accent">uc-col-start-2 uc-col-end-6</div>
        <div class="uc-demo-item uc-col-start-1 uc-col-end-3">uc-col-start-1 uc-col-end-3</div>
        <div class="uc-demo-item uc-col-start-5 uc-col-end-7 uc-demo-item-accent">uc-col-start-5 uc-col-end-7</div>
      </div>
    `,
    ),
  }),
};

export const Rows: Story = {
  render: () => ({
    template: [
      demo(
        'grid-template-rows',
        'uc-grid-rows-1 through uc-grid-rows-6 create equal row tracks. Pair with uc-grid-flow-col to fill down first.',
        `
        <div class="uc-demo-canvas uc-grid uc-grid-rows-3 uc-grid-flow-col uc-gap-2" style="height: 12rem;">
          ${cells(6)}
        </div>
      `,
      ),
      demo(
        'Row span',
        'uc-row-span-* makes an item cover several row tracks.',
        `
        <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-grid-rows-2 uc-gap-2" style="height: 12rem;">
          <div class="uc-demo-item uc-row-span-2 uc-demo-item-accent">uc-row-span-2</div>
          ${cells(4)}
        </div>
      `,
      ),
    ].join(''),
  }),
};

export const Flow: Story = {
  render: () => ({
    template: demo(
      'grid-auto-flow',
      'uc-grid-flow-row (default) fills across then down. uc-grid-flow-col fills down then across. The dense variants backfill holes left by spanning items.',
      [
        labelled(
          'grid-flow-row',
          `<div class="uc-demo-canvas uc-grid uc-grid-cols-4 uc-grid-flow-row uc-gap-2">${cells(8)}</div>`,
        ),
        labelled(
          'grid-flow-col',
          `<div class="uc-demo-canvas uc-grid uc-grid-rows-2 uc-grid-flow-col uc-gap-2">${cells(8)}</div>`,
        ),
        labelled(
          'grid-flow-row-dense',
          `<div class="uc-demo-canvas uc-grid uc-grid-cols-4 uc-grid-flow-row-dense uc-gap-2">
            <div class="uc-demo-item uc-col-span-3 uc-demo-item-accent">span 3</div>
            ${cells(7)}
          </div>`,
        ),
      ].join(''),
    ),
  }),
};

export const ImplicitTracks: Story = {
  render: () => ({
    template: demo(
      'grid-auto-columns and grid-auto-rows',
      'Sizes the tracks the grid creates on its own. uc-auto-cols-fr gives every implicit column an equal share; uc-auto-rows-min collapses implicit rows to their content.',
      [
        labelled(
          'auto-cols-fr',
          `<div class="uc-demo-canvas uc-grid uc-grid-flow-col uc-auto-cols-fr uc-gap-2">${cells(5)}</div>`,
        ),
        labelled(
          'auto-cols-max',
          `<div class="uc-demo-canvas uc-grid uc-grid-flow-col uc-auto-cols-max uc-gap-2">
            <div class="uc-demo-item">short</div>
            <div class="uc-demo-item">a much longer cell</div>
            <div class="uc-demo-item">mid size</div>
          </div>`,
        ),
      ].join(''),
    ),
  }),
};

export const Alignment: Story = {
  render: () => ({
    template: demo(
      'Box alignment',
      'uc-place-items-* sets align-items and justify-items together. uc-justify-items-* and uc-items-* still work on their own, and uc-place-content-* distributes the whole grid inside a taller container.',
      [
        labelled(
          'place-items-center',
          `<div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-items-center" style="height: 8rem;">${cells(3)}</div>`,
        ),
        labelled(
          'place-items-start',
          `<div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-items-start" style="height: 8rem;">${cells(3)}</div>`,
        ),
        labelled(
          'place-content-between',
          `<div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-2 uc-place-content-between" style="height: 10rem;">${cells(6)}</div>`,
        ),
      ].join(''),
    ),
  }),
};

export const AutoFit: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Resize the preview - the column count changes without a single media query.',
      },
    },
  },
  render: () => ({
    template: demo(
      'uc-grid-auto-fit and uc-grid-auto-fill',
      'Both fit as many tracks as will hold --uc-grid-min (16rem by default). Override the variable inline or in your own CSS for a different card width. auto-fit collapses empty tracks, auto-fill keeps them.',
      `
      <div class="uc-demo-canvas uc-grid-auto-fit uc-gap-4 uc-mb-4" style="--uc-grid-min: 12rem;">
        ${cells(5)}
      </div>
      <div class="uc-demo-note"><span class="uc-demo-code">style="--uc-grid-min: 12rem"</span> on the container above.</div>
    `,
    ),
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'One column on phones, two from 640px, four from 1024px.',
      },
    },
  },
  render: () => ({
    template: demo(
      'Breakpoint variants',
      'uc-grid uc-grid-cols-1 uc-sm-grid-cols-2 uc-lg-grid-cols-4 - the standard responsive card grid.',
      `
      <div class="uc-demo-canvas uc-grid uc-grid-cols-1 uc-sm-grid-cols-2 uc-lg-grid-cols-4 uc-gap-3">
        ${cells(8)}
      </div>
    `,
    ),
  }),
};
