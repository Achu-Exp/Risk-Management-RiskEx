import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RiskDetailsSection2Component } from './risk-details-section2.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { StepperComponent } from '../../UI/stepper/stepper.component';
import { of } from 'rxjs';

describe('RiskDetailsSection2Component', () => {
  let component: RiskDetailsSection2Component;
  let fixture: ComponentFixture<RiskDetailsSection2Component>;
  let apiService: jasmine.SpyObj<ApiService>;
  let mockParamMap: ParamMap;

  const mockReviewStatus = {
    actionBy: 'Test User',
    isReviewed: true,
    date: '2024-01-01'
  };

  const mockMitigationStatus = {
    actionBy: 'Mitigation User',
    isMitigated: true,
    date: '2024-01-02'
  };

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['getReviewSatus', 'getMitigationSatus']);
    mockParamMap = convertToParamMap({ id: '123' });

    // Setup spy return values
    apiService.getReviewSatus.and.returnValue(of(mockReviewStatus));
    apiService.getMitigationSatus.and.returnValue(of(mockMitigationStatus));

    await TestBed.configureTestingModule({
      imports: [RiskDetailsSection2Component, StepperComponent],
      providers: [
        { provide: ApiService, useValue: apiService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(mockParamMap)
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDetailsSection2Component);
    component = fixture.componentInstance;

    // Set input properties
    component.CreatedBy = 'Creator';
    component.CreatedAt = '2024-01-01';
    component.UpdatedBy = 'Updater';
    component.UpdatedAt = '2024-01-03';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stepperData with correct default values', () => {
    expect(component.stepperData.length).toBe(5);
    expect(component.stepperData[0].title).toBe('Open');
    expect(component.stepperData[1].title).toBe('review');
    expect(component.stepperData[2].title).toBe('Mitigation');
    expect(component.stepperData[3].title).toBe('Post Review');
    expect(component.stepperData[4].title).toBe('Closed');
  });

  it('should set created step details correctly on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.stepperData[0].actionBy).toBe('Creator');
    expect(component.stepperData[0].isCompleted).toBeTrue();
    expect(component.stepperData[0].date).toBe('2024-01-01');
  }));

  it('should handle review status API response correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(apiService.getReviewSatus).toHaveBeenCalledWith('123', true);
    expect(component.stepperData[1].actionBy).toBe(mockReviewStatus.actionBy);
    expect(component.stepperData[1].isCompleted).toBe(mockReviewStatus.isReviewed);
    expect(component.stepperData[1].date).toBe(mockReviewStatus.date);
  }));

  it('should handle post review status API response correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(apiService.getReviewSatus).toHaveBeenCalledWith('123', false);
    expect(component.stepperData[3].actionBy).toBe(mockReviewStatus.actionBy);
    expect(component.stepperData[3].isCompleted).toBe(mockReviewStatus.isReviewed);
    expect(component.stepperData[3].date).toBe(mockReviewStatus.date);
  }));

  it('should handle mitigation status API response correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(apiService.getMitigationSatus).toHaveBeenCalledWith('123');
    expect(component.stepperData[2].actionBy).toBe(mockMitigationStatus.actionBy);
    expect(component.stepperData[2].isCompleted).toBe(mockMitigationStatus.isMitigated);
    expect(component.stepperData[2].date).toBe(mockMitigationStatus.date);
  }));

  it('should handle closed status correctly', fakeAsync(() => {
    component.RiskStatus = 'closed';
    fixture.detectChanges();
    tick();

    expect(component.stepperData[4].actionBy).toBe('Updater');
    expect(component.stepperData[4].isCompleted).toBeTrue();
    expect(component.stepperData[4].date).toBe('2024-01-03');
  }));

  it('should not set closed status when RiskStatus is not closed', fakeAsync(() => {
    component.RiskStatus = 'open';
    fixture.detectChanges();
    tick();

    expect(component.stepperData[4].actionBy).toBe('...');
    expect(component.stepperData[4].isCompleted).toBeFalse();
  }));

  it('should complete step correctly', () => {
    component.completeStep(1);
    expect(component.stepperData[0].isCompleted).toBeTrue();
  });

  it('should handle non-existent step ID in completeStep', () => {
    component.completeStep(999);
    // Should not throw error and should not modify any steps
    expect(component.stepperData.every(step => !step.isCompleted)).toBeTrue();
  });

  // Test error handling
  it('should handle API errors gracefully', fakeAsync(() => {
    apiService.getReviewSatus.and.returnValue(of(Object));
    apiService.getMitigationSatus.and.returnValue(of(Object));

    fixture.detectChanges();
    tick();

    // Verify the component doesn't break with null responses
    expect(component.stepperData[1].actionBy).toBe('Tony');
    expect(component.stepperData[2].actionBy).toBe('Akshay');
  }));
});
