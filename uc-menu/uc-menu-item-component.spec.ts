import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { UcMenuItemComponent } from './uc-menu-item-component';

describe('UcMenuItemComponent', () => {
  let fixture: ComponentFixture<UcMenuItemComponent>;
  let component: UcMenuItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UcMenuItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Profile');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text input', () => {
    const label = fixture.nativeElement.querySelector('.uc-menu-item-label');
    expect(label?.textContent?.trim()).toBe('Profile');
  });

  it('should emit selected when clicked', () => {
    const selectedSpy = vi.fn();
    component.selected.subscribe(selectedSpy);

    const host = fixture.nativeElement as HTMLElement;
    host.click();

    expect(selectedSpy).toHaveBeenCalled();
  });

  it('should not emit selected when disabled', () => {
    const selectedSpy = vi.fn();
    component.selected.subscribe(selectedSpy);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    host.click();

    expect(selectedSpy).not.toHaveBeenCalled();
  });
});
