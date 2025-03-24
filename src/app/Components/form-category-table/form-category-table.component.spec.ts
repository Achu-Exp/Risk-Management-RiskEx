import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoryTableComponent } from './form-category-table.component';

describe('FormCategoryTableComponent', () => {
  let component: FormCategoryTableComponent;
  let fixture: ComponentFixture<FormCategoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
