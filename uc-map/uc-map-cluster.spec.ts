import { clusterCountLabel, clusterIconSvg, type UcMapClusterStyle } from './uc-map-cluster';

const STYLE: UcMapClusterStyle = { background: '#2f5bd3', color: '#ffffff', borderColor: '#ffffff', borderWidth: 3 };

describe('clusterCountLabel', () => {
  it('shows counts from 0 to 99 as they are, and 99+ above', () => {
    expect(clusterCountLabel(0)).toBe('0');
    expect(clusterCountLabel(7)).toBe('7');
    expect(clusterCountLabel(99)).toBe('99');
    expect(clusterCountLabel(100)).toBe('99+');
    expect(clusterCountLabel(4321)).toBe('99+');
  });
});

describe('clusterIconSvg', () => {
  it('draws a circle in the given colours with the count in the middle', () => {
    const svg = clusterIconSvg(42, STYLE);

    expect(svg).toContain('fill="#2f5bd3"');
    expect(svg).toContain('stroke="#ffffff" stroke-width="3"');
    expect(svg).toContain('r="18.5"');
    expect(svg).toMatch(/fill="#ffffff">42<\/text>/);
  });

  it('shows 99+ in a smaller font so it fits the circle', () => {
    const svg = clusterIconSvg(250, STYLE);

    expect(svg).toContain('>99+</text>');
    expect(svg).toContain('font-size="12"');
  });

  it('draws no border when the width is 0', () => {
    expect(clusterIconSvg(3, { ...STYLE, borderWidth: 0 })).toContain('stroke-width="0"');
  });

  it('escapes colours so they cannot break out of the attribute', () => {
    const svg = clusterIconSvg(3, { ...STYLE, background: '"><script>' });

    expect(svg).not.toContain('<script>');
    expect(svg).toContain('fill="&quot;&gt;&lt;script&gt;"');
  });
});
