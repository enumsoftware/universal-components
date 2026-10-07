/** How a cluster icon is drawn. Colours are any CSS colour string. */
export interface UcMapClusterStyle {
  background: string;
  color: string;
  borderColor: string;
  /** Border width in pixels. */
  borderWidth: number;
}

/** The icon's width and height in pixels. */
export const CLUSTER_ICON_SIZE = 40;

/** A cluster's count as shown on its icon: the number up to 99, then `99+`. */
export function clusterCountLabel(count: number): string {
  return count > 99 ? '99+' : String(Math.max(0, Math.floor(count)));
}

/**
 * The cluster icon as SVG markup: a circle with the count in the middle. It is shown as an image, so
 * it uses a system font rather than the page's web font, which an image cannot load.
 */
export function clusterIconSvg(count: number, style: UcMapClusterStyle): string {
  const size = CLUSTER_ICON_SIZE;
  const label = clusterCountLabel(count);
  const border = Math.max(0, style.borderWidth);
  // The border is drawn centred on the circle's edge, so the radius leaves room for half of it.
  const radius = (size - border) / 2;
  const fontSize = label.length > 2 ? 12 : 14;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${attribute(style.background)}"` +
    ` stroke="${attribute(style.borderColor)}" stroke-width="${border}"/>` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"` +
    ` font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="700"` +
    ` fill="${attribute(style.color)}">${label}</text>` +
    `</svg>`
  );
}

/** Colours come from CSS custom properties, so they are escaped before going into the markup. */
function attribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
