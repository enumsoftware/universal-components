import { axisLabelStride } from './uc-chart-axis';

describe('axisLabelStride', () => {
  it('shows every label when they fit', () => {
    expect(axisLabelStride([40, 42, 38], 60)).toBe(1);
  });

  it('skips labels that would overlap on a narrow chart', () => {
    // 12 monthly labels of about 58px on a phone, 44px apart.
    expect(axisLabelStride(Array(12).fill(58), 44)).toBe(2);
    expect(axisLabelStride(Array(12).fill(58), 30)).toBe(3);
  });

  it('shows every label when nothing could be measured', () => {
    expect(axisLabelStride([], 20)).toBe(1);
    expect(axisLabelStride([0, 0], 20)).toBe(1);
    expect(axisLabelStride([40], 0)).toBe(1);
  });
});
