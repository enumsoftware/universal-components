import {
  Directive,
  ElementRef,
  inject,
  DestroyRef,
  ComponentRef,
  computed,
  signal,
  input,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { UcTooltipComponent } from './uc-tooltip-component/uc-tooltip-component';

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

  private tooltipId = signal<string>('');
  tooltipIdComputed = computed(() => this.tooltipId());

  ucTooltip = input<string>('');

  show() {
    if (this.overlayRef) return;
    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionBuilder.flexibleConnectedTo(this.elementRef).withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 0,
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 0,
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 0,
        },
      ]),
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
