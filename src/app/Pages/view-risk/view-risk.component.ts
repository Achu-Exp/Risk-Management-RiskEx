import { Component } from '@angular/core';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { RiskDetailsSection3MitigationComponent } from '../../Components/risk-details-section3-mitigation/risk-details-section3-mitigation.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [
    RiskBasicDetailsCardComponent,
    BodyContainerComponent,
    RiskDetailsSection2Component,
    RiskDetailsSection3MitigationComponent,
    CommonModule
],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss',
})
export class ViewRiskComponent {
  data: any = [];
  basdicDetailsData:any={}
  riskDetailsSection2Data:any={}
  riskDetailsSection3MitigationData:any={}

  constructor(public api: ApiService, public route: ActivatedRoute) { }
  isLoading=true

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe((e) => {
      console.log('Data=', e);
      this.data = e;

      this.basdicDetailsData={
        riskNumber:this.data.riskNumber,
        riskType:this.data.riskType,
        riskDesc:this.data.riskDesc,
        riskName:this.data.riskName,
        overallRiskRating:this.data.overallRiskRating,
        riskStatus:this.data.riskStatus,
        isEditable:false,
        allData:this.data
      }

      this.riskDetailsSection2Data={
        riskMitigation:this.data.mitigation,
        riskContengency:this.data.contingency,
        responsibilityOfAction:this.data.responsibleUser.fullName        ,
        plannedActionDate:this.data.plannedActionDate,
        impact:this.data.impact,
        CreatedBy:this.data.createdBy.fullName,
        CreatedAt:this.data.createdAt,
        UpdatedBy:this.data.updatedBy.fullName,
        UpdatedAt:this.data.updatedAt,
        ReviewedBy:this.data.reviewedBy,
        ReviewedAt:this.data.reviewedAt,
        PostReviewedBy:this.data.postReviewedBy,
        PostReviewedAt:this.data.postReviewedAt,
        RiskStatus:this.data.riskStatus,
        ClosedDate:this.data.closedDate,
        RiskResponse:this.data.riskResponse,
        Remarks:this.data.remarks
      }

      this.riskDetailsSection3MitigationData={
        riskId:this.data.riskId,
        riskAssessments:this.data.riskAssessments,
        status:this.data.riskStatus,
        type:this.data.riskType,
        residualRisk:this.data.residualRisk,
        residualValue:this.data.residualValue,
        percentageReduction:this.data.percentageRedution,
        overallRiskRatingBefore:this.data.overalRiskRatingBefore,
        overallRiskRatingAfter:this.data.overallRiskRatingAfter

      }


      this.isLoading=false
    });
  }
}
