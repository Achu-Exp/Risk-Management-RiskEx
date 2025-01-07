import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormRiskResponseComponent } from '../form-risk-response/form-risk-response.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { ApiService } from '../../Services/api.service';
import { FormButtonComponent } from '../../UI/form-button/form-button.component';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';


@Component({
  selector: 'app-update-qms',
  standalone: true,
  imports: [DropdownComponent,FormsModule,CommonModule,FormDropdownComponent,FormDateFieldComponent,FormRiskResponseComponent,ReactiveFormsModule,FormTextAreaComponent,FormDataNotInListComponent,FormButtonComponent,FormSuccessfullComponent,FormReferenceHeatmapPopupComponent],
  templateUrl: './update-qms.component.html',
  styleUrl: './update-qms.component.scss'
})
export class UpdateQmsComponent {
// @Input() riskTypeValue: string=''
// result: number = 0;
// reviewerNotInList:boolean=false
// assigneeNotInList:boolean=false
// isAdmin:string='admin'
// likelihoodValue:number=0
// impactValue:number=0
// riskFactor:number=0
// selectedResponse: string = '';
// departmentName:string=''
// departmentId:string='';
// dropdownDataLikelihood: any[] = []
// dropdownDataImpact:any[]=[]
// dropdownDataProject:any[]=[]
// dropdownDataDepartment:any[]=[]
// dropdownDataassignee:any[]=[]
// dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
// // riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
// riskResponses:any[]=[]



// autoResize(event: Event): void {
//   const textarea = event.target as HTMLTextAreaElement;
//   const minHeight = 40;
//   textarea.style.height = 'auto';
//   textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
// }

// isReviewerNotInList(){
//   this.reviewerNotInList=!this.reviewerNotInList
// }

// isAssigneeNotInList(){
//   this.assigneeNotInList=!this.assigneeNotInList
// }

// onDropdownChangelikelihood(event: any): void {
//   const selectedFactorId = Number(event.target.value);
//   const selectedFactor = this.dropdownDataLikelihood.find(factor => Number(factor.id) === selectedFactorId);
//   if (selectedFactor) {
//     this.likelihoodValue = selectedFactor.likelihood;
//     console.log('Selected Likelihood:', this.likelihoodValue);
//   } else {
//     console.log('Selected factor not found.');
//   }
//  this.calculateOverallRiskRating();
// }

// onDropdownChangeImpact(event: any): void {
//  const selectedFactorId = Number(event.target.value);
//  const selectedFactor = this.dropdownDataImpact.find(factor => Number(factor.id) === selectedFactorId);
//  if (selectedFactor) {
//   this.impactValue = selectedFactor.impact;
//   console.log('Selected Impact:',this.impactValue);
//  }else {
//   console.log('Selected factor not found.');
//  }
//   this.calculateOverallRiskRating();
// }

// calculateOverallRiskRating(){
//   if(this.likelihoodValue !=0 && this.impactValue !=0){
//     this.result=this.likelihoodValue * this.impactValue
//   }
//   this.riskFactor=this.result
// }

// changeColorOverallRiskRating(){
//   if(this.result<30){
//     return '#6DA34D';
//   }
//   if(this.result>31 && this.result<99){
//     return '#FFC107'
//   }
//   else{
//     return '#D9534F'
//   }
// }

// constructor(private api:ApiService,public authService:AuthService){}

// ngOnInit(){

//   console.log('selecetd risk type value',this.riskTypeValue);
//   this.departmentName =this.authService.getDepartmentName()!;
//   console.log('department Name',this.departmentName);
//   this.departmentId=this.authService.getDepartmentId()!;
//   console.log('department id',this.departmentId)
//   this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
//     this.dropdownDataLikelihood=res;
//   })
//   this.api.getImpactDefinition().subscribe((res:any)=>{
//     this.dropdownDataImpact=res
//   })
//   this.api.getProjects(this.departmentName).subscribe((res:any)=>{
//     this.dropdownDataProject=res
//   })
//   this.api.getDepartment().subscribe((res:any)=>{
//     this.dropdownDataDepartment=res
//   })
//   this.api.getAllReviewer().subscribe((res:any)=>{
//     this.dropdownDataReviewer=res.reviewers
//   })
//   this.api.getAllUsersByDepartmentName(this.departmentName).subscribe((res:any)=>{
//     this.dropdownDataassignee=res
//   })
//   this.api.getRiskResponses().subscribe((res:any)=>{
//     this.riskResponses=res
//     console.log(this.riskResponses)

//   })


// }
@Output() submitForm = new EventEmitter<any>();
@Input() overallRiskRatingBefore:number=0
@Input() dropdownLikelihood: any[] = []
@Input() dropdownImpact:any[]=[]
@Input() dropdownDepartment:any[]=[]
@Input() dropdownReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
@Input() riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
@Input() bgColor:any
@Input() riskTypeId:number=0
overallRiskRating: number = 0;
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0
likelihoodId:number=0
impactId:number=0
riskResponseValue:number=0
reviewerNotInList:boolean=false
internalReviewerIdFromDropdown:number=0
externalReviewerIdFromDropdown:number=0
isInternal:boolean=true
externalReviewerIdFromInput:number=0
residualValue:number=0
percentageRedution:number=0
residualRisk:number=0

isSuccessReviewer:boolean=false
isErrorReviewer:boolean=false
HeatMapRefernce:boolean=false
error:string=''


constructor(private el: ElementRef, private renderer: Renderer2,private api:ApiService){}



ngOnInit(){
  console.log("risktypeid is",this.riskTypeId);
  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);

}
isReviewerNotInList(){
  this.reviewerNotInList=!this.reviewerNotInList
}
isHeatMapReference(){
  this.HeatMapRefernce=!this.HeatMapRefernce
}


onDropdownChangelikelihood(event: any): void {
  const selectedFactorId = Number(event);
  console.log(selectedFactorId);
  this.likelihoodId=selectedFactorId

  const selectedFactor = this.dropdownLikelihood.find(factor => Number(factor.id) === selectedFactorId);
  if (selectedFactor) {
    this.likelihoodValue = selectedFactor.likelihood;
    console.log('Selected Likelihood:', this.likelihoodValue);
  } else {
    console.log('Selected factor not found.');
  }
this.calculateOverallRiskRating();
}

onDropdownChangeImpact(event: any): void {
const selectedFactorId = Number(event);
this.impactId=selectedFactorId
const selectedFactor = this.dropdownImpact.find(factor => Number(factor.id) === selectedFactorId);
if (selectedFactor) {
  this.impactValue = selectedFactor.impact;
  console.log('Selected Impact:',this.impactValue);
}else {
  console.log('Selected factor not found.');
}
  this.calculateOverallRiskRating();
}

calculateOverallRiskRating(){
  if(this.likelihoodValue !=0 && this.impactValue !=0){
    this.overallRiskRating=this.likelihoodValue * this.impactValue
    this.residualValue=this.overallRiskRatingBefore-this.overallRiskRating
    this.percentageRedution=(this.residualValue/this.overallRiskRatingBefore)*100
    if(this.percentageRedution>60){
      this.residualRisk=1;

    }else if(this.percentageRedution>=40){
      this.residualRisk=2;
    }
    else{
      this.residualRisk=3;
    }


  }
  this.riskFactor=this.overallRiskRating



}

changeColorOverallRiskRating(){
  if(this.overallRiskRating<8){
    return '#6DA34D';
  }
  if(this.overallRiskRating>10 && this.overallRiskRating<32){
    return '#FFC107'
  }
  else{
    return '#D9534F'
  }
}


onRadioSelectionChange(value: any) {
  this.riskResponseValue = value;
  console.log('Selected value from child:', value);
}

onDropdownChangeReviewer(selectedReviewer: any) {
  const selectedreviewer = selectedReviewer;
  console.log("selected factor id is ",selectedreviewer);

  const selectedFactor = this.dropdownReviewer.find(factor => factor.fullName === selectedreviewer);
  console.log("selected factor is ",selectedFactor)
  if(selectedFactor){

    if (selectedFactor.type ==="Internal") {
      this.isInternal=true
      this.internalReviewerIdFromDropdown = selectedFactor.id;
      console.log("Selected internal reviewer ID:", this.internalReviewerIdFromDropdown);

      console.log("this is a internal reviewer",this.isInternal);

    } else if (selectedFactor.type ==="External") {
    this.isInternal=false
    this.externalReviewerIdFromDropdown = selectedFactor.id;
    console.log("Selected external reviewer ID:", this.externalReviewerIdFromDropdown);
    console.log("this is a internal reviewer",this.isInternal);
    }
  }

  else {
    console.error("No matching reviewer found for the selected ID.");
  }
}

updateQmsForm=new FormGroup({
  closeDate:new FormControl(''),
  remarks:new FormControl('')
})

onSubmit(){
  const formValue = this.updateQmsForm.value;
  console.log(formValue);

  const payload={
    closedDate: `${formValue.closeDate}T00:00:00.000Z`,
  riskResponseId: this.riskResponseValue,
  riskStatus: 2,
  overallRiskRatingAfter:this.overallRiskRating,
  percentageRedution:this.percentageRedution,
  residualRisk: this.residualRisk,
  residualValue: this.residualValue,
  remarks: formValue.remarks,
  riskAssessments: [
    {
      likelihood: this.likelihoodId,
      impact: this.impactId,
      isMitigated: true,
      assessmentBasisId: null,
      riskFactor: this.riskFactor,
      review: {
        userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
        externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
        comments: "",
        reviewStatus: 3
      }
    }
  ]
  }

  console.log(payload);
  this.submitForm.emit({ payload, riskType: this.riskTypeId });


}
receiveCancel(value: any) {
  if(value==false){
    this.isReviewerNotInList();
  }
}

saveReviewer(value: any){

  const departmentNameDetails=this.dropdownDepartment.find(factor => factor.id === value.departmentId)
  const departmentName= departmentNameDetails.departmentName

  const payload = {
    email:value.email,
    fullName:value.fullName,
    departmentId:value.departmentId
  }
 this.api.addExternalReviewer(payload).subscribe((res:any)=>{
    this.externalReviewerIdFromInput = res.reviewerId
    console.log("reviewer response",this.externalReviewerIdFromInput);
    this.isSuccessReviewer=true

  },
  (error:any)=>{
    this.isErrorReviewer=true

  }
)

}



closeReviewer() {
  this.isSuccessReviewer=false
  this.isErrorReviewer=false

}
closeHeatMap(){
  this.HeatMapRefernce=false
}

saveConfirmation(){}
clearAllData(){}
cancelRisk(){}
saveAsDraft(){}
}
