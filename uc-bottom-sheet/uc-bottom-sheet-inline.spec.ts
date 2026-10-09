import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcBottomSheet, type UcBottomSheetSnapPoint } from './uc-bottom-sheet';

@Component({
  imports: [UcBottomSheet],
  template: `
    <div class="container" style="position: relative; height: 600px">
      <uc-bottom-sheet label="Bus lines" [snapPoints]="snapPoints" [snapLabels]="labels" [(snapIndex)]="index">
        <h2 ucBottomSheetHeader>Lines</h2>
        <button type="button" class="line">Line 1</button>
      </uc-bottom-sheet>
    </div>
  `,
})
class Host {
  snapPoints: UcBottomSheetSnapPoint[] = [80, '200px', '25rem'];
  labels = ['Collapsed', 'Half', 'Expanded'];
  readonly index = signal(0);
}

describe('UcBottomSheet', () => {
  let fixture: ComponentFixture<Host>;
  let host: HTMLElement;
  let handle: HTMLElement;
  let grab: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    host = fixture.nativeElement.querySelector('uc-bottom-sheet');
    handle = host.querySelector('[role="slider"]') as HTMLElement;
    grab = host.querySelector('.uc-bottom-sheet__grab') as HTMLElement;
  });

  function pointer(type: string, clientY: number, timeStamp?: number): void {
    const event = new MouseEvent(type, { bubbles: true, clientY, button: 0 });
    Object.defineProperty(event, 'pointerId', { value: 1 });
    if (timeStamp !== undefined) {
      Object.defineProperty(event, 'timeStamp', { value: timeStamp });
    }
    grab.dispatchEvent(event);
    fixture.detectChanges();
  }

  function key(name: string): void {
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('is a named region whose height is the current snap point', () => {
    expect(host.getAttribute('role')).toBe('region');
    expect(host.getAttribute('aria-label')).toBe('Bus lines');
    expect(host.style.height).toBe('80px');
  });

  it('resolves px and rem snap points', () => {
    fixture.componentInstance.index.set(1);
    fixture.detectChanges();
    expect(host.style.height).toBe('200px');

    fixture.componentInstance.index.set(2);
    fixture.detectChanges();
    expect(host.style.height).toBe(`${25 * parseFloat(getComputedStyle(document.documentElement).fontSize || '16')}px`);
  });

  it('exposes the handle as a vertical slider over the snap points', () => {
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-valuemax')).toBe('2');
    expect(handle.getAttribute('aria-valuenow')).toBe('0');
    expect(handle.getAttribute('aria-valuetext')).toBe('Collapsed');
  });

  it('moves between snap points with the keyboard and writes back the index', () => {
    key('ArrowUp');
    expect(fixture.componentInstance.index()).toBe(1);
    expect(handle.getAttribute('aria-valuetext')).toBe('Half');

    key('End');
    expect(fixture.componentInstance.index()).toBe(2);

    key('ArrowUp');
    expect(fixture.componentInstance.index()).toBe(2);

    key('Home');
    expect(fixture.componentInstance.index()).toBe(0);
  });

  it('steps up on a handle click and wraps to the lowest', () => {
    handle.click();
    handle.click();
    expect(fixture.componentInstance.index()).toBe(2);

    handle.click();
    expect(fixture.componentInstance.index()).toBe(0);
  });

  it('follows a drag and settles on the nearest snap point', () => {
    pointer('pointerdown', 500, 0);
    pointer('pointermove', 400, 1000);
    expect(host.style.height).toBe('180px');
    expect(host.classList).toContain('uc-bottom-sheet--dragging');

    pointer('pointerup', 400, 1000);
    expect(fixture.componentInstance.index()).toBe(1);
    expect(host.style.height).toBe('200px');
    expect(host.classList).not.toContain('uc-bottom-sheet--dragging');
  });

  it('goes to the next snap point on a flick, even from near the current one', () => {
    pointer('pointerdown', 500, 0);
    pointer('pointermove', 480, 10);
    pointer('pointerup', 480, 10);

    expect(fixture.componentInstance.index()).toBe(1);
  });

  it('treats a press without travel as a click, not a drag', () => {
    pointer('pointerdown', 500, 0);
    pointer('pointermove', 498, 10);
    pointer('pointerup', 498, 10);

    expect(host.classList).not.toContain('uc-bottom-sheet--dragging');
    expect(fixture.componentInstance.index()).toBe(0);
  });

  it('does not cycle the height on the click that ends a drag', () => {
    pointer('pointerdown', 500, 0);
    pointer('pointermove', 400, 1000);
    pointer('pointerup', 400, 1000);
    handle.click();

    expect(fixture.componentInstance.index()).toBe(1);
  });

  it('leaves focus alone: nothing is trapped and no backdrop is added', () => {
    expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
    expect(host.getAttribute('aria-modal')).toBeNull();
  });
});
