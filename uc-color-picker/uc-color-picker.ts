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
import { OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';

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
  selector: 'uc-color-picker',
 imports: [OverlayModule],
  templateUrl: './uc-color-picker.html',
  styleUrl: './uc-color-picker.css',
  host: {
    class: 'uc-color-picker-host',
  },
})
export class UcColorPicker implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly size = input<number>(200);
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly invalid = input<boolean>(false);

  value = model<string>('#ff0000');
  touched = model<boolean>(false);
  colorChange = output<string>();

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

 readonly isOpen = signal<boolean>(false);
  private readonly isDragging = signal<boolean>(false);
  readonly markerPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  readonly displayValue = computed(() => this.value().toUpperCase());
  readonly showErrorState = computed(() => this.invalid() && this.touched());

  constructor() {
    afterRenderEffect(() => {
      this.drawWheel(this.size());
      this.syncMarkerToValue();
    });
  }

   toggleDropdown() {
     if (this.disabled() || this.readonly()) {
       return;
     }
     this.isOpen.set(!this.isOpen());
   }

   closeDropdown() {
     this.isOpen.set(false);
   }

   onSwatchKeydown(event: KeyboardEvent) {
     if (event.key === 'Enter' || event.key === ' ') {
       event.preventDefault();
       this.toggleDropdown();
     }
   }

  onPointerDown(event: PointerEvent) {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const canvasRef = this.canvas();
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef.nativeElement;
    this.isDragging.set(true);
    canvas.setPointerCapture(event.pointerId);
    this.updateFromPointer(event);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDragging() || this.disabled() || this.readonly()) {
      return;
    }

    this.updateFromPointer(event);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDragging()) {
      return;
    }

    const canvasRef = this.canvas();
    if (!canvasRef) {
      this.isDragging.set(false);
      return;
    }

    const canvas = canvasRef.nativeElement;
    this.isDragging.set(false);
    canvas.releasePointerCapture(event.pointerId);
     // Close dropdown after selection
     this.closeDropdown();
  }

  private updateFromPointer(event: PointerEvent) {
    const canvasRef = this.canvas();
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = rect.width / 2;
    const center = radius;
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.min(distance, radius);
    const saturation = radius === 0 ? 0 : clampedDistance / radius;
    const angle = Math.atan2(dy, dx);
    const hue = (angle * 180) / Math.PI + 360;

    const rgb = this.hsvToRgb({ h: hue % 360, s: saturation, v: 1 });
    const hex = this.rgbToHex(rgb);

    const normalizedDirection =
      distance === 0 ? { x: 1, y: 0 } : { x: dx / distance, y: dy / distance };
    this.markerPosition.set({
      x: center + normalizedDirection.x * clampedDistance,
      y: center + normalizedDirection.y * clampedDistance,
    });

    this.value.set(hex);
    this.touched.set(true);
    this.colorChange.emit(hex);
  }

  private drawWheel(size: number) {
    const canvasRef = this.canvas();
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context || size <= 0) {
      return;
    }

    const dimension = Math.max(16, Math.floor(size));
    canvas.width = dimension;
    canvas.height = dimension;

    const image = context.createImageData(dimension, dimension);
    const radius = dimension / 2;
    const center = radius;

    for (let y = 0; y < dimension; y += 1) {
      for (let x = 0; x < dimension; x += 1) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const pixelIndex = (y * dimension + x) * 4;
        if (distance > radius) {
          image.data[pixelIndex + 3] = 0;
          continue;
        }

        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const saturation = distance / radius;
        const rgb = this.hsvToRgb({ h: hue, s: saturation, v: 1 });

        image.data[pixelIndex] = rgb.r;
        image.data[pixelIndex + 1] = rgb.g;
        image.data[pixelIndex + 2] = rgb.b;
        image.data[pixelIndex + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);
  }

  private syncMarkerToValue() {
    const canvasRef = this.canvas();
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef.nativeElement;
    const color = this.parseHex(this.value());

    if (!color || canvas.width === 0 || canvas.height === 0) {
      return;
    }

    const hsv = this.rgbToHsv(color);
    const radius = canvas.width / 2;
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
      const r = Number.parseInt(normalized[0] + normalized[0], 16);
      const g = Number.parseInt(normalized[1] + normalized[1], 16);
      const b = Number.parseInt(normalized[2] + normalized[2], 16);
      return { r, g, b };
    }

    if (normalized.length === 6) {
      const r = Number.parseInt(normalized.slice(0, 2), 16);
      const g = Number.parseInt(normalized.slice(2, 4), 16);
      const b = Number.parseInt(normalized.slice(4, 6), 16);
      return { r, g, b };
    }

    return null;
  }

  private rgbToHex(color: RgbColor): string {
    const toHex = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  private hsvToRgb(color: HsvColor): RgbColor {
    const chroma = color.v * color.s;
    const hueSegment = color.h / 60;
    const secondComponent = chroma * (1 - Math.abs((hueSegment % 2) - 1));

    let r = 0;
    let g = 0;
    let b = 0;

    if (hueSegment >= 0 && hueSegment < 1) {
      r = chroma;
      g = secondComponent;
      b = 0;
    } else if (hueSegment >= 1 && hueSegment < 2) {
      r = secondComponent;
      g = chroma;
      b = 0;
    } else if (hueSegment >= 2 && hueSegment < 3) {
      r = 0;
      g = chroma;
      b = secondComponent;
    } else if (hueSegment >= 3 && hueSegment < 4) {
      r = 0;
      g = secondComponent;
      b = chroma;
    } else if (hueSegment >= 4 && hueSegment < 5) {
      r = secondComponent;
      g = 0;
      b = chroma;
    } else {
      r = chroma;
      g = 0;
      b = secondComponent;
    }

    const match = color.v - chroma;
    return {
      r: Math.round((r + match) * 255),
      g: Math.round((g + match) * 255),
      b: Math.round((b + match) * 255),
    };
  }

  private rgbToHsv(color: RgbColor): HsvColor {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
      if (max === r) {
        hue = ((g - b) / delta) % 6;
      } else if (max === g) {
        hue = (b - r) / delta + 2;
      } else {
        hue = (r - g) / delta + 4;
      }
      hue *= 60;
      if (hue < 0) {
        hue += 360;
      }
    }

    const saturation = max === 0 ? 0 : delta / max;
    return { h: hue, s: saturation, v: max };
  }
}
