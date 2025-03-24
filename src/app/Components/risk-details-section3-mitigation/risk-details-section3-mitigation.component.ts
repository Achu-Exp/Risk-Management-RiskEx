import { filter } from 'rxjs';
import { Component, computed, effect, Input } from '@angular/core';
import { LikelihoodImpactCardComponent } from "../../UI/likelihood-impact-card/likelihood-impact-card.component";
import { PrivacySecurityRiskAssessment } from '../../Interfaces/RiskInterFaces.interface';
import { OverallRatingCardComponent } from '../../UI/overall-rating-card/overall-rating-card.component';
import { GlobalStateServiceService } from '../../Services/global-state-service.service';
import { Step } from '../../Interfaces/Stepper.interface';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-risk-details-section3-mitigation',
  standalone: true,
  imports: [LikelihoodImpactCardComponent,OverallRatingCardComponent],
  templateUrl: './risk-details-section3-mitigation.component.html',
  styleUrl: './risk-details-section3-mitigation.component.scss'
})
export class RiskDetailsSection3MitigationComponent {



  @Input() data:any={}

  riskAssessmentBefore:any=[]
  riskAssessmentAfter:any=[]
  overallRiskRatingBefore=0;
  overallRiskratingAfter=0;






  sharedData = computed(() => this.sharedDataService.data());
  approvalMessage: string = '';


  constructor(private sharedDataService: GlobalStateServiceService,private api:ApiService,private route:ActivatedRoute)
  {
    effect(() => {
      console.log(this.sharedData());
    });
  }


  ngOnInit(): void {
    const data = this.sharedData();
    if (data && data.approve) {
      this.approvalMessage = data.approve;
      console.log("approvalMsg:",this.approvalMessage);
      // Extract the message
    }

    setTimeout(()=>{
      this.riskAssessmentAfter=this.data.riskAssessments.filter((e:any)=>e.isMitigated)

      this.riskAssessmentBefore=this.data.riskAssessments.filter((e:any)=>!e.isMitigated)

      this.riskAssessmentBefore.forEach((e:any)=>{
        console.log(e.impactMatix.value)
      this.overallRiskRatingBefore += (e.impactMatix.value*e.likelihoodMatrix.value)
      })

      this.riskAssessmentAfter.forEach((e:any)=>{
        this.overallRiskratingAfter += (e.impactMatix.value*e.likelihoodMatrix.value)
    })
    },1000)





  }
}
