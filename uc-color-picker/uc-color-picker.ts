import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { UcButton } from '../uc-button/uc-button';
import { UcColorArea } from './uc-color-area/uc-color-area';
import { UcColorWheel } from './uc-color-wheel/uc-color-wheel';
import { UcTabPanel, UcTabs, type UcTab } from '../uc-tabs/uc-tabs';

type ColorMode = 'area' | 'wheel';
type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
}

@Component({
  selector: 'uc-color-picker',
  imports: [OverlayModule, UcButton, UcColorArea, UcColorWheel, UcTabs, UcTabPanel],
  templateUrl: './uc-color-picker.html',
  styleUrl: './uc-color-picker.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'uc-color-picker-host',
  },
})
export class UcColorPicker implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly size = input<number>(220);
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly invalid = input<boolean>(false);

  value = model<string>('#ff0000');
  draftValue = model<string>('#ff0000');
  touched = model<boolean>(false);
  colorChange = output<string>();

  readonly isOpen = signal<boolean>(false);
  readonly colorMode = signal<ColorMode>('area');
  readonly colorFormat = signal<ColorFormat>('hex');

  readonly colorModeTabs: UcTab[] = [
    { key: 'area', label: 'Area' },
    { key: 'wheel', label: 'Wheel' },
  ];

  readonly displayValue = computed(() => this.value().toUpperCase());
  readonly showErrorState = computed(() => this.invalid() && this.touched());

  readonly formattedValue = computed<string>(() => {
    const hex = this.draftValue();
    const format = this.colorFormat();
    const rgb = this.parseHex(hex);
    if (!rgb) return hex.toUpperCase();
    if (format === 'hex') return hex.toUpperCase();
    if (format === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hsl = this.rgbToHsl(rgb);
    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
  });

  toggleDropdown() {
    if (this.disabled() || this.readonly()) return;
    if (this.isOpen()) {
      this.cancelChanges();
      return;
    }

    this.openDropdown();
  }

  openDropdown() {
    this.draftValue.set(this.value());
    this.isOpen.set(true);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  cancelChanges() {
    this.draftValue.set(this.value());
    this.closeDropdown();
  }

  saveChanges() {
    const nextValue = this.draftValue();
    this.value.set(nextValue);
    this.touched.set(true);
    this.colorChange.emit(nextValue);
    this.closeDropdown();
  }

  onSwatchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
    }
  }

  setColorMode(mode: string) {
    this.colorMode.set(mode as ColorMode);
  }

  setColorFormat(format: ColorFormat) {
    this.colorFormat.set(format);
  }

  onColorChange(hex: string) {
    this.draftValue.set(hex);
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

  private rgbToHsl(color: RgbColor): HslColor {
    const r = color.r / 255,
      g = color.g / 255,
      b = color.b / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h: h * 360, s, l };
  }
}
