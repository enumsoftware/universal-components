import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
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
  selector: 'uc-color-area',
  templateUrl: './uc-color-area.html',
  styleUrl: './uc-color-area.css',
})
export class UcColorArea {
  readonly size = input<number>(220);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  value = model<string>('#ff0000');
  colorChange = output<string>();

  readonly svCanvas = viewChild<ElementRef<HTMLCanvasElement>>('svCanvas');
  readonly hueTrack = viewChild<ElementRef<HTMLDivElement>>('hueTrack');

  private isDraggingArea = false;
  private isDraggingHue = false;

  // Internal HSV state as plain properties to avoid reactive cycles
  private hue = 0;
  private saturation = 1;
  private brightness = 1;

  // Signals for template binding only
  readonly svMarker = signal<{ x: number; y: number }>({ x: 220, y: 0 });
  readonly hueThumbX = signal<number>(0);
  readonly hueColor = computed<string>(() => `hsl(${Math.round(this.hueThumbX() / Math.max(this.size(), 1) * 360)}, 100%, 50%)`);

  constructor() {
    afterRenderEffect(() => {
      const size = this.size();
      const hex = this.value();
      this.syncHsvFromHex(hex);
      this.updateMarkerSignals(size);
      this.drawSvCanvas(size);
    });
  }

  // --- Area canvas pointer handlers ---

  onAreaPointerDown(event: PointerEvent) {
    if (this.disabled() || this.readonly()) return;
    const canvasEl = this.svCanvas()?.nativeElement;
    if (!canvasEl) return;
    this.isDraggingArea = true;
    canvasEl.setPointerCapture(event.pointerId);
    this.updateFromAreaPointer(event);
  }

  onAreaPointerMove(event: PointerEvent) {
    if (!this.isDraggingArea) return;
    this.updateFromAreaPointer(event);
  }

  onAreaPointerUp(event: PointerEvent) {
    if (!this.isDraggingArea) return;
    this.svCanvas()?.nativeElement.releasePointerCapture(event.pointerId);
    this.isDraggingArea = false;
  }

  // --- Hue slider pointer handlers ---

  onHuePointerDown(event: PointerEvent) {
    if (this.disabled() || this.readonly()) return;
    const trackEl = this.hueTrack()?.nativeElement;
    if (!trackEl) return;
    this.isDraggingHue = true;
    trackEl.setPointerCapture(event.pointerId);
    this.updateFromHuePointer(event);
  }

  onHuePointerMove(event: PointerEvent) {
    if (!this.isDraggingHue) return;
    this.updateFromHuePointer(event);
  }

  onHuePointerUp(event: PointerEvent) {
    if (!this.isDraggingHue) return;
    this.hueTrack()?.nativeElement.releasePointerCapture(event.pointerId);
    this.isDraggingHue = false;
  }

  // --- Private helpers ---

  private updateFromAreaPointer(event: PointerEvent) {
    const canvasEl = this.svCanvas()?.nativeElement;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const size = this.size();
    const x = Math.max(0, Math.min(event.clientX - rect.left, size));
    const y = Math.max(0, Math.min(event.clientY - rect.top, size));
    this.saturation = x / size;
    this.brightness = 1 - y / size;
    this.svMarker.set({ x, y });
    this.emitCurrentColor();
  }

  private updateFromHuePointer(event: PointerEvent) {
    const trackEl = this.hueTrack()?.nativeElement;
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const size = this.size();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    this.hue = (x / rect.width) * 360;
    this.hueThumbX.set((this.hue / 360) * size);
    this.drawSvCanvas(size);
    this.emitCurrentColor();
  }

  private emitCurrentColor() {
    const rgb = this.hsvToRgb({ h: this.hue, s: this.saturation, v: this.brightness });
    const hex = this.rgbToHex(rgb);
    this.value.set(hex);
    this.colorChange.emit(hex);
  }

  private syncHsvFromHex(hex: string) {
    if (this.isDraggingArea || this.isDraggingHue) return;
    const rgb = this.parseHex(hex);
    if (!rgb) return;
    const hsv = this.rgbToHsv(rgb);
    this.hue = hsv.h;
    this.saturation = hsv.s;
    this.brightness = hsv.v;
  }

  private updateMarkerSignals(size: number) {
    this.svMarker.set({
      x: this.saturation * size,
      y: (1 - this.brightness) * size,
    });
    this.hueThumbX.set((this.hue / 360) * size);
  }

  private drawSvCanvas(size: number) {
    const canvasEl = this.svCanvas()?.nativeElement;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx || size <= 0) return;

    const dimension = Math.max(16, Math.floor(size));
    canvasEl.width = dimension;
    canvasEl.height = dimension;

    // Base hue fill
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, dimension, dimension);

    // White-to-transparent gradient (left = white/no-saturation, right = full-saturation)
    const whiteGrad = ctx.createLinearGradient(0, 0, dimension, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, dimension, dimension);

    // Transparent-to-black gradient (top = full-brightness, bottom = black)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, dimension);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, dimension, dimension);
  }

  // --- Color conversions ---

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
    let r = 0, g = 0, b = 0;
    if (hueSegment < 1) { r = chroma; g = second; }
    else if (hueSegment < 2) { r = second; g = chroma; }
    else if (hueSegment < 3) { g = chroma; b = second; }
    else if (hueSegment < 4) { g = second; b = chroma; }
    else if (hueSegment < 5) { r = second; b = chroma; }
    else { r = chroma; b = second; }
    const m = color.v - chroma;
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  private rgbToHsv(color: RgbColor): HsvColor {
    const r = color.r / 255, g = color.g / 255, b = color.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
