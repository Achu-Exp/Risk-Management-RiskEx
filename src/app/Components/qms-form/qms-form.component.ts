import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { BodyContainerComponent } from "../body-container/body-container.component";
import { HeatmapComponent } from '../heatmap/heatmap.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormButtonComponent } from '../../UI/form-button/form-button.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { ApiService } from '../../Services/api.service';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';
import { FormConformPopupComponent } from '../form-conform-popup/form-conform-popup.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, CommonModule, BodyContainerComponent,HeatmapComponent,FormInputComponent,FormDropdownComponent,FormTextAreaComponent,FormDateFieldComponent ,FormButtonComponent,FormDataNotInListComponent,FormSuccessfullComponent,FormReferenceHeatmapPopupComponent,FormConformPopupComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {

  @Output() submitForm = new EventEmitter<any>();
  @Output() departmentSelectedByAdmin = new EventEmitter<any>();
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
  @Input() dropdownDataProjectForAdmin:any[]=[]
  @Input() dropdownAssigneeForAdmin:any[]=[]
  overallRiskRating: number = 0;
  reviewerNotInList:boolean=false
  assigneeNotInList:boolean=false
  likelihoodValue:number=0
  impactValue:number=0
  riskFactor:number=0
  riskId:string=''
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
  HeatMapRefernce:boolean=false
  isSuccessReviewer:boolean=false
  isErrorReviewer:boolean=false
  isSuccessAssignee:boolean=false
  isErrorAssignee:boolean=false
  openDropdownId: string | undefined = undefined;
  isCancel:boolean=false
  isSave:boolean=false
  draft:any={}
  preSelectedLikelihood:any
  preSelectedImpact:any
  preSelectedReviewer:any
  preSelectedResponsiblePerson:any
  preSelectedProject:any

  constructor(private el: ElementRef, private renderer: Renderer2, private api:ApiService,private router: Router){}
  ngOnInit(){
    console.log('Received bgColor from parent:', this.bgColor);
    this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);
    this.api.getNewRiskId(Number(this.departmentId)).subscribe({
      next: (res: any) => {
        this.riskId = res.riskId;
        console.log("Risk ID received:", this.riskId);  // Log the riskId to see if it's what you expect
      },
      error: (err) => {
        console.error("Error occurred:", err);  // Log the full error to see what went wrong
      }
    });

    this.loadDraft();

  }

  qmsForm=new FormGroup({
    riskName:new FormControl('',Validators.required),
    description:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    impact:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    mitigation:new FormControl('',[Validators.maxLength(1000),Validators.minLength(15),Validators.required]),
    contingency:new FormControl(''),
    plannedActionDate:new FormControl('',Validators.required),
  })






  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const minHeight = 40;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }

  handleDropdownOpen(dropdownId: string) {
    this.openDropdownId = this.openDropdownId === dropdownId ? undefined : dropdownId;
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
    this.departmentSelectedByAdmin.emit(this.departmentIdForAdminToAdd);
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





  calculateOverallRiskRating(){
    if(this.likelihoodValue !=0 && this.impactValue !=0){
      this.overallRiskRating=this.likelihoodValue * this.impactValue
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


  onSubmit(){

    console.log(this.qmsForm.value);

    const formValue = this.qmsForm.value;
    const payload = {
      riskId:this.riskId ,
      riskName: formValue.riskName ,
      description: formValue.description,
      riskType:Number(this.riskTypeValue) ,
      impact: formValue.impact ,
      mitigation: formValue.mitigation,
      contingency: formValue.contingency || " ",
      OverallRiskRatingBefore:Number(this.overallRiskRating) ,
      responsibleUserId:Number(this.responsiblePersonId)!=0 ?+Number(this.responsiblePersonId):Number(this.newAssigneeId),
      plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z` ,
      departmentId:Number(this.departmentId)!=0 ? + Number(this.departmentId) : Number(this.departmentIdForAdminToAdd),
      projectId:Number(this.projectId)!=0 ? +Number(this.projectId) : null,
      riskAssessments: [
        {
          likelihood: Number(this.likelihoodId) ,
          impact: Number(this.impactId) ,
          isMitigated: false,
          assessmentBasisId:null,
          riskFactor:Number(this.riskFactor) ,
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

    localStorage.removeItem('draft'); // Delete draft after saving
  console.log('Draft Removed!');
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
    console.log("payload for assignee",payload)
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

  closeHeatMap(){
    this.HeatMapRefernce=false
  }

  closeReviewer() {
    this.isSuccessReviewer=false
    this.isErrorReviewer=false

  }
  closeAssignee(){
    this.isSuccessAssignee=false
    this.isErrorAssignee=false
  }

 clearAllData(){
  this.qmsForm.reset();
  this.internalReviewerIdFromDropdown=0
 }
 cancelRisk(){
  this.isCancel=!this.isCancel

 }
 closeRisk(){
  this.router.navigate(['/home']);
 }
 saveAsDraft(){
  const draft = {

      formValues: this.qmsForm.value,
      riskType:Number(this.riskTypeValue) ,
      OverallRiskRatingBefore:Number(this.overallRiskRating) ,
      responsibleUserId:Number(this.responsiblePersonId)!=0 ?+Number(this.responsiblePersonId):Number(this.newAssigneeId),
      departmentId:Number(this.departmentId)!=0 ? + Number(this.departmentId) : Number(this.departmentIdForAdminToAdd),
      projectId:Number(this.projectId)!=0 ? +Number(this.projectId) : null,
      riskAssessments: [
        {
          likelihood: Number(this.likelihoodId) ,
          impact: Number(this.impactId) ,
          isMitigated: false,
          assessmentBasisId:null,
          riskFactor:Number(this.riskFactor) ,
          review: {
            userId: this.isInternal && Number(this.internalReviewerIdFromDropdown)!=0? Number(this.internalReviewerIdFromDropdown) : null,
            externalReviewerId:Number(this.externalReviewerIdFromInput) ?  Number(this.externalReviewerIdFromInput):!this.isInternal&&Number(this.externalReviewerIdFromDropdown)!=0?Number(this.externalReviewerIdFromDropdown): null,
            comments:" ",
            reviewStatus:1,
          },
        },
      ],
    };
    localStorage.setItem('draft', JSON.stringify(draft));
    console.log('Draft Saved as JSON:', JSON.stringify(draft));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.draft) {
      if (changes['dropdownLikelihood']) {
        this.preSelectedLikelihood = this.draft.riskAssessments[0].likelihood;
      }

      if (changes['dropdownImpact']) {
        this.preSelectedImpact = this.draft.riskAssessments[0].impact;
      }

      if (changes['dropdownProject']) {
        this.preSelectedProject = this.draft.projectId;
      }

      if (changes['dropdownAssignee']) {
        this.preSelectedResponsiblePerson = this.draft.responsibleUserId;
      }

      if (changes['dropdownReviewer']) {
        const selectedFactor = this.dropdownReviewer.find(factor => factor.id === this.draft.riskAssessments[0].review.userId);

        if (selectedFactor) {
          if (selectedFactor.type === "Internal") {
            this.isInternal = true;
            this.internalReviewerIdFromDropdown = selectedFactor.id;
            this.preSelectedReviewer=selectedFactor?.fullName
          } else if (selectedFactor.type === "External") {
            this.isInternal = false;
            this.externalReviewerIdFromDropdown = selectedFactor.id;
            this.preSelectedReviewer=selectedFactor?.fullName
          }
        }
      }
    }
  }


  loadDraft() {
    const draft = localStorage.getItem('draft');
    if (draft) {
      this.draft = JSON.parse(draft); // Store draft data
      console.log('Draft Loaded:', this.draft);
      this.qmsForm.patchValue(this.draft.formValues);
      this.overallRiskRating=this.draft.OverallRiskRatingBefore
      this.riskFactor=this.draft.riskAssessments[0].riskFactor
    }
  }

 saveConfirmation(){
  this.isSave=!this.isSave
 }
 saveRisk(){
  this.onSubmit();
  this.isSave=false

 }






}
