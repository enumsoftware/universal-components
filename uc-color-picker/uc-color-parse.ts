export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ParsedColor {
  /** Lower-case `#rrggbb`, the form the picker stores. */
  hex: string;
  /** The notation the text was written in, so the picker can keep showing it that way. */
  format: ColorFormat;
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
// rgb(255, 0, 0), rgb(255 0 0), rgba(255, 0, 0, 0.5), rgb(255 0 0 / 50%), or a bare 255, 0, 0.
const RGB = /^(?:rgba?\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,/]\s*[\d.]+%?)?\s*\)?$/i;
// hsl(210, 50%, 40%), hsl(210deg 50% 40%), hsla(210, 50%, 40%, 0.5) or hsl(210 50% 40% / 50%).
const HSL = /^hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/i;

/**
 * Reads a colour typed or pasted in hex, rgb() or hsl() notation. Returns null for anything that is
 * not a complete colour, so a half-typed value never changes the picker. Alpha is accepted but
 * dropped, because the picker has no transparency.
 */
export function parseColor(text: string): ParsedColor | null {
  const value = text.trim();

  const hex = HEX.exec(value);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((digit) => digit + digit).join('') : hex[1];
    return { hex: `#${digits.toLowerCase()}`, format: 'hex' };
  }

  // A bare hex such as "123" would also read as the start of rgb, so rgb requires three numbers.
  const rgb = RGB.exec(value);
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number);
    if (channels.some((channel) => channel > 255)) {
      return null;
    }
    return { hex: toHex(channels), format: 'rgb' };
  }

  const hsl = HSL.exec(value);
  if (hsl) {
    const [hue, saturation, lightness] = hsl.slice(1, 4).map(Number);
    if (saturation > 100 || lightness > 100) {
      return null;
    }
    return { hex: toHex(hslToRgb(hue % 360, saturation / 100, lightness / 100)), format: 'hsl' };
  }

  return null;
}

function toHex(channels: number[]): string {
  return `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

function hslToRgb(hue: number, saturation: number, lightness: number): number[] {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - chroma / 2;
  const [r, g, b] =
    hue < 60 ? [chroma, x, 0]
    : hue < 120 ? [x, chroma, 0]
    : hue < 180 ? [0, chroma, x]
    : hue < 240 ? [0, x, chroma]
    : hue < 300 ? [x, 0, chroma]
    : [chroma, 0, x];

  return [r, g, b].map((channel) => (channel + m) * 255);
}
