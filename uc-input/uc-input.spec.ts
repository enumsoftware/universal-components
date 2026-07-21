import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcInput } from './uc-input';

describe('UcInputComponent', () => {
	let component: UcInput;
	let fixture: ComponentFixture<UcInput>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UcInput],
		}).compileComponents();

		fixture = TestBed.createComponent(UcInput);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('id', 'input-1');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render label when provided and hideLabel is false', () => {
		fixture.componentRef.setInput('label', 'Email');
		fixture.detectChanges();

		const label = fixture.nativeElement.querySelector('label.uc-input-label');
		expect(label).toBeTruthy();
		expect(label.textContent).toContain('Email');
	});

	it('should hide label when hideLabel is true', () => {
		fixture.componentRef.setInput('label', 'Email');
		fixture.componentRef.setInput('hideLabel', true);
		fixture.detectChanges();

		const label = fixture.nativeElement.querySelector('label.uc-input-label');
		expect(label).toBeFalsy();
	});
});
