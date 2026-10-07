import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcSidebarButton } from './uc-sidebar-button';

describe('UcSidebarButton', () => {
  let component: UcSidebarButton;
  let fixture: ComponentFixture<UcSidebarButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSidebarButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcSidebarButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Dashboard');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should announce the active entry as the current page', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-current')).toBeNull();
    expect(button.type).toBe('button');

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-current')).toBe('page');
  });
});
