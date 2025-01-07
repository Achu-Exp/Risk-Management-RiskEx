import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QMSFormComponent } from "../../Components/qms-form/qms-form.component";
import { ISMSFormComponent } from "../../Components/isms-form/isms-form.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { Router } from '@angular/router';
import { EmailService } from '../../Services/email.service';



@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [BodyContainerComponent, QMSFormComponent, ISMSFormComponent,CommonModule,FormSuccessfullComponent],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss'
})
export class RegisterRiskComponent {
reviewer: any;
context:any;

constructor(private api:ApiService,public authService:AuthService,private cdRef: ChangeDetectorRef,public email:EmailService, private router:Router){}
receivedDepartmentIdForAdmin: number = 0;
bgColor:string=''
selectedRiskType: number = 1;
departmentName:string=''
departmentId:string='';
isAdmin:string=''
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataProject:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataAssignee:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
dropdownDataProjectForAdmin:any[]=[]
dropdownAssigneeForAdmin:any[]=[]
isSuccess:boolean=false
isError:boolean=false
riskId:number=0


ngOnInit(){
  this.departmentName =this.authService.getDepartmentName()!;

  this.departmentId=this.authService.getDepartmentId()!;

  this.isAdmin=this.authService.getUserRole()!;
  console.log(this.isAdmin);


  this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
    this.dropdownDataLikelihood=res;
  })

  this.api.getImpactDefinition().subscribe((res:any)=>{
    this.dropdownDataImpact=res
  })

  this.api.getProjects(this.departmentName).subscribe((res:any)=>{
    this.dropdownDataProject=res
  })

  this.api.getDepartment().subscribe((res:any)=>{
    this.dropdownDataDepartment=res
  })

  this.api.getAllReviewer().subscribe((res:any)=>{
    this.dropdownDataReviewer=res.reviewers
  })

  this.api.getAllUsersByDepartmentId(Number(this.departmentId)).subscribe((res:any)=>{
    this.dropdownDataAssignee=res
  })

}

riskTypes=[
 { "type": "Quality","value": 1 },
 { "type": "Security","value": 2 },
 { "type": "Privacy","value": 3 }
];

setRiskType(riskValue: number){
  this.selectedRiskType = riskValue;
}


onFormSubmit(payload: any) {
  console.log('Payload received from child:', payload);
  if (payload.riskType == 1) {
    this.api.addnewQualityRisk(payload).subscribe({
      next: (res: any) => {
        console.log('Risk saved successfully:', res);
        console.log('Generated Risk ID:', res.id);
        this.isSuccess=true
        this.riskId=res.id

        // Fetch reviewer details
        this.api.getRevieverDetails(res.id).subscribe({
          next: (r: any) => {
            this.reviewer = r[0].fullName;
            console.log('Reviewer Details:', this.reviewer);

             this.context = {
              responsibleUser: this.reviewer,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType === 1 ? 'Quality' : res.riskType === 2 ? 'Security' : 'Privacy',
              impact: res.impact,
              mitigation: res.mitigation,
              plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              overallRiskRating: res.overallRiskRatingBefore,
              id:res.id,
              rid:res.id
            };
            console.log('Email Context:', this.context);

            // Send email to reviewer
            this.email.sendReviewerEmail(r[0].email, this.context).subscribe({
              next: () => {
                console.log('Reviewer Email:', r[0].email);
                console.log('Email Sent Successfully.');
              },
              error: (emailError) => {
                console.error('Failed to send email to reviewer:', emailError);
              },
            });
          },
          error: (reviewerError) => {
            console.error('Failed to fetch reviewer details:', reviewerError);

          },
        });
      },
      error: (saveError) => {
        console.error('Failed to save risk:', saveError);
        this.isError=true
      },
    });


  }
  else if (payload.riskType == 2) {
    this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
      next: (res: any) => {
        console.log('Risk saved successfully:', res);
        console.log('Generated Risk ID:', res.id);
        this.isSuccess=true
        this.riskId=res.id

      },
      error: (saveError) => {
        console.error('Failed to save risk:', saveError);
        this.isError=true
      },
    });
  }
  else{
    this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
      next: (res: any) => {
        console.log('Risk saved successfully:', res);
        console.log('Generated Risk ID:', res.id);
        this.isSuccess=true
        this.riskId=res.id

      },
      error: (saveError) => {
        console.error('Failed to save risk:', saveError);
        this.isError=true
      },
    });
  }
}

getRiskTypeClass() {
  if (this.selectedRiskType === 1) {
    this.bgColor="var(--quality-color)"
    return 'risk-type-1';
  } else if (this.selectedRiskType === 2) {
    this.bgColor="var(--security-color)"
    return 'risk-type-2';
  } else if (this.selectedRiskType === 3) {
    this.bgColor="var(--privacy-color)"
    return 'risk-type-3';
  }
  return ''; // Default or no class
}

receiveValue(value: any) {
  this.receivedDepartmentIdForAdmin = value;
  console.log("this.receivedDepartmentIdForAdmin",this.receivedDepartmentIdForAdmin);
  const departmentData=this.dropdownDataDepartment.find(factor => Number(factor.id) === this.receivedDepartmentIdForAdmin);
  console.log(departmentData);

  const departmentName=departmentData.departmentName;
  console.log("department name from child",departmentName);

  this.api.getProjects(departmentName).subscribe((res:any)=>{
    this.dropdownDataProjectForAdmin=res
  },
(error:any)=>{
  this.dropdownDataProjectForAdmin=[]
})

this.api.getAllUsersByDepartmentId(Number(this.receivedDepartmentIdForAdmin)).subscribe((res:any)=>{
  this.dropdownAssigneeForAdmin=res

},
(error:any)=>{
  this.dropdownAssigneeForAdmin=[]

})


}
closeDialog() {
  this.isSuccess=false
  this.isError=false
  this.router.navigate(['/home']);
}
}
