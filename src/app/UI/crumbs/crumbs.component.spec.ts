import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrumbsComponent } from './crumbs.component';

describe('CrumbsComponent', () => {
  let component: CrumbsComponent;
  let fixture: ComponentFixture<CrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrumbsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});