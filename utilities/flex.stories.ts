import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Utilities/Flex',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Flexbox helpers: container display, direction, wrapping, alignment and item sizing.',
          '',
          'Container helpers (`uc-flex`, `uc-justify-*`, `uc-items-*`) go on the parent; item helpers',
          '(`uc-flex-1`, `uc-grow`, `uc-self-*`, `uc-order-*`) go on the children. Gap is shared with the',
          'spacing scale - see **Utilities/Spacing**.',
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

const items = (count: number, extraClass = ''): string =>
  Array.from({ length: count }, (_, index) => `<div class="uc-demo-item ${extraClass}">${index + 1}</div>`).join('');

/** Renders one labelled canvas per utility class in the list. */
const variants = (utilities: readonly string[], containerClass: string, body: string): string =>
  utilities
    .map(
      (utility) => `
      <div class="uc-mb-4">
        <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-${utility}</span></div>
        <div class="uc-demo-canvas ${containerClass} uc-${utility}">${body}</div>
      </div>`,
    )
    .join('');

export const Display: Story = {
  render: () => ({
    template: [
      demo(
        'uc-flex',
        'Turns the element into a block-level flex container.',
        `<div class="uc-demo-canvas uc-flex uc-gap-2">${items(3)}</div>`,
      ),
      demo(
        'uc-inline-flex',
        'Same layout rules, but the container itself flows inline with surrounding text.',
        `<div class="uc-demo-canvas">
          text before
          <span class="uc-inline-flex uc-gap-2 uc-mx-2">${items(2)}</span>
          text after
        </div>`,
      ),
    ].join(''),
  }),
};

export const Direction: Story = {
  render: () => ({
    template: demo(
      'flex-direction',
      'uc-flex-row is the default. uc-flex-col stacks children, and the -reverse variants invert the order.',
      variants(['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'], 'uc-flex uc-gap-2', items(3)),
    ),
  }),
};

export const Wrap: Story = {
  render: () => ({
    template: demo(
      'flex-wrap',
      'Wrapping is off by default. The demo children are wide enough to overflow one line.',
      variants(
        ['flex-nowrap', 'flex-wrap', 'flex-wrap-reverse'],
        'uc-flex uc-gap-2',
        Array.from(
          { length: 8 },
          (_, index) => `<div class="uc-demo-item" style="min-width: 7rem;">item ${index + 1}</div>`,
        ).join(''),
      ),
    ),
  }),
};

export const JustifyContent: Story = {
  render: () => ({
    template: demo(
      'justify-content',
      'Distributes children along the main axis. On a row container that is the horizontal axis.',
      variants(
        [
          'justify-start',
          'justify-center',
          'justify-end',
          'justify-between',
          'justify-around',
          'justify-evenly',
        ],
        'uc-flex uc-gap-2',
        items(3),
      ),
    ),
  }),
};

export const AlignItems: Story = {
  render: () => ({
    template: demo(
      'align-items',
      'Aligns children on the cross axis. Children below have different heights so the effect is visible.',
      variants(
        ['items-stretch', 'items-start', 'items-center', 'items-end', 'items-baseline'],
        'uc-flex uc-gap-2 uc-demo-canvas-tall',
        `<div class="uc-demo-item">short</div>
         <div class="uc-demo-item uc-demo-item-tall">taller</div>
         <div class="uc-demo-item uc-demo-item-taller">tallest</div>`,
      ),
    ),
  }),
};

export const AlignContent: Story = {
  render: () => ({
    template: demo(
      'align-content',
      'Distributes wrapped lines in the cross axis. It only applies when the container wraps onto multiple lines.',
      variants(
        ['content-start', 'content-center', 'content-between', 'content-evenly'],
        'uc-flex uc-flex-wrap uc-gap-2',
        `<div style="height: 12rem; width: 0;"></div>${Array.from(
          { length: 8 },
          (_, index) => `<div class="uc-demo-item" style="min-width: 8rem;">item ${index + 1}</div>`,
        ).join('')}`,
      ),
    ),
  }),
};

export const SelfAlignment: Story = {
  render: () => ({
    template: demo(
      'align-self and justify-self',
      'uc-self-* overrides the container alignment for a single child.',
      `
      <div class="uc-demo-canvas uc-flex uc-items-start uc-gap-2 uc-demo-canvas-tall" style="min-height: 10rem;">
        <div class="uc-demo-item">default</div>
        <div class="uc-demo-item uc-self-center uc-demo-item-accent">uc-self-center</div>
        <div class="uc-demo-item uc-self-end uc-demo-item-accent">uc-self-end</div>
        <div class="uc-demo-item uc-self-stretch uc-demo-item-accent">uc-self-stretch</div>
      </div>
    `,
    ),
  }),
};

export const ItemSizing: Story = {
  render: () => ({
    template: [
      demo(
        'flex shorthand',
        'uc-flex-1 makes an item take the free space and ignore its content size; uc-flex-auto keeps its content size as the basis; uc-flex-none opts out of growing and shrinking.',
        `
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
      `,
      ),
      demo(
        'grow and shrink',
        'uc-grow lets one item absorb the remaining space. uc-shrink-0 protects an item from being squeezed - pair it with uc-min-w-0 on the neighbour that should truncate instead.',
        `
        <div class="uc-demo-canvas uc-flex uc-gap-2 uc-mb-4">
          <div class="uc-demo-item">fixed</div>
          <div class="uc-demo-item uc-grow uc-demo-item-accent">uc-grow</div>
          <div class="uc-demo-item">fixed</div>
        </div>
        <div class="uc-demo-canvas uc-flex uc-gap-2">
          <div class="uc-demo-item uc-min-w-0" style="overflow: hidden; text-overflow: ellipsis; display: block;">
            uc-min-w-0 lets this long label truncate instead of pushing the row wider
          </div>
          <div class="uc-demo-item uc-shrink-0 uc-demo-item-accent">uc-shrink-0</div>
        </div>
      `,
      ),
      demo(
        'flex-basis',
        'Fraction helpers set the starting size before free space is distributed.',
        `
        <div class="uc-demo-canvas uc-flex uc-flex-wrap uc-gap-2">
          <div class="uc-demo-item uc-basis-1-2 uc-demo-item-accent">uc-basis-1-2</div>
          <div class="uc-demo-item uc-basis-1-4">uc-basis-1-4</div>
          <div class="uc-demo-item uc-basis-1-4">uc-basis-1-4</div>
          <div class="uc-demo-item uc-basis-full uc-demo-item-accent">uc-basis-full</div>
        </div>
      `,
      ),
    ].join(''),
  }),
};

export const Order: Story = {
  render: () => ({
    template: demo(
      'order',
      'Visual order only - the DOM order below is A, B, C. Keep the DOM in reading order so keyboard and screen reader users get the same sequence.',
      `
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <div class="uc-demo-item uc-order-last uc-demo-item-accent">A (uc-order-last)</div>
        <div class="uc-demo-item">B</div>
        <div class="uc-demo-item uc-order-first uc-demo-item-accent">C (uc-order-first)</div>
      </div>
    `,
    ),
  }),
};

export const Composites: Story = {
  render: () => ({
    template: demo(
      'Shorthand combinations',
      'Three patterns that show up constantly, bundled into one class each. They exist at the base breakpoint only.',
      `
      <div class="uc-flex uc-flex-col uc-gap-4">
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-center</span></div>
          <div class="uc-demo-canvas uc-flex-center uc-demo-canvas-tall">${items(1, 'uc-demo-item-accent')}</div>
        </div>
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-col-center</span></div>
          <div class="uc-demo-canvas uc-flex-col-center uc-gap-2 uc-demo-canvas-tall">${items(2, 'uc-demo-item-accent')}</div>
        </div>
        <div>
          <div class="uc-demo-note uc-mb-1"><span class="uc-demo-code">uc-flex-between</span></div>
          <div class="uc-demo-canvas uc-flex-between">
            <div class="uc-demo-item">start</div>
            <div class="uc-demo-item uc-demo-item-accent">end</div>
          </div>
        </div>
      </div>
    `,
    ),
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Resize the preview to cross the 768px breakpoint.',
      },
    },
  },
  render: () => ({
    template: demo(
      'Stack on small screens, row on large',
      'uc-flex uc-flex-col uc-md-flex-row uc-md-items-center is the standard responsive toolbar pattern.',
      `
      <div class="uc-demo-canvas uc-flex uc-flex-col uc-md-flex-row uc-md-items-center uc-gap-2">
        <div class="uc-demo-item uc-md-flex-1 uc-demo-item-accent">uc-md-flex-1</div>
        <div class="uc-demo-item">action</div>
        <div class="uc-demo-item">action</div>
      </div>
    `,
    ),
  }),
};
