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
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
