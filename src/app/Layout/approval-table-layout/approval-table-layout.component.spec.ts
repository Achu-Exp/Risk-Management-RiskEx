import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableLayoutComponent } from './approval-table-layout.component';

describe('ApprovalTableLayoutComponent', () => {
  let component: ApprovalTableLayoutComponent;
  let fixture: ComponentFixture<ApprovalTableLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTableLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
