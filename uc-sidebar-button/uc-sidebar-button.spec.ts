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
});
