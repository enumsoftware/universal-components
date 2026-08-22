import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Utilities/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A small, opt-in layout layer that ships next to the components: flexbox, CSS Grid,',
          'margin, padding and gap helpers. Everything is plain CSS - there is nothing to import',
          'into an Angular module and no build step in the consuming app.',
          '',
          '## Install',
          '',
          'The utility layer is **not** part of `theme.css`, so existing apps pay nothing for it until',
          'they ask for it. Add it to your global stylesheet:',
          '',
          '```css',
          "@import '@enumsoftware/universal-components/themes/theme.css';",
          "@import '@enumsoftware/universal-components/themes/utilities.css';",
          '```',
          '',
          '## Naming',
          '',
          'Every class is `uc-` prefixed so it cannot collide with Tailwind, Bootstrap or your own CSS:',
          '',
          '```text',
          'uc-<utility>                 applies at every width      uc-flex, uc-p-4',
          'uc-<breakpoint>-<utility>    applies from that width up  uc-md-flex-row, uc-lg-p-8',
          '```',
          '',
          'Breakpoints are mobile-first `min-width` queries: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.',
          '',
          '## Side names are logical',
          '',
          'Side helpers map to CSS logical properties, not physical ones. `uc-ms-4` is',
          '`margin-inline-start`, so it is the left margin in LTR and the right margin in RTL - no RTL',
          'stylesheet needed.',
          '',
          '## Customising',
          '',
          'The scale lives in custom properties, so redefine the steps you want after the import:',
          '',
          '```css',
          ':root {',
          '  --uc-space-4: 0.875rem; /* retunes uc-p-4, uc-m-4, uc-gap-4, ... at once */',
          '  --uc-grid-min: 18rem;   /* default track width for uc-grid-auto-fit */',
          '}',
          '```',
          '',
          'Utilities are single-class selectors with no `!important`, so component styles and your own',
          'more specific rules still win where you need them to.',
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

const BREAKPOINTS: ReadonlyArray<readonly [string, string, string]> = [
  ['(none)', 'all widths', 'uc-flex'],
  ['sm', 'from 640px', 'uc-sm-flex-row'],
  ['md', 'from 768px', 'uc-md-grid-cols-2'],
  ['lg', 'from 1024px', 'uc-lg-p-8'],
  ['xl', 'from 1280px', 'uc-xl-gap-12'],
];

const GROUPS: ReadonlyArray<readonly [string, string, string]> = [
  ['Display', 'uc-block, uc-flex, uc-inline-flex, uc-grid, uc-inline-grid, uc-contents, uc-hidden', 'yes'],
  ['Flex container', 'uc-flex-row|col(-reverse), uc-flex-wrap|nowrap|wrap-reverse', 'yes'],
  ['Flex item', 'uc-flex-1|auto|initial|none, uc-grow(-0), uc-shrink(-0), uc-basis-*, uc-order-*', 'yes'],
  ['Grid container', 'uc-grid-cols-1..12, uc-grid-rows-1..6, uc-grid-flow-*, uc-auto-cols-*, uc-auto-rows-*', 'yes'],
  ['Grid item', 'uc-col-span-*, uc-col-start-*, uc-col-end-*, uc-row-span-*, uc-row-start-*, uc-row-end-*', 'yes'],
  ['Alignment', 'uc-justify-*, uc-items-*, uc-content-*, uc-self-*, uc-place-items-*, uc-place-content-*', 'yes'],
  ['Gap', 'uc-gap-*, uc-gap-x-*, uc-gap-y-*', 'yes'],
  ['Margin', 'uc-m-*, uc-mx|my-*, uc-mt|mb|ms|me-*, uc-m*-auto', 'yes'],
  ['Padding', 'uc-p-*, uc-px|py-*, uc-pt|pb|ps|pe-*', 'yes'],
  ['Negative margin', 'uc-mt-n4 and friends', 'no'],
  ['Composites', 'uc-flex-center, uc-flex-col-center, uc-flex-between, uc-grid-auto-fit, uc-grid-auto-fill', 'no'],
];

export const Breakpoints: Story = {
  render: () => ({
    template: demo(
      'Breakpoint prefixes',
      'Prefixes are mobile-first: a variant applies from its width upwards, and the unprefixed class is the base.',
      `
      <div class="uc-demo-scroll">
        <table class="uc-demo-table">
          <caption>Breakpoint prefixes and the width each one starts at.</caption>
          <thead>
            <tr>
              <th scope="col">Prefix</th>
              <th scope="col">Applies</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            ${BREAKPOINTS.map(
              ([prefix, applies, example]) => `
              <tr>
                <td><code>${prefix}</code></td>
                <td>${applies}</td>
                <td><code>${example}</code></td>
              </tr>`,
            ).join('')}
          </tbody>
        </table>
      </div>
    `,
    ),
  }),
};

export const WhatIsIncluded: Story = {
  render: () => ({
    template: demo(
      'Utility groups',
      'Everything in the layer, and whether it has breakpoint variants.',
      `
      <div class="uc-demo-scroll">
        <table class="uc-demo-table" style="max-width: 60rem;">
          <caption>Groups shipped in themes/utilities.css.</caption>
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Classes</th>
              <th scope="col">Responsive</th>
            </tr>
          </thead>
          <tbody>
            ${GROUPS.map(
              ([group, classes, responsive]) => `
              <tr>
                <td>${group}</td>
                <td><code>${classes}</code></td>
                <td>${responsive}</td>
              </tr>`,
            ).join('')}
          </tbody>
        </table>
      </div>
    `,
    ),
  }),
};

export const PuttingItTogether: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A page shell built only from utilities - resize the preview to see it reflow.',
      },
    },
  },
  render: () => ({
    template: demo(
      'A realistic layout',
      'Header uses uc-flex-between, the body is a responsive grid, and the sidebar drops below the content on small screens.',
      `
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
    `,
    ),
  }),
};
