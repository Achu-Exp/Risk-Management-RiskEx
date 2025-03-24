import { department } from './../../Interfaces/deparments.interface';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { FormInputComponent } from '../form-input/form-input.component';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { ApiService } from '../../Services/api.service';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';
import { FormConformPopupComponent } from '../form-conform-popup/form-conform-popup.component';
import { Router } from '@angular/router';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { FormLoaderComponent } from '../form-loader/form-loader.component';
import { FormCategoryTableComponent } from '../form-category-table/form-category-table.component';
import { FormLikelihoodImpactTooltipComponent } from '../form-likelihood-impact-tooltip/form-likelihood-impact-tooltip.component';

@Component({
  selector: 'app-qms-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormInputComponent,
    FormDropdownComponent,
    FormTextAreaComponent,
    FormDateFieldComponent,
    FormDataNotInListComponent,
    FormSuccessfullComponent,
    FormReferenceHeatmapPopupComponent,
    FormConformPopupComponent,
    StyleButtonComponent,
    FormLoaderComponent,
    FormCategoryTableComponent,
    FormLikelihoodImpactTooltipComponent
  ],
  templateUrl: './qms-edit.component.html',
  styleUrl: './qms-edit.component.scss',
})
export class QmsEditComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Input() riskData: any = {};
  @Input() riskTypeValue: number = 1;
  @Input() departmentName: string = '';
  @Input() departmentId: string = '';
  @Input() dropdownLikelihood: any[] = [];
  @Input() isAdmin: string = '';
  @Input() dropdownImpact: any[] = [];
  @Input() dropdownProject: any[] = [];
  @Input() dropdownDepartment: any[] = [];
  @Input() dropdownAssignee: any[] = [];
  @Input() dropdownReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  overallRiskRating: number = 0;
  reviewerNotInList: boolean = false;
  assigneeNotInList: boolean = false;
  likelihoodValue: number = 0;
  impactValue: number = 0;
  riskFactor: number = 0;
  riskId: string = '';
  likelihoodId: number = 0;
  impactId: number = 0;
  projectId: number = 0;
  departmentIdForAdminToAdd: number = 0;
  responsiblePersonId: number = 0;
  internalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromInput: number = 0;
  newAssigneeId: number = 0;
  isInternal: boolean = true;
  preSelectedLikelihood: any;
  preSelectedImpact: any;
  preSelectedReviewer: any;
  preSelectedResponsiblePerson: any;
  preSelectedProject: any=null;

  HeatMapRefernce: boolean = false;
  isSuccessReviewer: boolean = false;
  isErrorReviewer: boolean = false;
  isSuccessAssignee: boolean = false;
  isErrorAssignee: boolean = false;
  openDropdownId: string | undefined = undefined;

  isCancel: boolean = false;
  isSave: boolean = false;
  isValid: boolean = false;

  newReviewername: string = '';
  newAssigneename: string = '';
  isnewAssigneenameDisplay: boolean = false;
  isnewReviewernameDisplay: boolean = false;
  isLoading = false; // Initially false
  departmentIdForAdminToAddToString:string=''
  showModalCategory = false; // Initially hidden
  departmentidForAssignee:string=''


  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router
  ) {}
  ngOnInit() {
    console.log('data:', this.riskData);
    const dateObj = new Date(this.riskData.plannedActionDate);
    this.qmsForm.patchValue({
      riskName: this.riskData.riskName,
      description: this.riskData.description,
      impact: this.riskData.impact,
      mitigation: this.riskData.mitigation,
      contingency: this.riskData.contingency,
      plannedActionDate: dateObj.toISOString().split('T')[0],
    });
    this.riskId = this.riskData.riskId;
    this.overallRiskRating = this.riskData.overallRiskRating;
    this.riskFactor = this.riskData.riskAssessments[0].riskFactor;
    this.departmentidForAssignee=this.riskData.department.id
    // this.departmentId=this.riskData.department.id


  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdownLikelihood'] && this.riskData?.riskAssessments?.length) {
      const preSelectedLikelihood = this.riskData.riskAssessments[0]?.likelihoodMatrix?.likeliHood;
      const selectedFactor = this.dropdownLikelihood?.find(
        (factor) => factor.assessmentFactor === preSelectedLikelihood
      );
      this.preSelectedLikelihood = selectedFactor?.id || null;
    }

    if (changes['dropdownImpact'] && this.riskData?.riskAssessments?.length) {
      const preSelectedImpact = this.riskData.riskAssessments[0]?.impactMatix?.impact;
      const selectedFactor = this.dropdownImpact?.find(
        (factor) => factor.assessmentFactor === preSelectedImpact
      );
      this.preSelectedImpact = selectedFactor?.id || null;
    }
    if (changes['dropdownProject']) {

        this.preSelectedProject = this.riskData.project.id;

    }
    if (changes['dropdownAssignee'] && this.riskData?.responsibleUser?.id) {
      this.preSelectedResponsiblePerson = this.riskData.responsibleUser.id;
    }
    if (changes['dropdownReviewer']) {
      this.preSelectedReviewer =
        this.riskData.riskAssessments[0].review.reviewerName;
      const selectedFactor = this.dropdownReviewer.find(
        (factor) => factor.fullName === this.preSelectedReviewer
      );
      console.log('selected factor is ', selectedFactor);
      if (selectedFactor) {
        if (selectedFactor.type === 'Internal') {
          this.isInternal = true;
          this.internalReviewerIdFromDropdown = selectedFactor.id;
          console.log(
            'Selected internal reviewer ID:',
            this.internalReviewerIdFromDropdown
          );

          console.log('this is a internal reviewer', this.isInternal);
        } else if (selectedFactor.type === 'External') {
          this.isInternal = false;
          this.externalReviewerIdFromDropdown = selectedFactor.id;
          console.log(
            'Selected external reviewer ID:',
            this.externalReviewerIdFromDropdown
          );
          console.log('this is a internal reviewer', this.isInternal);
        }
      }
    }
  }

  qmsForm = new FormGroup({
    riskName: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    impact: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    mitigation: new FormControl('', [
      Validators.maxLength(1000),
      Validators.minLength(15),
      Validators.required,
    ]),
    contingency: new FormControl(''),
    plannedActionDate: new FormControl('', Validators.required),
  });

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const minHeight = 40;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }

  // handleDropdownOpen(dropdownId: string) {
  //   this.openDropdownId =
  //     this.openDropdownId === dropdownId ? undefined : dropdownId;
  // }

  handleDropdownOpen(dropdownId: string | undefined): void {

    this.openDropdownId = dropdownId;
  }

  isReviewerNotInList() {
    this.reviewerNotInList = !this.reviewerNotInList;
  }

  isAssigneeNotInList() {
    this.assigneeNotInList = !this.assigneeNotInList;
  }
  isHeatMapReference() {
    this.HeatMapRefernce = !this.HeatMapRefernce;
  }

  onDropdownChangeProject(event: any): void {
    const selectedFactorId = Number(event);
    this.projectId = selectedFactorId;
  }

  // onDropdownChangeDepartment(event: any): void {
  //   const selectedFactorId = Number(event);
  //   this.departmentIdForAdminToAdd = selectedFactorId;
  //   this.departmentIdForAdminToAddToString= this.departmentIdForAdminToAdd.toString();

  // }

  onDropdownChangelikelihood(event: any): void {
    const selectedFactorId = Number(event);
    console.log(selectedFactorId);
    this.likelihoodId = selectedFactorId;

    const selectedFactor = this.dropdownLikelihood.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
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
    this.impactId = selectedFactorId;
    const selectedFactor = this.dropdownImpact.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    if (selectedFactor) {
      this.impactValue = selectedFactor.impact;
      console.log('Selected Impact:', this.impactValue);
    } else {
      console.log('Selected factor not found.');
    }
    this.calculateOverallRiskRating();
  }

  onDropdownChangeResponsiblePerson(event: any): void {
    const selectedFactorId = Number(event);
    this.responsiblePersonId = selectedFactorId;
  }

  onDropdownChangeReviewer(selectedReviewer: any) {
    const selectedreviewer = selectedReviewer;
    console.log('selected factor id is ', selectedreviewer);

    const selectedFactor = this.dropdownReviewer.find(
      (factor) => factor.fullName === selectedreviewer
    );
    console.log('selected factor is ', selectedFactor);
    if (selectedFactor) {
      if (selectedFactor.type === 'Internal') {
        this.isInternal = true;
        this.internalReviewerIdFromDropdown = selectedFactor.id;
        console.log(
          'Selected internal reviewer ID:',
          this.internalReviewerIdFromDropdown
        );

        console.log('this is a internal reviewer', this.isInternal);
      } else if (selectedFactor.type === 'External') {
        this.isInternal = false;
        this.externalReviewerIdFromDropdown = selectedFactor.id;
        console.log(
          'Selected external reviewer ID:',
          this.externalReviewerIdFromDropdown
        );
        console.log('this is a internal reviewer', this.isInternal);
      }
    } else {
      console.error('No matching reviewer found for the selected ID.');
    }
  }

  calculateOverallRiskRating() {
    if (this.likelihoodValue != 0 && this.impactValue != 0) {
      this.overallRiskRating = this.likelihoodValue * this.impactValue;
    }
    this.riskFactor = this.overallRiskRating;
  }

  changeColorOverallRiskRating() {
    if (this.overallRiskRating < 8) {
      return '#6DA34D';
    }
    if (this.overallRiskRating > 10 && this.overallRiskRating < 32) {
      return '#FFC107';
    } else {
      return '#D9534F';
    }
  }

  onSubmit() {
    this.isLoading=true;
    console.log("projectidddddddddd",this.projectId)
    console.log("prselecyted projectidddddddddd",this.preSelectedProject)
    console.log("preSelectedResponsiblePerson responsible person",this.preSelectedResponsiblePerson)
    console.log(" responsible person",this.responsiblePersonId)
    console.log("newassignee responsible person",this.newAssigneeId)



    console.log(this.qmsForm.value);

    const formValue = this.qmsForm.value;

    if (this.qmsForm.invalid) {
      console.log('Form is invalid, submission blocked');
      this.qmsForm.markAllAsTouched(); // Highlights all errors
      this.isValid = true;
      this.isLoading=false;
      return; // Stop execution if form is invalid
    }

    if (
      Number(this.riskTypeValue) <= 0 ||
      Number(this.overallRiskRating) <= 0 ||
      (Number(this.responsiblePersonId) <= 0 &&
        Number(this.preSelectedResponsiblePerson) <= 0 &&
        Number(this.newAssigneeId) <= 0) ||
      (Number(this.departmentId) <= 0 &&
        Number(this.departmentIdForAdminToAdd) <= 0) ||
      (Number(this.likelihoodId) <= 0 &&
        Number(this.preSelectedLikelihood) <= 0) ||
      (Number(this.impactId) <= 0 && Number(this.preSelectedImpact) <= 0) ||
      (this.isInternal &&
        Number(this.internalReviewerIdFromDropdown) <= 0 &&
        Number(this.externalReviewerIdFromInput) <= 0 &&
        Number(this.externalReviewerIdFromDropdown) <= 0)
    ) {
      console.log('Invalid numeric fields: Numbers must be greater than 0');
      this.isValid = true;
      this.isLoading=false;
      return;
    }
    const payload = {
      riskId: this.riskId,
      riskName: formValue.riskName,
      description: formValue.description,
      riskType: Number(this.riskTypeValue),
      impact: formValue.impact,
      mitigation: formValue.mitigation,
      contingency: formValue.contingency || ' ',
      OverallRiskRatingBefore: Number(this.overallRiskRating),
      responsibleUserId: Number(this.newAssigneeId)!== 0 && !isNaN(Number(this.newAssigneeId)) ? Number(this.newAssigneeId) :
                             Number(this.responsiblePersonId) !== 0 && !isNaN(Number(this.responsiblePersonId)) ? Number(this.responsiblePersonId):
                             this.preSelectedResponsiblePerson !== 0 && !isNaN(Number(this.preSelectedResponsiblePerson)) ? Number(this.preSelectedResponsiblePerson):
                             null,
      plannedActionDate: `${formValue.plannedActionDate}T00:00:00.000Z`,
      departmentId:
        Number(this.departmentId) !== 0 && !isNaN(Number(this.departmentId))
          ? Number(this.departmentId)
          : Number(this.departmentIdForAdminToAdd) &&
            !isNaN(Number(this.departmentIdForAdminToAdd))
          ? Number(this.departmentIdForAdminToAdd)
          : null,
          projectId:
          this.projectId && !isNaN(Number(this.projectId)) && Number(this.projectId) !== 0
            ? Number(this.projectId)
            : this.preSelectedProject && !isNaN(Number(this.preSelectedProject)) && Number(this.preSelectedProject) !== 0
            ? Number(this.preSelectedProject)
            : null,
      riskAssessments: [
        {
          likelihood: this.likelihoodId
            ? Number(this.likelihoodId)
            : this.preSelectedLikelihood &&
              !isNaN(Number(this.preSelectedLikelihood))
            ? Number(this.preSelectedLikelihood)
            : null,
          impact: this.impactValue
            ? Number(this.impactId)
            : this.preSelectedImpact && !isNaN(Number(this.preSelectedImpact))
            ? Number(this.preSelectedImpact)
            : null,
          isMitigated: false,
          assessmentBasisId: null,
          riskFactor: Number(this.riskFactor),
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId: Number(this.externalReviewerIdFromInput)
              ? Number(this.externalReviewerIdFromInput)
              : !this.isInternal &&
                Number(this.externalReviewerIdFromDropdown) !== 0
              ? Number(this.externalReviewerIdFromDropdown)
              : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
      ],
    };
    console.log(payload);

    this.submitForm.emit(payload);
    this.isLoading=false;
  }

  receiveCancel(value: any) {
    if (value == true) {
      this.isAssigneeNotInList();
    }
    if (value == false) {
      this.isReviewerNotInList();
    }
  }
  saveAssignee(value: any) {
    this.isLoading = true; // Show loader when function starts
    let departmentName;
    if(value.departmentId){
      const departmentNameDetails = this.dropdownDepartment.find(
        (factor) => factor.id === value.departmentId
      );
     departmentName = departmentNameDetails.departmentName;
    }


    const payload = {
      email: value.email,
      fullName: value.fullName,
      departmentName: departmentName,
    };
    this.api.addResponsiblePerson(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false; // Hide loader after success
        if (res) {
          this.newAssigneeId = res.id;
          this.isSuccessAssignee = true;
          this.newAssigneename = payload.fullName;
          this.isnewAssigneenameDisplay = true;
        } else {
          console.error(
            'External Responsible ID is not available in the response:',
            res
          );
        }
      },
      error: (err) => {
        this.isLoading = false; // Hide loader on error
        console.error(
          'Error occurred while fetching Responsible person ID:',
          err
        ); // Log the full error to see what went wrong
        this.isErrorAssignee = true;
      },
    });
  }

  saveReviewer(value: any) {
    this.isLoading = true; // Show loader when function starts

    const payload = {
      email: value.email,
      fullName: value.fullName,
      departmentId: value.departmentId,
    };

    this.api.addExternalReviewer(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false; // Hide loader after success

        if (res) {
          this.externalReviewerIdFromInput = res.reviewerId;
          this.isSuccessReviewer = true;
          this.newReviewername = payload.fullName;
          this.isnewReviewernameDisplay = true;
        } else {
          console.error(
            'External Reviewer ID is not available in the response:',
            res
          );
        }
      },
      error: (err) => {
        this.isLoading = false; // Hide loader on error
        console.error('Error occurred while fetching Reviewer ID:', err);
        this.isErrorReviewer = true;
      },
    });
  }

  closeReviewer() {
    this.isSuccessReviewer = false;
    this.isErrorReviewer = false;
  }
  closeAssignee() {
    this.isSuccessAssignee = false;
    this.isErrorAssignee = false;
  }
  closeHeatMap() {
    this.HeatMapRefernce = false;
  }

  saveConfirmation() {
    this.isSave = !this.isSave;
  }
  saveRisk() {
    this.onSubmit();
    this.isSave = false;
  }

  closeDialogSuccess() {
    this.router.navigate(['/home']);
  }

  cancelRisk() {
    this.isCancel = !this.isCancel;
  }
  closeRisk() {
    this.router.navigate(['/home']);
  }

  closepopupIsValidCheck() {
    this.isValid = false;
  }

  toggleModalCategory() {
    this.showModalCategory = !this.showModalCategory; // Toggle modal visibility
  }

  closeModalCategory() {
    this.showModalCategory = false; // Ensure modal closes only on the close button
  }




  showModal = false;
  tableType = '';
  handleInfoClickLikelihood(event: boolean) {
    console.log('Info button clicked, boolean value:', event);
    this.showModal = true;
    this.tableType = "likelihood";
    // Do something when button is clicked
  }
  handleInfoClickImpact(event: boolean) {
    console.log('Info button clicked, boolean value:', event);
    this.showModal = true;
    this.tableType = "impact";
    // Do something when button is clicked
  }
hideModal() {
  this.showModal = false;
}
}
