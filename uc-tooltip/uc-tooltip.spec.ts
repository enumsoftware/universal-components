import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcTooltip } from './uc-tooltip';

@Component({
  imports: [UcTooltip],
  template: `<button [ucTooltip]="'Tooltip text'">Hover</button>`,
})
class TestHostComponent {}

describe('UcTooltip', () => {
  it('should create an instance', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
  });
});
