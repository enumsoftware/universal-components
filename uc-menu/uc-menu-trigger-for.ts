import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { UcMenu } from './uc-menu';

@Directive({
  selector: '[ucMenuTriggerFor]',
})
export class UcMenuTriggerFor {
  readonly ucMenuTriggerFor = input.required<UcMenu>();

  private readonly overlay = inject(Overlay);
  private readonly triggerElement = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private opened = false;

  @HostBinding('attr.aria-haspopup')
  readonly hasPopup = 'menu';

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): string {
    return this.opened ? 'true' : 'false';
  }

  @HostBinding('attr.aria-controls')
  get ariaControls(): string | null {
    return this.opened ? this.ucMenuTriggerFor().panelId : null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    this.toggleMenu();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu(true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openMenu(true, false);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenu(true, true);
    }
  }

  toggleMenu(shouldFocusFirstItem = false): void {
    if (this.opened) {
      this.closeMenu();
      return;
    }

    this.openMenu(shouldFocusFirstItem, false);
  }

  openMenu(shouldFocusFirstItem = false, focusLastItem = false): void {
    if (this.opened) {
      return;
    }

    const menu = this.ucMenuTriggerFor();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.triggerElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -8,
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'uc-menu-overlay',
      disposeOnNavigation: true,
    });

    this.overlayRef.attach(new TemplatePortal(menu.templateRef, this.viewContainerRef));
    this.opened = true;

    this.overlayRef.backdropClick().subscribe(() => this.closeMenu(false));
    this.overlayRef.detachments().subscribe(() => this.closeMenu(false));
    this.overlayRef.keydownEvents().subscribe((event) => this.onOverlayKeydown(event));
    this.bindPanelEvents();

    this.destroyRef.onDestroy(() => this.closeMenu(false));

    if (shouldFocusFirstItem) {
      this.focusMenuItem(focusLastItem ? 'last' : 'first');
    }
  }

  closeMenu(restoreFocus = true): void {
    if (!this.overlayRef) {
      this.opened = false;
      return;
    }

    const overlayRef = this.overlayRef;
    this.overlayRef = null;
    this.opened = false;
    overlayRef.dispose();

    if (restoreFocus) {
      this.triggerElement.nativeElement.focus();
    }
  }

  private onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextItem();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousItem();
    }
  }

  private bindPanelEvents(): void {
    const panel = this.overlayRef?.overlayElement;
    if (!panel) {
      return;
    }

    panel.addEventListener('click', this.closeIfMenuItemClick);
    panel.addEventListener('keydown', this.onPanelKeydown);
  }

  private readonly onPanelKeydown = (event: Event): void => {
    this.onOverlayKeydown(event as KeyboardEvent);
  };

  private readonly closeIfMenuItemClick = (event: Event): void => {
    const clickedElement = event.target as HTMLElement | null;
    if (!clickedElement) {
      return;
    }

    const menuItem = clickedElement.closest("[data-uc-menu-item='true']") as HTMLElement | null;
    if (!menuItem || menuItem.getAttribute('aria-disabled') === 'true') {
      return;
    }

    this.closeMenu();
  };

  private getFocusableItems(): HTMLElement[] {
    if (!this.overlayRef) {
      return [];
    }

    return Array.from(
      this.overlayRef.overlayElement.querySelectorAll<HTMLElement>("[data-uc-menu-item='true']")
    ).filter((item) => item.getAttribute('aria-disabled') !== 'true');
  }

  private focusMenuItem(which: 'first' | 'last'): void {
    const items = this.getFocusableItems();
    if (items.length === 0) {
      return;
    }

    const item = which === 'first' ? items[0] : items[items.length - 1];
    item.focus();
  }

  private focusNextItem(): void {
    const items = this.getFocusableItems();
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  }

  private focusPreviousItem(): void {
    const items = this.getFocusableItems();
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const previousIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    items[previousIndex].focus();
  }
}
