import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RiskDetailsSection3MitigationComponent } from './risk-details-section3-mitigation.component';
import { GlobalStateServiceService } from '../../Services/global-state-service.service';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { LikelihoodImpactCardComponent } from '../../UI/likelihood-impact-card/likelihood-impact-card.component';
import { OverallRatingCardComponent } from '../../UI/overall-rating-card/overall-rating-card.component';
import { signal } from '@angular/core';

describe('RiskDetailsSection3MitigationComponent', () => {
  let component: RiskDetailsSection3MitigationComponent;
  let fixture: ComponentFixture<RiskDetailsSection3MitigationComponent>;
  let globalStateService: jasmine.SpyObj<GlobalStateServiceService>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockRiskAssessments = [
    {
      isMitigated: true,
      impactMatix: { value: 3 },
      likelihoodMatrix: { value: 2 }
    },
    {
      isMitigated: false,
      impactMatix: { value: 4 },
      likelihoodMatrix: { value: 3 }
    }
  ];

  beforeEach(async () => {
    const globalStateServiceSpy = jasmine.createSpyObj('GlobalStateServiceService', ['data']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['someMethod']);

    globalStateServiceSpy.data = signal({ approve: 'Test approval message' });

    await TestBed.configureTestingModule({
      imports: [
        RiskDetailsSection3MitigationComponent,
        LikelihoodImpactCardComponent,
        OverallRatingCardComponent
      ],
      providers: [
        { provide: GlobalStateServiceService, useValue: globalStateServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    globalStateService = TestBed.inject(GlobalStateServiceService) as jasmine.SpyObj<GlobalStateServiceService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDetailsSection3MitigationComponent);
    component = fixture.componentInstance;
    component.riskAssessments = mockRiskAssessments;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('');
    expect(component.type).toBe('');
    expect(component.riskId).toBe('');
    expect(component.status).toBe('');
    expect(component.residualRisk).toBe('');
    expect(component.residualValue).toBe('');
    expect(component.percentageReducation).toBe('');
  });

  it('should set approval message from shared data service', () => {
    expect(component.approvalMessage).toBe('Test approval message');
  });

  it('should filter risk assessments correctly after timeout', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);

    expect(component.riskAssessmentAfter.length).toBe(1);
    expect(component.riskAssessmentBefore.length).toBe(1);

    // Verify filtered arrays contain correct items
    expect(component.riskAssessmentAfter[0].isMitigated).toBeTrue();
    expect(component.riskAssessmentBefore[0].isMitigated).toBeFalse();
  }));

  it('should calculate overall risk ratings correctly', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);

    // For before: 4 * 3 = 12
    expect(component.overallRiskRatingBefore).toBe(12);

    // For after: 3 * 2 = 6
    expect(component.overallRiskratingAfter).toBe(6);
  }));

  it('should handle empty risk assessments array', fakeAsync(() => {
    component.riskAssessments = [];
    component.ngOnInit();
    tick(1000);

    expect(component.riskAssessmentAfter.length).toBe(0);
    expect(component.riskAssessmentBefore.length).toBe(0);
    expect(component.overallRiskRatingBefore).toBe(0);
    expect(component.overallRiskratingAfter).toBe(0);
  }));

  // Test @Input properties
  it('should properly set input properties', () => {
    component.title = 'Test Title';
    component.type = 'Test Type';
    component.riskId = '123';
    component.status = 'Active';
    component.residualRisk = 'Low';
    component.residualValue = '5';
    component.percentageReducation = '50';

    expect(component.title).toBe('Test Title');
    expect(component.type).toBe('Test Type');
    expect(component.riskId).toBe('123');
    expect(component.status).toBe('Active');
    expect(component.residualRisk).toBe('Low');
    expect(component.residualValue).toBe('5');
    expect(component.percentageReducation).toBe('50');
  });
});
