import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSideNavigation } from './uc-side-navigation';

describe('Ucsidenavigation', () => {
  let component: UcSideNavigation;
  let fixture: ComponentFixture<UcSideNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSideNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(UcSideNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
