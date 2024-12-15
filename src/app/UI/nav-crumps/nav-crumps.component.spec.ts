import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCrumpsComponent } from './nav-crumps.component';

describe('NavCrumpsComponent', () => {
  let component: NavCrumpsComponent;
  let fixture: ComponentFixture<NavCrumpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavCrumpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavCrumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
