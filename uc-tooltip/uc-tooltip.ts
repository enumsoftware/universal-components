import {
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  EnvironmentProviders,
  makeEnvironmentProviders,
  DestroyRef,
  ComponentRef,
  computed,
  signal,
  input,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { UcTooltipComponent } from './uc-tooltip-component/uc-tooltip-component';

export type UcTooltipPosition =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

export interface UcTooltipConfig {
  position?: UcTooltipPosition;
  /** CSS length (e.g. '8px', '0.5rem') for the gap between the anchor and the tooltip. */
  margin?: string;
}

const UC_TOOLTIP_DEFAULT_CONFIG: Required<UcTooltipConfig> = {
  position: 'bottom',
  margin: '8px',
};

export const UC_TOOLTIP_CONFIG = new InjectionToken<Required<UcTooltipConfig>>('UC_TOOLTIP_CONFIG', {
  providedIn: 'root',
  factory: () => UC_TOOLTIP_DEFAULT_CONFIG,
});

export function provideUcTooltipConfig(config: UcTooltipConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UC_TOOLTIP_CONFIG, useValue: { ...UC_TOOLTIP_DEFAULT_CONFIG, ...config } },
  ]);
}

/** Fallback order for each position so the CDK overlay can flip when it doesn't fit the viewport. */
const UC_TOOLTIP_FALLBACK_ORDER: Record<UcTooltipPosition, UcTooltipPosition[]> = {
  top: ['bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'right', 'left'],
  'top-start': ['bottom-start', 'top', 'top-end', 'bottom', 'bottom-end', 'right', 'left'],
  'top-end': ['bottom-end', 'top', 'top-start', 'bottom', 'bottom-start', 'left', 'right'],
  bottom: ['top', 'bottom-start', 'bottom-end', 'top-start', 'top-end', 'right', 'left'],
  'bottom-start': ['top-start', 'bottom', 'bottom-end', 'top', 'top-end', 'right', 'left'],
  'bottom-end': ['top-end', 'bottom', 'bottom-start', 'top', 'top-start', 'left', 'right'],
  left: ['right', 'top', 'bottom', 'top-start', 'bottom-start', 'top-end', 'bottom-end'],
  right: ['left', 'top', 'bottom', 'top-end', 'bottom-end', 'top-start', 'bottom-start'],
};

function toConnectedPosition(position: UcTooltipPosition, marginPx: number): ConnectedPosition {
  switch (position) {
    case 'top':
      return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -marginPx };
    case 'top-start':
      return { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -marginPx };
    case 'top-end':
      return { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -marginPx };
    case 'bottom':
      return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: marginPx };
    case 'bottom-start':
      return { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: marginPx };
    case 'bottom-end':
      return { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: marginPx };
    case 'left':
      return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -marginPx };
    case 'right':
      return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: marginPx };
  }
}

/** Measures a CSS length string (e.g. '8px', '0.5rem') in pixels using a detached DOM node. */
function cssLengthToPx(value: string): number {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.width = value;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px;
}

@Directive({
  selector: '[ucTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
    tabindex: '0',
    'aria-describedby': 'tooltipIdComputed()',
  },
})
export class UcTooltip {
  private overlayRef: OverlayRef | null = null;
  private tooltipComponentRef: ComponentRef<UcTooltipComponent> | null = null;
  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(UC_TOOLTIP_CONFIG);

  private tooltipId = signal<string>('');
  tooltipIdComputed = computed(() => this.tooltipId());

  ucTooltip = input<string>('');
  ucTooltipPosition = input<UcTooltipPosition | undefined>(undefined);
  ucTooltipMargin = input<string | undefined>(undefined);

  show() {
    if (this.overlayRef) return;

    const position = this.ucTooltipPosition() ?? this.config.position;
    const marginPx = cssLengthToPx(this.ucTooltipMargin() ?? this.config.margin);
    const positions = [position, ...UC_TOOLTIP_FALLBACK_ORDER[position]].map((pos) =>
      toConnectedPosition(pos, marginPx),
    );

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionBuilder.flexibleConnectedTo(this.elementRef).withPositions(positions),
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false,
      panelClass: 'uc-tooltip-panel',
    });

    const tooltipPortal = new ComponentPortal(UcTooltipComponent);
    this.tooltipComponentRef = this.overlayRef.attach(tooltipPortal);
    this.tooltipComponentRef.instance.text = this.ucTooltip();
    this.tooltipId.set(this.tooltipComponentRef.instance.id);

    this.destroyRef.onDestroy(() => this.hide());
  }

  hide() {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.tooltipComponentRef = null;
    this.tooltipId.set('');
  }
}
