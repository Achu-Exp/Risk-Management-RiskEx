import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { QmsEditComponent } from '../../Components/qms-edit/qms-edit.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { IsmsEditComponent } from '../../Components/isms-edit/isms-edit.component';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [BodyContainerComponent,QmsEditComponent,IsmsEditComponent,CommonModule,FormSuccessfullComponent ],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent {
  riskData:any={}
  riskType:string='Quality'
  riskId:number=0


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
isSuccess:boolean=false
isError:boolean=false

constructor(private api:ApiService,public authService:AuthService,private router: Router){}

  ngOnInit(){

    this.riskData = history.state.riskData;
    this.riskId=this.riskData.id
    this.riskType=this.riskData.riskType
    if(this.riskType=='Quality'){
      this.selectedRiskType=1
    }
    if(this.riskType=='Security'){
      this.selectedRiskType=2
    }
    if(this.riskType=='Privacy'){
      this.selectedRiskType=3
    }

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

  this.api.getAllUsersByDepartmentName((this.departmentName)).subscribe((res:any)=>{
    this.dropdownDataAssignee=res
    console.log("departments",res)
  })




  }


  getRiskTypeClass() {
    if (this.riskType === 'Quality') {
      this.bgColor="var(--quality-color)"
      return 'risk-type-1';
    } else if (this.riskType === 'Security') {
      this.bgColor="var(--security-color)"
      return 'risk-type-2';
    } else if (this.riskType === 'Privacy') {
      this.bgColor="var(--privacy-color)"

    }
    return ''; // Default or no class
  }


  onFormSubmit(payload: any) {
    if (payload.riskType == 1) {
      this.api.editQualityRisk(Number(this.riskId),payload).subscribe((res:any)=>{
        console.log(res);
        this.isSuccess=true
      },
    (error:any)=>{
      this.isError=true
    })
    }
    if(payload.riskType==2){
      this.api.editSecurityOrPrivacyRisk(Number(this.riskId),payload).subscribe((res:any)=>{
        console.log(res);
        this.isSuccess=true
      },
    (error:any)=>{
      this.isError=true
    })
    }
    else{
      this.api.editSecurityOrPrivacyRisk(Number(this.riskId),payload).subscribe((res:any)=>{
        console.log(res);
        this.isSuccess=true
      },
    (error:any)=>{
      this.isError=true
    })
    }
  }
  closeDialog() {
    this.isSuccess=false
    this.isError=false
    this.router.navigate(['/home']);
  }
}
