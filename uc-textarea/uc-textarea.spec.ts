import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTextarea } from './uc-textarea';

describe('UcTextarea', () => {
  let component: UcTextarea;
  let fixture: ComponentFixture<UcTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(UcTextarea);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'textarea-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
