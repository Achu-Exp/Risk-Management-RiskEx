import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConformPopupComponent } from './form-conform-popup.component';

describe('FormConformPopupComponent', () => {
  let component: FormConformPopupComponent;
  let fixture: ComponentFixture<FormConformPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConformPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConformPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
