import { Component } from '@angular/core';

interface ScaleStep {
  readonly key: string;
  readonly value: string;
}

const SCALE: ScaleStep[] = [
  { key: '0', value: '0' },
  { key: 'px', value: '1px' },
  { key: '1', value: '0.25rem' },
  { key: '2', value: '0.5rem' },
  { key: '3', value: '0.75rem' },
  { key: '4', value: '1rem' },
  { key: '5', value: '1.25rem' },
  { key: '6', value: '1.5rem' },
  { key: '8', value: '2rem' },
  { key: '10', value: '2.5rem' },
  { key: '12', value: '3rem' },
  { key: '16', value: '4rem' },
  { key: '20', value: '5rem' },
  { key: '24', value: '6rem' },
];

@Component({
  selector: 'uc-utilities-spacing-page',
  styleUrl: '../utilities-demo.css',
  template: `
    <div class="uc-demo-block">
      <div class="uc-demo-title">Spacing scale</div>
      <div class="uc-demo-note">
        The same 14 steps drive margin, padding and gap. Step keys are the suffix you type, for example uc-p-6.
      </div>
      <div class="uc-demo-scroll">
        <table class="uc-demo-table">
          <caption>
            Scale steps and the value each token resolves to.
          </caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Size</th>
            </tr>
          </thead>
          <tbody>
            @for (step of scale; track step.key) {
              <tr>
                <td>
                  <code>{{ step.key }}</code>
                </td>
                <td>
                  <code>--uc-space-{{ step.key }}</code>
                </td>
                <td>{{ step.value }}</td>
                <td>
                  <div class="uc-demo-swatch" [style.width]="'var(--uc-space-' + step.key + ')'"></div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Padding: all sides</div>
      <div class="uc-demo-note">The tinted frame is the padded element; the inner box is its content.</div>
      <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
        <div class="uc-demo-pad uc-p-0"><div class="uc-demo-pad-content">uc-p-0</div></div>
        <div class="uc-demo-pad uc-p-2"><div class="uc-demo-pad-content">uc-p-2</div></div>
        <div class="uc-demo-pad uc-p-4"><div class="uc-demo-pad-content">uc-p-4</div></div>
        <div class="uc-demo-pad uc-p-6"><div class="uc-demo-pad-content">uc-p-6</div></div>
        <div class="uc-demo-pad uc-p-10"><div class="uc-demo-pad-content">uc-p-10</div></div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Padding: axis</div>
      <div class="uc-demo-note">uc-px-* pads the inline axis (left and right in LTR), uc-py-* pads the block axis.</div>
      <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
        <div class="uc-demo-pad uc-px-8 uc-py-2"><div class="uc-demo-pad-content">uc-px-8 uc-py-2</div></div>
        <div class="uc-demo-pad uc-px-2 uc-py-8"><div class="uc-demo-pad-content">uc-px-2 uc-py-8</div></div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Padding: single side</div>
      <div class="uc-demo-note">Side helpers use logical properties, so ps/pe flip in right-to-left documents.</div>
      <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
        <div class="uc-demo-pad uc-pt-8"><div class="uc-demo-pad-content">uc-pt-8</div></div>
        <div class="uc-demo-pad uc-pb-8"><div class="uc-demo-pad-content">uc-pb-8</div></div>
        <div class="uc-demo-pad uc-ps-8"><div class="uc-demo-pad-content">uc-ps-8</div></div>
        <div class="uc-demo-pad uc-pe-8"><div class="uc-demo-pad-content">uc-pe-8</div></div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Margin: all sides and single sides</div>
      <div class="uc-demo-note">The tinted band around each box is the margin the helper creates.</div>
      <div class="uc-flex uc-flex-wrap uc-items-start uc-gap-4">
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-m-0">uc-m-0</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-m-2">uc-m-2</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-m-6">uc-m-6</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-mt-6">uc-mt-6</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-mb-6">uc-mb-6</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-ms-6">uc-ms-6</div></div>
        <div class="uc-demo-margin-frame"><div class="uc-demo-item uc-me-6">uc-me-6</div></div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Auto margins</div>
      <div class="uc-demo-note">
        uc-mx-auto centres a block-level element; uc-ms-auto pushes a flex item to the inline end.
      </div>
      <div class="uc-demo-canvas uc-mb-4">
        <div class="uc-demo-item uc-mx-auto uc-demo-item-narrow">uc-mx-auto</div>
      </div>
      <div class="uc-demo-canvas uc-flex uc-gap-2">
        <div class="uc-demo-item">first</div>
        <div class="uc-demo-item uc-ms-auto uc-demo-item-accent">uc-ms-auto</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Negative margin</div>
      <div class="uc-demo-note">Negative steps use an n prefix (uc-mt-n4). They exist at the base breakpoint only.</div>
      <div class="uc-demo-canvas">
        <div class="uc-demo-item uc-demo-item-accent">reference</div>
        <div class="uc-demo-item uc-mt-n4 uc-ms-8">uc-mt-n4 uc-ms-8</div>
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Uniform gap</div>
      <div class="uc-demo-note">uc-gap-* sets both row and column gaps on a flex or grid container.</div>
      <div class="uc-demo-canvas uc-flex uc-flex-wrap uc-gap-6">
        @for (index of five; track index) {
          <div class="uc-demo-item">{{ index }}</div>
        }
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Axis gap</div>
      <div class="uc-demo-note">
        uc-gap-x-* sets column-gap and uc-gap-y-* sets row-gap. Here columns are tight and rows are loose.
      </div>
      <div class="uc-demo-canvas uc-grid uc-grid-cols-3 uc-gap-x-1 uc-gap-y-8">
        @for (index of six; track index) {
          <div class="uc-demo-item">{{ index }}</div>
        }
      </div>
    </div>

    <div class="uc-demo-block">
      <div class="uc-demo-title">Breakpoint variants</div>
      <div class="uc-demo-note">
        Prefix the breakpoint straight after uc-: uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12. Each variant applies from that
        width up - resize the canvas to see it change at 640px, 768px and 1024px.
      </div>
      <div class="uc-demo-pad uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12">
        <div class="uc-demo-pad-content">uc-p-2 uc-sm-p-4 uc-md-p-8 uc-lg-p-12</div>
      </div>
    </div>
  `,
})
export class UtilitiesSpacingPage {
  protected readonly scale = SCALE;
  protected readonly five = [1, 2, 3, 4, 5];
  protected readonly six = [1, 2, 3, 4, 5, 6];
}
