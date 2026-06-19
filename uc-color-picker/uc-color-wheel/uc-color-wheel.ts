import {
  Component,
  ElementRef,
  afterRenderEffect,
  input,
  model,
  output,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface HsvColor {
  h: number;
  s: number;
  v: number;
}

@Component({
  selector: 'uc-color-wheel',
  templateUrl: './uc-color-wheel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-color-wheel.css',
})
export class UcColorWheel {
  readonly size = input<number>(220);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  value = model<string>('#ff0000');
  colorChange = output<string>();

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private isDragging = false;

  readonly markerPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  constructor() {
    afterRenderEffect(() => {
      const size = this.size();
      this.drawWheel(size);
      this.syncMarkerToValue(size);
    });
  }

  onPointerDown(event: PointerEvent) {
    if (this.disabled() || this.readonly()) return;
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;
    this.isDragging = true;
    canvasEl.setPointerCapture(event.pointerId);
    this.updateFromPointer(event);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;
    this.updateFromPointer(event);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;
    this.canvas()?.nativeElement.releasePointerCapture(event.pointerId);
    this.isDragging = false;
  }

  private updateFromPointer(event: PointerEvent) {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = rect.width / 2;
    const center = radius;
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.min(distance, radius);
    const saturation = radius === 0 ? 0 : clampedDistance / radius;
    const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

    const rgb = this.hsvToRgb({ h: hue, s: saturation, v: 1 });
    const hex = this.rgbToHex(rgb);

    const dir = distance === 0 ? { x: 1, y: 0 } : { x: dx / distance, y: dy / distance };
    this.markerPosition.set({
      x: center + dir.x * clampedDistance,
      y: center + dir.y * clampedDistance,
    });

    this.value.set(hex);
    this.colorChange.emit(hex);
  }

  private drawWheel(size: number) {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx || size <= 0) return;

    const dimension = Math.max(16, Math.floor(size));
    canvasEl.width = dimension;
    canvasEl.height = dimension;

    const image = ctx.createImageData(dimension, dimension);
    const radius = dimension / 2;
    const center = radius;

    for (let py = 0; py < dimension; py++) {
      for (let px = 0; px < dimension; px++) {
        const dx = px - center;
        const dy = py - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const idx = (py * dimension + px) * 4;

        if (distance > radius) {
          image.data[idx + 3] = 0;
          continue;
        }

        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const saturation = distance / radius;
        const rgb = this.hsvToRgb({ h: hue, s: saturation, v: 1 });

        image.data[idx] = rgb.r;
        image.data[idx + 1] = rgb.g;
        image.data[idx + 2] = rgb.b;
        image.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  private syncMarkerToValue(size: number) {
    if (this.isDragging) return;
    const rgb = this.parseHex(this.value());
    if (!rgb) return;
    const hsv = this.rgbToHsv(rgb);
    const radius = size / 2;
    const angle = (hsv.h * Math.PI) / 180;
    const distance = hsv.s * radius;
    this.markerPosition.set({
      x: radius + Math.cos(angle) * distance,
      y: radius + Math.sin(angle) * distance,
    });
  }

  private parseHex(hex: string): RgbColor | null {
    const normalized = hex.trim().replace('#', '');
    if (normalized.length === 3) {
      return {
        r: Number.parseInt(normalized[0] + normalized[0], 16),
        g: Number.parseInt(normalized[1] + normalized[1], 16),
        b: Number.parseInt(normalized[2] + normalized[2], 16),
      };
    }
    if (normalized.length === 6) {
      return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16),
      };
    }
    return null;
  }

  private rgbToHex(color: RgbColor): string {
    const toHex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  private hsvToRgb(color: HsvColor): RgbColor {
    const chroma = color.v * color.s;
    const hueSegment = color.h / 60;
    const second = chroma * (1 - Math.abs((hueSegment % 2) - 1));
    let r = 0,
      g = 0,
      b = 0;
    if (hueSegment < 1) {
      r = chroma;
      g = second;
    } else if (hueSegment < 2) {
      r = second;
      g = chroma;
    } else if (hueSegment < 3) {
      g = chroma;
      b = second;
    } else if (hueSegment < 4) {
      g = second;
      b = chroma;
    } else if (hueSegment < 5) {
      r = second;
      b = chroma;
    } else {
      r = chroma;
      b = second;
    }
    const m = color.v - chroma;
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  private rgbToHsv(color: RgbColor): HsvColor {
    const r = color.r / 255,
      g = color.g / 255,
      b = color.b / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
    }
    return { h: hue, s: max === 0 ? 0 : delta / max, v: max };
  }
}
