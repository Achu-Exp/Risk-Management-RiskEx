import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLikelihoodImpactTooltipComponent } from './form-likelihood-impact-tooltip.component';

describe('FormLikelihoodImpactTooltipComponent', () => {
  let component: FormLikelihoodImpactTooltipComponent;
  let fixture: ComponentFixture<FormLikelihoodImpactTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLikelihoodImpactTooltipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLikelihoodImpactTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
