import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectDropdownComponent } from './single-project-dropdown.component';

describe('SingleProjectDropdownComponent', () => {
  let component: SingleProjectDropdownComponent;
  let fixture: ComponentFixture<SingleProjectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleProjectDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProjectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
