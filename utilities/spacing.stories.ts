import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Utilities/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Margin, padding and gap helpers built on a single spacing scale.',
          '',
          'Every class resolves to a `--uc-space-*` custom property, so retuning the scale in your',
          'app retunes every helper at once. Side suffixes use CSS logical properties, which means',
          '`ms`/`me` follow the writing direction and flip automatically in RTL layouts.',
          '',
          '| Suffix | Property |',
          '| --- | --- |',
          '| `m` / `p` | `margin` / `padding` |',
          '| `mx` / `px` | `margin-inline` / `padding-inline` |',
          '| `my` / `py` | `margin-block` / `padding-block` |',
          '| `mt` / `pt` | `margin-block-start` / `padding-block-start` |',
          '| `mb` / `pb` | `margin-block-end` / `padding-block-end` |',
          '| `ms` / `ps` | `margin-inline-start` / `padding-inline-start` |',
          '| `me` / `pe` | `margin-inline-end` / `padding-inline-end` |',
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

const SCALE: ReadonlyArray<readonly [string, string]> = [
  ['0', '0'],
  ['px', '1px'],
  ['1', '0.25rem'],
  ['2', '0.5rem'],
  ['3', '0.75rem'],
  ['4', '1rem'],
  ['5', '1.25rem'],
  ['6', '1.5rem'],
  ['8', '2rem'],
  ['10', '2.5rem'],
  ['12', '3rem'],
  ['16', '4rem'],
  ['20', '5rem'],
  ['24', '6rem'],
];

export const Scale: Story = {
  render: () => ({
    template: demo(
      'Spacing scale',
      'The same 14 steps drive margin, padding and gap. Step keys are the suffix you type, for example uc-p-6.',
      `
      <div class="uc-demo-scroll">
        <table class="uc-demo-table">
          <caption>Scale steps and the value each token resolves to.</caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Size</th>
            </tr>
          </thead>
          <tbody>
            ${SCALE.map(
              ([key, value]) => `
              <tr>
                <td><code>${key}</code></td>
                <td><code>--uc-space-${key}</code></td>
                <td>${value}</td>
                <td>
                  <div style="height: 0.75rem; width: var(--uc-space-${key}); min-width: 1px; border-radius: 999px; background: var(--primary-color);"></div>
                </td>
              </tr>`,
            ).join('')}
          </tbody>
        </table>
      </div>
    `,
    ),
  }),
};

export const Padding: Story = {
  render: () => ({
    template: [
      demo(
        'All sides',
        'The tinted frame is the padded element; the inner box is its content.',
        `
        <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
          ${['0', '2', '4', '6', '10']
            .map(
              (step) => `
            <div class="uc-demo-pad uc-p-${step}">
              <div class="uc-demo-pad-content">uc-p-${step}</div>
            </div>`,
            )
            .join('')}
        </div>
      `,
      ),
      demo(
        'Axis padding',
        'uc-px-* pads the inline axis (left and right in LTR), uc-py-* pads the block axis.',
        `
        <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
          <div class="uc-demo-pad uc-px-8 uc-py-2"><div class="uc-demo-pad-content">uc-px-8 uc-py-2</div></div>
          <div class="uc-demo-pad uc-px-2 uc-py-8"><div class="uc-demo-pad-content">uc-px-2 uc-py-8</div></div>
        </div>
      `,
      ),
      demo(
        'Single side',
        'Side helpers use logical properties, so ps/pe flip in right-to-left documents.',
        `
        <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
          ${['pt-8', 'pb-8', 'ps-8', 'pe-8']
            .map(
              (utility) => `
            <div class="uc-demo-pad uc-${utility}">
              <div class="uc-demo-pad-content">uc-${utility}</div>
            </div>`,
            )
            .join('')}
        </div>
      `,
      ),
    ].join(''),
  }),
};

export const Margin: Story = {
  render: () => ({
    template: [
      demo(
        'All sides and single sides',
        'The tinted band around each box is the margin the helper creates.',
        `
        <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
          ${['m-0', 'm-2', 'm-6', 'mt-6', 'mb-6', 'ms-6', 'me-6']
            .map(
              (utility) => `
            <div class="uc-demo-margin-frame">
              <div class="uc-demo-item uc-${utility}">uc-${utility}</div>
            </div>`,
            )
            .join('')}
        </div>
      `,
      ),
      demo(
        'Auto margins',
        'uc-mx-auto centres a block-level element; uc-ms-auto pushes a flex item to the inline end.',
        `
        <div class="uc-demo-canvas uc-mb-4">
          <div class="uc-demo-item uc-mx-auto" style="max-width: 12rem;">uc-mx-auto</div>
        </div>
        <div class="uc-demo-canvas uc-flex uc-gap-2">
          <div class="uc-demo-item">first</div>
          <div class="uc-demo-item uc-ms-auto uc-demo-item-accent">uc-ms-auto</div>
        </div>
      `,
      ),
      demo(
        'Negative margin',
        'Negative steps use an n prefix (uc-mt-n4). They exist at the base breakpoint only.',
        `
        <div class="uc-demo-canvas">
          <div class="uc-demo-item uc-demo-item-accent">reference</div>
          <div class="uc-demo-item uc-mt-n4 uc-ms-8">uc-mt-n4 uc-ms-8</div>
        </div>
      `,
      ),
    ].join(''),
  }),
};

export const Gap: Story = {
  render: () => ({
    template: [
      demo(
        'Uniform gap',
        'uc-gap-* sets both row and column gaps on a flex or grid container.',
        `
        <div class="uc-demo-canvas uc-flex uc-flex-wrap uc-gap-6">
          ${[1, 2, 3, 4, 5]
            .map((index) => `<div class="uc-demo-item">${index}</div>`)
            .join('')}
        </div>
      `,
      ),
      demo(
        'Axis gap',
        'uc-gap-x-* sets column-gap and uc-gap-y-* sets row-gap. Here columns are tight and rows are loose.',
        `
        <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-x-1 uc-gap-y-8">
          ${[1, 2, 3, 4, 5, 6]
            .map((index) => `<div class="uc-demo-item">${index}</div>`)
            .join('')}
        </div>
      `,
      ),
    ].join(''),
  }),
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Resize the preview to see the spacing change at 640px, 768px and 1024px.',
      },
    },
  },
  render: () => ({
    template: demo(
      'Breakpoint variants',
      'Prefix the breakpoint straight after uc-: uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12. Each variant applies from that width up.',
      `
      <div class="uc-demo-pad uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12">
        <div class="uc-demo-pad-content">uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12</div>
      </div>
    `,
    ),
  }),
};
