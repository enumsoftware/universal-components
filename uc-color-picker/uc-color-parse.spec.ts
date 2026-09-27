import { parseColor } from './uc-color-parse';

describe('parseColor', () => {
  it('reads hex with or without #, in three or six digits', () => {
    expect(parseColor('#FF8800')).toEqual({ hex: '#ff8800', format: 'hex' });
    expect(parseColor('ff8800')).toEqual({ hex: '#ff8800', format: 'hex' });
    expect(parseColor('#f80')).toEqual({ hex: '#ff8800', format: 'hex' });
    expect(parseColor('  #f80  ')).toEqual({ hex: '#ff8800', format: 'hex' });
  });

  it('reads rgb in comma and space notation, with or without alpha, and bare channels', () => {
    expect(parseColor('rgb(255, 136, 0)')).toEqual({ hex: '#ff8800', format: 'rgb' });
    expect(parseColor('rgb(255 136 0)')).toEqual({ hex: '#ff8800', format: 'rgb' });
    expect(parseColor('rgba(255, 136, 0, 0.5)')).toEqual({ hex: '#ff8800', format: 'rgb' });
    expect(parseColor('rgb(255 136 0 / 50%)')).toEqual({ hex: '#ff8800', format: 'rgb' });
    expect(parseColor('255, 136, 0')).toEqual({ hex: '#ff8800', format: 'rgb' });
  });

  it('reads hsl in comma and space notation, with degrees and alpha', () => {
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ hex: '#ff0000', format: 'hsl' });
    expect(parseColor('hsl(120deg 100% 25%)')).toEqual({ hex: '#008000', format: 'hsl' });
    expect(parseColor('hsla(240, 100%, 50%, 0.3)')).toEqual({ hex: '#0000ff', format: 'hsl' });
    expect(parseColor('hsl(0 0% 100% / 50%)')).toEqual({ hex: '#ffffff', format: 'hsl' });
  });

  it('rejects incomplete and out-of-range values', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('#ff88')).toBeNull();
    expect(parseColor('rgb(255, 136')).toBeNull();
    expect(parseColor('rgb(300, 0, 0)')).toBeNull();
    expect(parseColor('hsl(0, 120%, 50%)')).toBeNull();
    expect(parseColor('red')).toBeNull();
  });
});
