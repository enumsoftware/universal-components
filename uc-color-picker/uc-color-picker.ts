import {
  Component,
  ElementRef,
  Injector,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
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
import { parseColor, type ColorFormat, type ParsedColor } from './uc-color-parse';

type ColorMode = 'area' | 'wheel';

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
  /** Accessible name of the value field, where a colour can be typed or pasted. */
  readonly valueLabel = input<string>('Color value');

  value = model<string>('#ff0000');
  draftValue = model<string>('#ff0000');
  touched = model<boolean>(false);
  colorChange = output<string>();

  readonly isOpen = signal<boolean>(false);
  readonly colorMode = signal<ColorMode>('area');
  readonly colorFormat = signal<ColorFormat>('hex');
  /** What the user is typing in the value field; null shows the current colour instead. */
  readonly typedValue = signal<string | null>(null);

  private readonly injector = inject(Injector);
  private readonly valueInput = viewChild<ElementRef<HTMLInputElement>>('valueInput');

  readonly colorModeTabs: UcTab[] = [
    { key: 'area', label: 'Area' },
    { key: 'wheel', label: 'Wheel' },
  ];

  readonly displayValue = computed(() => this.value().toUpperCase());
  readonly showErrorState = computed(() => this.invalid() && this.touched());

  readonly valueText = computed(() => this.typedValue() ?? this.formattedValue());
  readonly valueInvalid = computed(() => {
    const typed = this.typedValue();
    return typed !== null && typed.trim() !== '' && parseColor(typed) === null;
  });

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
    // Focused with its text selected, so a colour can be pasted straight away. Not on touch screens,
    // where focusing a text field would pop up the keyboard over the picker.
    if (typeof matchMedia === 'function' && matchMedia('(pointer: fine)').matches) {
      afterNextRender(() => this.valueInput()?.nativeElement.select(), { injector: this.injector });
    }
  }

  closeDropdown() {
    this.typedValue.set(null);
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

  /** Every complete colour typed updates the preview; half-typed text leaves it alone. */
  onValueInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.typedValue.set(text);
    const color = parseColor(text);
    if (color) {
      this.applyColor(color);
    }
  }

  onValueEnter(event: Event) {
    event.preventDefault();
    if (!this.valueInvalid()) {
      this.saveChanges();
    }
  }

  /** Leaving the field shows the current colour again, which also clears invalid text. */
  onValueBlur() {
    this.typedValue.set(null);
  }

  /** A colour pasted anywhere else in the open panel is taken too; the value field handles its own. */
  onPanelPaste(event: ClipboardEvent) {
    if (event.target === this.valueInput()?.nativeElement) {
      return;
    }

    const color = parseColor(event.clipboardData?.getData('text') ?? '');
    if (color) {
      event.preventDefault();
      this.typedValue.set(null);
      this.applyColor(color);
    }
  }

  private applyColor(color: ParsedColor) {
    this.draftValue.set(color.hex);
    this.colorFormat.set(color.format);
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
