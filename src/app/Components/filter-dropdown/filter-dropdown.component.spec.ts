import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('FilterDropdownComponent', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
