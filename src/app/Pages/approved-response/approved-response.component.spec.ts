import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouComponent } from './approved-response.component';

describe('ThankyouComponent', () => {
  let component: ThankyouComponent;
  let fixture: ComponentFixture<ThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankyouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
