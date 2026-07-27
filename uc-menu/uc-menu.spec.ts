import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcMenu } from './uc-menu';
import { UcMenuItemComponent } from './uc-menu-item-component';
import { UcMenuItem } from './uc-menu-item';
import { UcMenuTriggerFor } from './uc-menu-trigger-for';

@Component({
  imports: [UcMenu, UcMenuItemComponent, UcMenuTriggerFor, UcMenuItem],
  template: `
    <button type="button" [ucMenuTriggerFor]="menu">Open menu</button>

    <uc-menu #menu="ucMenu">
      <uc-menu-item text="First item"></uc-menu-item>
      <uc-menu-item text="Second item"></uc-menu-item>
      <button type="button" ucMenuItem [ucMenuItemDisabled]="true" disabled>Disabled item</button>
    </uc-menu>
  `,
})
class TestHostComponent {}

describe('UcMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open the menu on trigger click', () => {
    const trigger = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const panel = overlayContainer.getContainerElement().querySelector('.uc-menu-panel');
    expect(panel).toBeTruthy();
  });

  it('should close the menu when a menu item is clicked', () => {
    const trigger = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const firstItem = overlayContainer
      .getContainerElement()
      .querySelector<HTMLElement>("[data-uc-menu-item='true']");

    expect(firstItem).toBeTruthy();
    firstItem?.click();
    fixture.detectChanges();

    const panel = overlayContainer.getContainerElement().querySelector('.uc-menu-panel');
    expect(panel).toBeNull();
  });

  it('should close the menu on Escape', () => {
    const trigger = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const panel = overlayContainer.getContainerElement().querySelector<HTMLElement>('.uc-menu-panel');
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    const closedPanel = overlayContainer.getContainerElement().querySelector('.uc-menu-panel');
    expect(closedPanel).toBeNull();
  });
});
