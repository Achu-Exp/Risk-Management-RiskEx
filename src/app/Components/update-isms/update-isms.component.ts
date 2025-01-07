import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormRiskResponseComponent } from '../form-risk-response/form-risk-response.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { FormButtonComponent } from '../../UI/form-button/form-button.component';
import { ApiService } from '../../Services/api.service';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';

@Component({
  selector: 'app-update-isms',
  standalone: true,
  imports: [DropdownComponent,CommonModule,FormsModule,FormDropdownComponent,FormDateFieldComponent,FormRiskResponseComponent,ReactiveFormsModule,FormTextAreaComponent,FormDataNotInListComponent,FormButtonComponent,FormSuccessfullComponent,FormReferenceHeatmapPopupComponent],
  templateUrl: './update-isms.component.html',
  styleUrl: './update-isms.component.scss'
})
export class UpdateIsmsComponent {
// @Input() riskTypeValue: string=''
// result: number = 0;
// reviewerNotInList:boolean=false
// assigneeNotInList:boolean=false
// isAdmin:string='admin'
// likelihoodValue:number=0
// impactValue:number=0
// riskFactor:number=0
// selectedResponse: string = '';

// confidentialityRiskFactor:number=0
// integrityRiskFactor:number=0
// availabilityRiskFactor:number=0
// privacyRiskFactor:number=0
// confidentialityLikelihoodValue:number=0
// confidentialityImpactValue:number=0
// integrityLikelihoodValue:number=0
// integrityImpactValue:number=0
// availabilityLikelihoodValue:number=0
// availabilityImpactValue:number=0
// privacyLikelihoodValue:number=0
// privacyImpactValue:number=0
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



  // dropdownDataLikelihood=[
  //   { "type":"Select Likelihood","value":""},
  //   {"type":"Low","value":"0.1"},
  //   {"type":"Medium","value":"0.2"},
  //   { "type":"High","value":"0.4"},
  //   { "type":"Critical","value":"0.6"}
  // ];

  // dropdownDataImpact=[
  //   { "type":"select Impact","value":""},
  //   {"type":"Low","value":"10"},
  //   {"type":"Medium","value":"20"},
  //   { "type":"High","value":"40"},
  //   { "type":"Critical","value":"80"}
  // ];

  // dropdownDataReviewer=[
  //   {"name":"Select--","email":""},
  //   {"name":"Achu s nair","email":"123"},
  //   {"name":"Shamna Sherin","email":"123"},
  //   {"name":"Deepak Denny","email":"123"},
  //   { "name":"Bindhya C Philip","email":"123"},
  //   { "name":"Vivek V N","email":"123"},
  // ];

  // dropdownDataProject=[
  //   {"name":"Select--","id":""},
  //   {"name":"japanese training","id":"p12-34"},
  //   {"name":"risk management","id":"p-34-56"},
  //   {"name":"pit-stop","id":"p34-54"},
  //   { "name":"query management","id":"p01-01"},
  //   { "name":"HR inventory","id":"p03-3"},
  // ];

  // dropdownDataDepartment=[
  //   {"name":"Select--","id":""},
  //   {"name":"SFM","id":"1"},
  //   {"name":"ACE","id":"2"},
  //   {"name":"HR","id":"3"},
  //   { "name":"L&D","id":"4"},
  //   { "name":"DU1","id":"5"},
  // ];

  // riskResponses = [
  // { id: 1, label: "Avoid" },
  // { id: 2, label: "Mitigate" },
  // { id: 3, label: "Transfer" },
  // { id: 4, label: "Accept" }
  // ];

//   autoResize(event: Event): void {
//     const textarea = event.target as HTMLTextAreaElement;
//     const minHeight = 40;
//     textarea.style.height = 'auto';
//     textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
//   }

//   isReviewerNotInList(){
//     this.reviewerNotInList=!this.reviewerNotInList
//   }

//   isAssigneeNotInList(){
//     this.assigneeNotInList=!this.assigneeNotInList
//   }


// onDropdownChange(event: any, type: string, category: string): void {
//   const selectedFactorId = Number(event.target.value);
//  const selectedFactorImpact = this.dropdownDataImpact.find(factor => Number(factor.id) === selectedFactorId);
//  const selectedFactorLikelihood = this.dropdownDataLikelihood.find(factor => Number(factor.id) === selectedFactorId);

//   switch (category) {
//     case 'Confidentiality':
//       if (type === 'Likelihood') {
//         this.confidentialityLikelihoodValue = selectedFactorLikelihood.likelihood;
//       } else if (type === 'Impact') {
//         this.confidentialityImpactValue = selectedFactorImpact.impact;
//       }
//       this.calculateRiskFactor('Confidentiality');
//       break;

//     case 'Integrity':
//       if (type === 'Likelihood') {
//         this.integrityLikelihoodValue = selectedFactorLikelihood.likelihood;
//       } else if (type === 'Impact') {
//         this.integrityImpactValue = selectedFactorImpact.impact;
//       }
//       this.calculateRiskFactor('Integrity');
//       break;

//     case 'Availability':
//       if (type === 'Likelihood') {
//         this.availabilityLikelihoodValue = selectedFactorLikelihood.likelihood;
//       } else if (type === 'Impact') {
//         this.availabilityImpactValue = selectedFactorImpact.impact;
//       }
//       this.calculateRiskFactor('Availability');
//       break;

//     case 'Privacy':
//       if (type === 'Likelihood') {
//         this.privacyLikelihoodValue = selectedFactorLikelihood.likelihood;
//       } else if (type === 'Impact') {
//         this.privacyImpactValue = selectedFactorImpact.impact;
//       }
//       this.calculateRiskFactor('Privacy');
//       break;
//   }
// }

// calculateRiskFactor(category: string): void {
//   switch (category) {
//     case 'Confidentiality':
//       this.confidentialityRiskFactor = this.confidentialityLikelihoodValue * this.confidentialityImpactValue;
//       break;

//     case 'Integrity':
//       this.integrityRiskFactor = this.integrityLikelihoodValue * this.integrityImpactValue;
//       break;

//     case 'Availability':
//       this.availabilityRiskFactor = this.availabilityLikelihoodValue * this.availabilityImpactValue;
//       break;

//     case 'Privacy':
//       this.privacyRiskFactor = this.privacyLikelihoodValue * this.privacyImpactValue;
//       break;
//   }
//   if(this.confidentialityRiskFactor !=0 && this.integrityRiskFactor !=0 && this.availabilityRiskFactor !=0 && this.privacyRiskFactor !=0){

//     this.result= this.confidentialityRiskFactor + this.integrityRiskFactor + this.availabilityRiskFactor + this.privacyRiskFactor
//   }
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
riskResponseValue:number=0
reviewerNotInList:boolean=false
internalReviewerIdFromDropdown:number=0
externalReviewerIdFromDropdown:number=0
isInternal:boolean=true
externalReviewerIdFromInput:number=0
residualValue:number=0
percentageRedution:number=0
residualRisk:number=0
confidentialityRiskFactor:number=0
integrityRiskFactor:number=0
availabilityRiskFactor:number=0
privacyRiskFactor:number=0
confidentialityLikelihoodValue:number=0
confidentialityImpactValue:number=0
integrityLikelihoodValue:number=0
integrityImpactValue:number=0
availabilityLikelihoodValue:number=0
availabilityImpactValue:number=0
privacyLikelihoodValue:number=0
privacyImpactValue:number=0
confidentialityLikelihoodId:number=0
confidentialityImpactId:number=0
integrityLikelihoodId:number=0
integrityImpactId:number=0
availabilityLikelihoodId:number=0
availabilityImpactId:number=0
privacyLikelihoodId:number=0
privacyImpactId:number=0

isSuccessReviewer:boolean=false
isErrorReviewer:boolean=false
HeatMapRefernce:boolean=false


constructor(private el: ElementRef, private renderer: Renderer2,private api:ApiService){}
ngOnInit(){
  console.log("overall risk rating is before",this.overallRiskRatingBefore);
  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);


}
isReviewerNotInList(){
  this.reviewerNotInList=!this.reviewerNotInList
}
isHeatMapReference(){
  this.HeatMapRefernce=!this.HeatMapRefernce
}


onDropdownChange(event: any, type: string, category: string): void {
  const selectedFactorId = Number(event);
  const selectedFactorImpact = this.dropdownImpact.find(factor => Number(factor.id) === selectedFactorId);
  const selectedFactorLikelihood = this.dropdownLikelihood.find(factor => Number(factor.id) === selectedFactorId);

   switch (category) {
     case 'Confidentiality':
       if (type === 'Likelihood') {
         this.confidentialityLikelihoodValue = selectedFactorLikelihood.likelihood;
         this.confidentialityLikelihoodId=selectedFactorId
       } else if (type === 'Impact') {
         this.confidentialityImpactValue = selectedFactorImpact.impact;
         this.confidentialityImpactId=selectedFactorId
       }
       this.calculateRiskFactor('Confidentiality');
       break;

     case 'Integrity':
       if (type === 'Likelihood') {
         this.integrityLikelihoodValue = selectedFactorLikelihood.likelihood;
         this.integrityLikelihoodId=selectedFactorId
       } else if (type === 'Impact') {
         this.integrityImpactValue = selectedFactorImpact.impact;
         this.integrityImpactId=selectedFactorId
       }
       this.calculateRiskFactor('Integrity');
       break;

     case 'Availability':
       if (type === 'Likelihood') {
         this.availabilityLikelihoodValue = selectedFactorLikelihood.likelihood;
         this.availabilityLikelihoodId=selectedFactorId
       } else if (type === 'Impact') {
         this.availabilityImpactValue = selectedFactorImpact.impact;
         this.availabilityImpactId=selectedFactorId
       }
       this.calculateRiskFactor('Availability');
       break;

     case 'Privacy':
       if (type === 'Likelihood') {
         this.privacyLikelihoodValue = selectedFactorLikelihood.likelihood;
         this.privacyLikelihoodId=selectedFactorId
       } else if (type === 'Impact') {
         this.privacyImpactValue = selectedFactorImpact.impact;
         this.privacyImpactId=selectedFactorId
       }
       this.calculateRiskFactor('Privacy');
       break;
   }
 }

calculateRiskFactor(category: string): void {
  switch (category) {
    case 'Confidentiality':
      this.confidentialityRiskFactor = this.confidentialityLikelihoodValue * this.confidentialityImpactValue;
      break;

    case 'Integrity':
      this.integrityRiskFactor = this.integrityLikelihoodValue * this.integrityImpactValue;
      break;

    case 'Availability':
      this.availabilityRiskFactor = this.availabilityLikelihoodValue * this.availabilityImpactValue;
      break;

    case 'Privacy':
      this.privacyRiskFactor = this.privacyLikelihoodValue * this.privacyImpactValue;
      break;
  }
  if(this.confidentialityRiskFactor !=0 && this.integrityRiskFactor !=0 && this.availabilityRiskFactor !=0 && this.privacyRiskFactor !=0){

    this.overallRiskRating= this.confidentialityRiskFactor + this.integrityRiskFactor + this.availabilityRiskFactor + this.privacyRiskFactor
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
}

changeColorRiskFactor(category:string){

  // Define color for confidentialityRiskFactor
  if(category=='Confidentiality'){
    if (this.confidentialityRiskFactor > 0 && this.confidentialityRiskFactor < 9) {
      return '#6DA34D';  // Green for low risk
    }
    if (this.confidentialityRiskFactor > 8 && this.confidentialityRiskFactor < 17) {
      return '#FFC107';  // Yellow for medium risk
    }
    if (this.confidentialityRiskFactor > 16) {
      return '#D9534F';  // Red for high risk
    }
  }
  if(category=='Integrity'){
    // Define color for integrityRiskFactor
  if (this.integrityRiskFactor > 0 && this.integrityRiskFactor < 9) {
    return '#6DA34D';  // Green for low risk
  }
  if (this.integrityRiskFactor > 8 && this.integrityRiskFactor < 17) {
    return '#FFC107';  // Yellow for medium risk
  }
  if (this.integrityRiskFactor > 16) {
    return '#D9534F';  // Red for high risk
  }

  }
  if(category=='Availability'){
     // Define color for availabilityRiskFactor
  if (this.availabilityRiskFactor > 0 && this.availabilityRiskFactor < 9) {
    return '#6DA34D';  // Green for low risk
  }
  if (this.availabilityRiskFactor > 8 && this.availabilityRiskFactor < 17) {
    return '#FFC107';  // Yellow for medium risk
  }
  if (this.availabilityRiskFactor > 16) {
    return '#D9534F';  // Red for high risk
  }

  }

  if(category=='Privacy'){
     // Define color for privacyRiskFactor
  if (this.privacyRiskFactor > 0 && this.privacyRiskFactor < 9) {
    return '#6DA34D';  // Green for low risk
  }
  if (this.privacyRiskFactor > 8 && this.privacyRiskFactor < 17) {
    return '#FFC107';  // Yellow for medium risk
  }
  if (this.privacyRiskFactor > 16) {
    return '#D9534F';  // Red for high risk
  }

  }
  return '#6DA34D';
}

changeColorOverallRiskRating(){
  if(this.overallRiskRating<30){
    return '#6DA34D';
  }
  if(this.overallRiskRating>31 && this.overallRiskRating<99){
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
      likelihood: Number(this.confidentialityLikelihoodId),
      impact: Number(this.confidentialityImpactId),
      isMitigated: true,
      assessmentBasisId: 1,
      riskFactor: this.confidentialityRiskFactor,
      review: {
        userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
        externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
        comments:" ",
        reviewStatus:3,
      },
    },
    {
      likelihood: Number(this.integrityLikelihoodId),
      impact: Number(this.integrityImpactId),
      isMitigated: true,
      assessmentBasisId: 2,
      riskFactor: this.integrityRiskFactor,
      review: {
        userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
        externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
        comments:" ",
        reviewStatus:3,
      },
    },
    {
      likelihood: Number(this.availabilityLikelihoodId),
      impact: Number(this.availabilityImpactId),
      isMitigated: true,
      assessmentBasisId: 3,
      riskFactor: this.availabilityRiskFactor,
      review: {
        userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
        externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
        comments:" ",
        reviewStatus:3,
      },
    },
    {
      likelihood: Number(this.privacyLikelihoodId),
      impact: Number(this.privacyImpactId),
      isMitigated: true,
      assessmentBasisId: 4, // Example ID; replace if dynamic
      riskFactor: this.privacyRiskFactor,
      review: {
        userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
        externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
        comments:" ",
        reviewStatus:3,
      },
    },
  ],
};

  console.log(payload);
  this.submitForm.emit({ payload, riskType: this.riskTypeId });

}


receiveCancel(value: any) {
  if(value==false){
    this.isReviewerNotInList();
  }
}

saveReviewer(value: any){

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
