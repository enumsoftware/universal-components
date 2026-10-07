import type * as d3 from 'd3';

/** Space kept between two neighbouring axis labels, in pixels. */
const LABEL_GAP = 8;

/**
 * How many ticks apart the shown labels must be so that none overlap: 1 shows every label, 2 every
 * other one. Widths are the rendered label widths; step is the distance between two ticks.
 */
export function axisLabelStride(labelWidths: number[], step: number, gap = LABEL_GAP): number {
  const widest = Math.max(0, ...labelWidths.filter((width) => Number.isFinite(width)));
  if (widest === 0 || step <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil((widest + gap) / step));
}

/**
 * Hides the labels of a bottom axis that would overlap on a narrow chart, keeping every n-th label
 * from the first. The ticks stay, so each point still has its mark.
 */
export function thinAxisLabels(axis: d3.Selection<SVGGElement, unknown, null, undefined>, step: number): void {
  const labels = axis.selectAll<SVGTextElement, unknown>('.tick text').nodes();
  const widths = labels.map((label) => (typeof label.getComputedTextLength === 'function' ? label.getComputedTextLength() : 0));
  const stride = axisLabelStride(widths, step);

  labels.forEach((label, index) => {
    label.style.display = index % stride === 0 ? '' : 'none';
  });
}
