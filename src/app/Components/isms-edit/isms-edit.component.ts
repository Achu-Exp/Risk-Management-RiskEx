import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../UI/button/button.component';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';
import { TextareaComponent } from '../../UI/textarea/textarea.component';
import { OverallRatingCardComponent } from '../../UI/overall-rating-card/overall-rating-card.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { FormButtonComponent } from '../../UI/form-button/form-button.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';

@Component({
  selector: 'app-isms-edit',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, ButtonComponent, DropdownComponent, TextareaComponent, OverallRatingCardComponent,CommonModule,FormInputComponent,FormDropdownComponent,FormTextAreaComponent,FormDateFieldComponent,FormButtonComponent,FormDataNotInListComponent,FormSuccessfullComponent,FormReferenceHeatmapPopupComponent],
  templateUrl: './isms-edit.component.html',
  styleUrl: './isms-edit.component.scss'
})
export class IsmsEditComponent {

  @Output() submitForm = new EventEmitter<any>();
  @Input() riskData:any={}
  @Input() bgColor: string = ''
  @Input() riskTypeValue: number=1
  @Input() departmentName: string=''
  @Input() departmentId: string=''
  @Input() dropdownLikelihood: any[] = []
  @Input() isAdmin: string=''
  @Input() dropdownImpact:any[]=[]
  @Input() dropdownProject:any[]=[]
  @Input() dropdownDepartment:any[]=[]
  @Input() dropdownAssignee:any[]=[]
  @Input() dropdownReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
  overallRiskRating: number = 0;
  reviewerNotInList:boolean=false
  assigneeNotInList:boolean=false
  likelihoodValue:number=0
  impactValue:number=0
  riskFactor:number=0
  riskId:string='SFM-001'
  likelihoodId:number=0
  impactId:number=0
  projectId:number=0
  departmentIdForAdminToAdd:number=0
  responsiblePersonId:number=0
  internalReviewerIdFromDropdown:number=0
  externalReviewerIdFromDropdown:number=0
  externalReviewerIdFromInput:number=0
  newAssigneeId:number=0
  isInternal:boolean=true
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

  preSelectedConfidentialityLikelihood:any
  preSelectedIntegrityLikelihood:any
  preSelectedAvailabilityLikelihood:any
  preSelectedPrivacyLikelihood:any
  preSelectedConfidentialityImpact:any
  preSelectedIntegrityImpact:any
  preSelectedAvailabilityImpact:any
  preSelectedPrivacyImpact:any
  preSelectedReviewer:any
  preSelectedResponsiblePerson:any
  preSelectedProject:any


  isSuccessReviewer:boolean=false
  isErrorReviewer:boolean=false
  isSuccessAssignee:boolean=false
  isErrorAssignee:boolean=false
  HeatMapRefernce:boolean=false


constructor(private api:ApiService,public authService:AuthService,private el: ElementRef, private renderer: Renderer2){}

ngOnInit(){
  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);
  console.log("data:", this.riskData)
    console.log('Received bgColor from parent:', this.bgColor);
    this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);
    const dateObj = new Date(this.riskData.plannedActionDate);
    this.ismsForm.patchValue({
      riskName:this.riskData.riskName,
      description:this.riskData.description,
      impact:this.riskData.impact,
      mitigation:this.riskData.mitigation,
      contingency:this.riskData.contingency,
      plannedActionDate:dateObj.toISOString().split('T')[0],
    })
   this.overallRiskRating=this.riskData.overallRiskRating
  // this.riskFactor=this.riskData.riskAssessments[0].riskFactor
  this.confidentialityRiskFactor=this.riskData.riskAssessments[0].riskFactor
  this.integrityRiskFactor=this.riskData.riskAssessments[1].riskFactor
  this.availabilityRiskFactor=this.riskData.riskAssessments[2].riskFactor
  this.privacyRiskFactor=this.riskData.riskAssessments[3].riskFactor
  console.log(this.confidentialityRiskFactor);

}

isReviewerNotInList(){
  this.reviewerNotInList=!this.reviewerNotInList
}

isAssigneeNotInList(){
  this.assigneeNotInList=!this.assigneeNotInList
}
isHeatMapReference(){
  this.HeatMapRefernce=!this.HeatMapRefernce
}

onDropdownChangeProject(event: any): void {
  const selectedFactorId = Number(event);
  this.projectId=selectedFactorId
}

onDropdownChangeDepartment(event: any): void {
  const selectedFactorId = Number(event);
  this.departmentIdForAdminToAdd=selectedFactorId
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


onDropdownChangeResponsiblePerson(event: any): void {
  const selectedFactorId = Number(event);
  this.responsiblePersonId=selectedFactorId
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


ngOnChanges(changes: SimpleChanges): void {
 if (changes['dropdownLikelihood'] && this.riskData?.riskAssessments) {
    const riskFactors = ['Confidentiality', 'Integrity', 'Availability', 'Privacy'];

    riskFactors.forEach((factor, index) => {
      const preSelectedLikelihood = this.riskData.riskAssessments[index]?.likelihoodMatrix?.likeliHood;
      const selectedFactor = this.dropdownLikelihood.find(f => f.assessmentFactor === preSelectedLikelihood);

      if (selectedFactor) {
        switch (factor) {
          case 'Confidentiality':
            this.preSelectedConfidentialityLikelihood = selectedFactor.id;
            break;
          case 'Integrity':
            this.preSelectedIntegrityLikelihood = selectedFactor.id;
            break;
          case 'Availability':
            this.preSelectedAvailabilityLikelihood = selectedFactor.id;
            break;
          case 'Privacy':
            this.preSelectedPrivacyLikelihood = selectedFactor.id;
            break;
        }
      }
    });
  }
  if (changes['dropdownImpact'] && this.riskData?.riskAssessments) {
    const riskFactors = ['Confidentiality', 'Integrity', 'Availability', 'Privacy'];

    riskFactors.forEach((factor, index) => {
      const preSelectedLikelihood = this.riskData.riskAssessments[index]?.impactMatix?.impact;
      const selectedFactor = this.dropdownImpact.find(f => f.assessmentFactor === preSelectedLikelihood);

      if (selectedFactor) {
        switch (factor) {
          case 'Confidentiality':
            this.preSelectedConfidentialityImpact = selectedFactor.id;
            break;
          case 'Integrity':
            this.preSelectedIntegrityImpact = selectedFactor.id;
            break;
          case 'Availability':
            this.preSelectedAvailabilityImpact = selectedFactor.id;
            break;
          case 'Privacy':
            this.preSelectedPrivacyImpact = selectedFactor.id;
            break;
        }
      }
    });
  }
  if (changes['dropdownProject']) {
    if(this.riskData.project){
      this.preSelectedProject=this.riskData.project.id;

    }


  }
  if (changes['dropdownAssignee']) {
     this.preSelectedResponsiblePerson = this.riskData.responsibleUser.id;

  }
  if (changes['dropdownReviewer']) {
    this.preSelectedReviewer = this.riskData.riskAssessments[0].review.reviewerName;
    const selectedFactor = this.dropdownReviewer.find(factor => factor.fullName === this.preSelectedReviewer );
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
}

ismsForm=new FormGroup({
  riskName:new FormControl('',Validators.required),
  description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  impact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
  contingency:new FormControl(''),
  plannedActionDate:new FormControl('',Validators.required),
})

onSubmit(){
  console.log(this.ismsForm.value);
  const formValue = this.ismsForm.value;

    const payload = {
      riskId:this.riskId ,
      riskName: formValue.riskName ,
      description: formValue.description,
      riskType:Number(this.riskTypeValue) ,
      impact: formValue.impact ,
      mitigation: formValue.mitigation,
      contingency: formValue.contingency || " ",
      OverallRiskRatingBefore:Number(this.overallRiskRating) ,
      responsibleUserId:Number(this.responsiblePersonId)!=0 ?+Number(this.responsiblePersonId):Number(this.preSelectedResponsiblePerson!=0) ? Number(this.preSelectedResponsiblePerson): Number(this.newAssigneeId),
      plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z` ,
      departmentId:Number(this.departmentId)!=0 ? + Number(this.departmentId) : Number(this.departmentIdForAdminToAdd),
      projectId:Number(this.projectId)!=0 ? +Number(this.projectId):Number(this.preSelectedProject!=0)? Number(this.preSelectedProject): null,
      riskAssessments: [
      {
        likelihood: Number(this.confidentialityLikelihoodId)?Number(this.confidentialityLikelihoodId):Number(this.preSelectedConfidentialityLikelihood),
        impact: Number(this.confidentialityImpactId)?Number(this.confidentialityImpactId):Number(this.preSelectedConfidentialityImpact),
        isMitigated: false,
        assessmentBasisId: 1, // Example ID; replace if dynamic
        riskFactor: this.confidentialityRiskFactor,
        review: {
          userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
          externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
          comments:" ",
          reviewStatus:1,
        },
      },
      {
        likelihood: Number(this.integrityLikelihoodId)?Number(this.integrityLikelihoodId):Number(this.preSelectedIntegrityLikelihood),
        impact: Number(this.integrityImpactId)?Number(this.integrityImpactId):Number(this.preSelectedIntegrityImpact),
        isMitigated: false,
        assessmentBasisId: 2, // Example ID; replace if dynamic
        riskFactor: this.integrityRiskFactor,
        review: {
          userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
          externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
          comments:" ",
          reviewStatus:1,
        },
      },
      {
        likelihood: Number(this.availabilityLikelihoodId)?Number(this.availabilityLikelihoodId):Number(this.preSelectedAvailabilityLikelihood),
        impact: Number(this.availabilityImpactId)?Number(this.availabilityImpactId):Number(this.preSelectedAvailabilityImpact),
        isMitigated: false,
        assessmentBasisId: 3, // Example ID; replace if dynamic
        riskFactor: this.availabilityRiskFactor,
        review: {
          userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
          externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
          comments:" ",
          reviewStatus:1,
        },
      },
      {
        likelihood: Number(this.privacyLikelihoodId)?Number(this.privacyLikelihoodId):Number(this.preSelectedPrivacyLikelihood),
        impact: Number(this.privacyImpactId)?Number(this.privacyImpactId):Number(this.preSelectedPrivacyImpact),
        isMitigated: false,
        assessmentBasisId: 4, // Example ID; replace if dynamic
        riskFactor: this.privacyRiskFactor,
        review: {
          userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
          externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
          comments:" ",
          reviewStatus:1,
        },
      },
    ],
  };

  this.submitForm.emit(payload);

}


receiveCancel(value: any) {
  if(value==true){
    this.isAssigneeNotInList();
  }
  if(value==false){
    this.isReviewerNotInList();
  }
}
saveAssignee(value: any){

  const departmentNameDetails=this.dropdownDepartment.find(factor => factor.id === value.departmentId)
  const departmentName= departmentNameDetails.departmentName

  const payload = {
    email:value.email,
    fullName:value.fullName,
    departmentName: departmentName
  }
  this.api.addResponsiblePerson(payload).subscribe((res:any)=>{
    this.newAssigneeId=res.id
    console.log("new assignee id: ",this.newAssigneeId)
    this.isSuccessAssignee=true

  },
  (error:any)=>{
    this.isErrorAssignee=true
  }
)

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
closeAssignee(){
  this.isSuccessAssignee=false
  this.isErrorAssignee=false
}
closeHeatMap(){
  this.HeatMapRefernce=false
}


saveConfirmation(){}
clearAllData(){}
cancelRisk(){}
saveAsDraft(){}

}
