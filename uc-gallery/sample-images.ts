/** Self-contained placeholder photos for showcases and tests (no network needed). */
export function samplePhoto(label: string, color: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<rect width="800" height="600" fill="${color}"/>` +
    `<text x="400" y="320" font-family="sans-serif" font-size="64" fill="#fff" text-anchor="middle">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
