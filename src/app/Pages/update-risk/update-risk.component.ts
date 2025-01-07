import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { UpdateQmsComponent } from "../../Components/update-qms/update-qms.component";
import { UpdateIsmsComponent } from "../../Components/update-isms/update-isms.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';


@Component({
  selector: 'app-update-risk',
  standalone: true,
  imports: [BodyContainerComponent, UpdateQmsComponent, UpdateIsmsComponent,CommonModule,FormSuccessfullComponent],
  templateUrl: './update-risk.component.html',
  styleUrl: './update-risk.component.scss'
})
export class UpdateRiskComponent {
bgColor:string=''
riskId: string='';
riskType: string='';
riskTypeId:number=0
overallRiskRatingBefore:number=0
departmentName:string=''
departmentId:string='';
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
isSuccess:boolean=false
isError:boolean=false
error:string=''

constructor(private route: ActivatedRoute,private api:ApiService,private router: Router) {}

ngOnInit(){
  this.route.queryParams.subscribe(params =>{
    this.riskId = params['riskId'];
    this.riskType = params['riskType'];
    this.overallRiskRatingBefore = params['overallRiskRatingBefore'];
  });

  this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
    this.dropdownDataLikelihood=res;
  })

  this.api.getImpactDefinition().subscribe((res:any)=>{
    this.dropdownDataImpact=res
  })

  this.api.getAllReviewer().subscribe((res:any)=>{
    this.dropdownDataReviewer=res.reviewers
  })

  this.api.getRiskResponses().subscribe((res:any)=>{
    this.riskResponses=res
  })
  this.api.getDepartment().subscribe((res:any)=>{
    this.dropdownDataDepartment=res
  })

}

onFormSubmit(event: { payload: any, riskType: number }) {
  const payload = event.payload;
  const riskType = event.riskType;

  if (riskType == 1) {
    this.api.updateQualityRisk(payload,Number(this.riskId)).subscribe((res:any)=>{
      console.log("updated quality api response:",res)
      this.isSuccess=true
    },
  (error:any)=>{
    this.isError=true
    this.error=error.message
  })
  }
  else if (riskType == 2) {
    this.api.updateSecurityOrPrivacyRisk(payload,Number(this.riskId)).subscribe((res:any)=>{
      console.log("updated security api response:",res)
      this.isSuccess=true
    },
  (error:any)=>{
    this.isError=true
  })
  }
  else{
    this.api.updateSecurityOrPrivacyRisk(payload,Number(this.riskId)).subscribe((res:any)=>{
      console.log("updated privacy api response:",res)
      this.isSuccess=true
    },
  (error:any)=>{
    this.isError=true
  })
  }

}

getRiskTypeClass() {
  if (this.riskType === 'Quality') {
    this.riskTypeId=1
    this.bgColor="var(--quality-color)"
    return 'risk-type-1';
  } else if (this.riskType === 'Security') {
    this.riskTypeId=2
    this.bgColor="var(--security-color)"
    return 'risk-type-2';
  } else if (this.riskType === 'Privacy') {
    this.riskTypeId=3
    this.bgColor="var(--privacy-color)"

  }
  return ''; // Default or no class
}

closeDialog() {
  this.isSuccess=false
  this.isError=false
  this.router.navigate(['/home']);
}
}
