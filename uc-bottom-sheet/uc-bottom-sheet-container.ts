import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';

const EXITING_CLASS = 'uc-bottom-sheet-container--exiting';

/**
 * The surface a bottom sheet's content is rendered into. It is the CDK dialog container (focus trap, ARIA,
 * focus restore) plus the slide in and out, which the CDK does not animate.
 */
@Component({
  selector: 'uc-bottom-sheet-container',
  imports: [CdkPortalOutlet],
  template: '<ng-template cdkPortalOutlet />',
  styleUrl: './uc-bottom-sheet-container.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'uc-bottom-sheet-container',
  },
})
export class UcBottomSheetContainer extends CdkDialogContainer {
  /** Emits once the enter animation has finished. */
  readonly entered = new Subject<void>();

  private exitStarted = false;

  protected override _contentAttached(): void {
    super._contentAttached();
    this.afterAnimation(() => {
      this.entered.next();
      this.entered.complete();
    });
  }

  /** Plays the exit animation, then calls `done`. Calling it again while exiting does nothing. */
  exit(done: () => void): void {
    if (this.exitStarted) {
      return;
    }

    this.exitStarted = true;
    // Set the class directly rather than through a binding, so the computed style read below already sees it.
    this._elementRef.nativeElement.classList.add(EXITING_CLASS);
    this.afterAnimation(done);
  }

  /**
   * Runs `callback` when the host's current animation ends, or at once when there is none (reduced motion,
   * or an environment without CSS animations). A timer backs up `animationend`, which never fires for an
   * element that is hidden mid-animation.
   */
  private afterAnimation(callback: () => void): void {
    const host = this._elementRef.nativeElement;
    const view = this._document.defaultView;
    const style = view?.getComputedStyle(host);
    const duration = style ? longestDuration(style.animationDuration) : 0;

    if (!style || !style.animationName || style.animationName === 'none' || duration === 0) {
      callback();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) {
        return;
      }
      finished = true;
      clearTimeout(timer);
      host.removeEventListener('animationend', onEnd);
      callback();
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.target === host) {
        finish();
      }
    };
    const timer = setTimeout(finish, duration + 100);
    host.addEventListener('animationend', onEnd);
  }
}

/** Longest entry of a computed `animation-duration` list (`"0.25s"`, `"250ms, 0s"`), in milliseconds. */
function longestDuration(value: string): number {
  return Math.max(
    0,
    ...value.split(',').map((part) => {
      const parsed = parseFloat(part);
      if (Number.isNaN(parsed)) {
        return 0;
      }
      return part.trim().endsWith('ms') ? parsed : parsed * 1000;
    }),
  );
}
