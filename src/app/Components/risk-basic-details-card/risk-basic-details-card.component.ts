import { ChangeDetectorRef, Component, Input, input } from '@angular/core';
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";
import { RiskStatusCardComponent } from "../../UI/risk-status-card/risk-status-card.component";
import { EditButtonComponent } from "../../UI/edit-button/edit-button.component";
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpdateButtonComponent } from "../../UI/update-button/update-button.component";
import { AuthService } from '../../Services/auth/auth.service';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-risk-basic-details-card',
  standalone: true,
  imports: [OverallRatingCardComponent, RiskStatusCardComponent, EditButtonComponent, CommonModule, UpdateButtonComponent],
  templateUrl: './risk-basic-details-card.component.html',
  styleUrl: './risk-basic-details-card.component.scss'
})
export class RiskBasicDetailsCardComponent {

  constructor(public router :Router,public authService:AuthService,public api:ApiService,private cdr: ChangeDetectorRef)
  {

  }

  color='red';

  ngOnInit()
  {
    this.api.getReviewSatus(this.allData.id,false).subscribe((e)=>{

      this.postReviewstatus=e
      console.log("review statushhhhhhh",e);
      this.cdr.detectChanges()
    })

    this.api.getReviewSatus(this.allData.id,true).subscribe((e)=>{

      this.preReviewstatus=e
      console.log("review statushhhhhhh",e);
      this.cdr.detectChanges()
    })
  }


  @Input() isEditable=true;
  @Input() allData:any={
    "id": null,
    "riskId": " ",
    "riskName": " ",
    "description": " ",
    "impact": " ",
    "mitigation": " ",
    "contingency": " ",
    "overallRiskRating": null,
    "plannedActionDate": " ",
    "remarks": " ",
    "riskStatus": "",
    "riskType": " ",
    "riskResponse": " ",
    "riskAssessments": [],
    "responsibleUser": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "department": {
      "id": null,
      "name": "",
      "departmentCode": null
    },
    "project": null,
    "residualValue": null,
    "percentageRedution": null,
    "residualRisk": "",
    "createdBy": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "createdAt": "",
    "updatedBy": {
      "id": null,
      "fullName": "",
      "email": ""
    },
    "updatedAt": "",
    "closedDate": ""
  }


  @Input() preReviewstatus:any=null
  @Input() postReviewstatus:any=null






  onEditButtonClicked()
  {
    console.log("id",this.allData.id);

    this.router.navigate([`edit`], { state: { riskData: this.allData } }) //         /ViewRisk/${this.allData.id}/
  }

  onUpdateButtonCLick()
  {
    console.log("id",this.allData.id);

    this.router.navigate(['update'], { queryParams: {riskId:this.allData.id ,riskType:this.allData.riskType,overallRiskRatingBefore:this.allData.overallRiskRating} }); //         /ViewRisk/${this.allData.id}
  }

}
