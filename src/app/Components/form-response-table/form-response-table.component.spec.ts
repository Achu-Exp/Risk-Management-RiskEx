import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResponseTableComponent } from './form-response-table.component';

describe('FormResponseTableComponent', () => {
  let component: FormResponseTableComponent;
  let fixture: ComponentFixture<FormResponseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResponseTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResponseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
