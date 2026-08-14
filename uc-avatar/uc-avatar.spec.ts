import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcAvatar } from './uc-avatar';

describe('UcAvatar', () => {
  let component: UcAvatar;
  let fixture: ComponentFixture<UcAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcAvatar],
    }).compileComponents();

    fixture = TestBed.createComponent(UcAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the default icon when no image or initials are provided', () => {
    const icon = fixture.nativeElement.querySelector('uc-phosphor-icon');

    expect(icon).toBeTruthy();
    expect(icon.querySelector('.ph-user')).toBeTruthy();
  });

  it('should show trimmed initials instead of the fallback icon', () => {
    fixture.componentRef.setInput('initials', '  JD  ');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.uc-avatar__initials').textContent).toBe('JD');
    expect(fixture.nativeElement.querySelector('uc-phosphor-icon')).toBeNull();
  });

  it('should show an image instead of initials', () => {
    fixture.componentRef.setInput('initials', 'JD');
    fixture.componentRef.setInput('imageUrl', '/avatar.jpg');
    fixture.componentRef.setInput('alt', 'Jane Doe');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.uc-avatar__image');
    expect(image.getAttribute('src')).toBe('/avatar.jpg');
    expect(image.getAttribute('alt')).toBe('Jane Doe');
    expect(fixture.nativeElement.querySelector('.uc-avatar__initials')).toBeNull();
  });

  it('should fall back to initials when the image fails to load', () => {
    fixture.componentRef.setInput('imageUrl', '/missing-avatar.jpg');
    fixture.componentRef.setInput('initials', 'JD');
    fixture.componentRef.setInput('alt', 'Jane Doe');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.uc-avatar__image').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.uc-avatar__image')).toBeNull();
    expect(fixture.nativeElement.querySelector('.uc-avatar__initials').textContent).toBe('JD');
    expect(fixture.nativeElement.querySelector('.uc-avatar').getAttribute('aria-label')).toBe('Jane Doe');
  });

  it('should apply the configured background color and size', () => {
    fixture.componentRef.setInput('backgroundColor', '#146c94');
    fixture.componentRef.setInput('size', '3rem');
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('.uc-avatar');
    expect(avatar.style.backgroundColor).toBe('rgb(20, 108, 148)');
    expect(avatar.style.getPropertyValue('--uc-avatar-size')).toBe('3rem');
  });
});