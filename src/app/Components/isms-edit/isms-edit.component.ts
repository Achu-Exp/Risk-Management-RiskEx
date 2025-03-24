import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
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
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';
import { Router } from '@angular/router';
import { FormConformPopupComponent } from '../form-conform-popup/form-conform-popup.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { FormLoaderComponent } from '../form-loader/form-loader.component';
import { FormCategoryTableComponent } from '../form-category-table/form-category-table.component';
import { FormLikelihoodImpactTooltipComponent } from '../form-likelihood-impact-tooltip/form-likelihood-impact-tooltip.component';

@Component({
  selector: 'app-isms-edit',
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
  templateUrl: './isms-edit.component.html',
  styleUrl: './isms-edit.component.scss',
})
export class IsmsEditComponent {
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
  confidentialityRiskFactor: number = 0;
  integrityRiskFactor: number = 0;
  availabilityRiskFactor: number = 0;
  privacyRiskFactor: number = 0;
  confidentialityLikelihoodValue: number = 0;
  confidentialityImpactValue: number = 0;
  integrityLikelihoodValue: number = 0;
  integrityImpactValue: number = 0;
  availabilityLikelihoodValue: number = 0;
  availabilityImpactValue: number = 0;
  privacyLikelihoodValue: number = 0;
  privacyImpactValue: number = 0;
  confidentialityLikelihoodId: number = 0;
  confidentialityImpactId: number = 0;
  integrityLikelihoodId: number = 0;
  integrityImpactId: number = 0;
  availabilityLikelihoodId: number = 0;
  availabilityImpactId: number = 0;
  privacyLikelihoodId: number = 0;
  privacyImpactId: number = 0;

  preSelectedConfidentialityLikelihood: any;
  preSelectedIntegrityLikelihood: any;
  preSelectedAvailabilityLikelihood: any;
  preSelectedPrivacyLikelihood: any;
  preSelectedConfidentialityImpact: any;
  preSelectedIntegrityImpact: any;
  preSelectedAvailabilityImpact: any;
  preSelectedPrivacyImpact: any;
  preSelectedReviewer: any;
  preSelectedResponsiblePerson: any;
  preSelectedProject: any=null;

  isSuccessReviewer: boolean = false;
  isErrorReviewer: boolean = false;
  isSuccessAssignee: boolean = false;
  isErrorAssignee: boolean = false;
  HeatMapRefernce: boolean = false;
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
  showModalCategory = false;
  departmentidForAssignee:string=''



  constructor(
    private api: ApiService,
    public authService: AuthService,
    private el: ElementRef,

    private router: Router
  ) {}

  ngOnInit() {
    const dateObj = new Date(this.riskData.plannedActionDate);
    this.ismsForm.patchValue({
      riskName: this.riskData.riskName,
      description: this.riskData.description,
      impact: this.riskData.impact,
      mitigation: this.riskData.mitigation,
      contingency: this.riskData.contingency,
      plannedActionDate: dateObj.toISOString().split('T')[0],
    });
    this.riskId = this.riskData.riskId;
    this.overallRiskRating = this.riskData.overallRiskRating;

    this.confidentialityRiskFactor =
      this.riskData.riskAssessments[0].riskFactor;
    this.integrityRiskFactor = this.riskData.riskAssessments[1].riskFactor;
    this.availabilityRiskFactor = this.riskData.riskAssessments[2].riskFactor;
    this.privacyRiskFactor = this.riskData.riskAssessments[3].riskFactor;
    this.departmentidForAssignee=this.riskData.department.id
    console.log(this.confidentialityRiskFactor);
  }

  // handleDropdownOpen(dropdownId: string) {

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

  onDropdownChangeDepartment(event: any): void {
    const selectedFactorId = Number(event);
    this.departmentIdForAdminToAdd = selectedFactorId;
    this.departmentIdForAdminToAddToString= this.departmentIdForAdminToAdd.toString();

  }

  onDropdownChange(event: any, type: string, category: string): void {
    const selectedFactorId = Number(event);
    const selectedFactorImpact = this.dropdownImpact.find(
      (factor) => Number(factor.id) === selectedFactorId
    );
    const selectedFactorLikelihood = this.dropdownLikelihood.find(
      (factor) => Number(factor.id) === selectedFactorId
    );

    switch (category) {
      case 'Confidentiality':
        if (type === 'Likelihood') {
          this.confidentialityLikelihoodValue =
            selectedFactorLikelihood.likelihood;
          this.confidentialityLikelihoodId = selectedFactorId;
        } else if (type === 'Impact') {
          this.confidentialityImpactValue = selectedFactorImpact.impact;
          this.confidentialityImpactId = selectedFactorId;
        }
        this.calculateRiskFactor('Confidentiality');
        break;

      case 'Integrity':
        if (type === 'Likelihood') {
          this.integrityLikelihoodValue = selectedFactorLikelihood.likelihood;
          this.integrityLikelihoodId = selectedFactorId;
        } else if (type === 'Impact') {
          this.integrityImpactValue = selectedFactorImpact.impact;
          this.integrityImpactId = selectedFactorId;
        }
        this.calculateRiskFactor('Integrity');
        break;

      case 'Availability':
        if (type === 'Likelihood') {
          this.availabilityLikelihoodValue =
            selectedFactorLikelihood.likelihood;
          this.availabilityLikelihoodId = selectedFactorId;
        } else if (type === 'Impact') {
          this.availabilityImpactValue = selectedFactorImpact.impact;
          this.availabilityImpactId = selectedFactorId;
        }
        this.calculateRiskFactor('Availability');
        break;

      case 'Privacy':
        if (type === 'Likelihood') {
          this.privacyLikelihoodValue = selectedFactorLikelihood.likelihood;
          this.privacyLikelihoodId = selectedFactorId;
        } else if (type === 'Impact') {
          this.privacyImpactValue = selectedFactorImpact.impact;
          this.privacyImpactId = selectedFactorId;
        }
        this.calculateRiskFactor('Privacy');
        break;
    }
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

  calculateRiskFactor(category: string): void {
    switch (category) {
      case 'Confidentiality':
        this.confidentialityRiskFactor =
          this.confidentialityLikelihoodValue * this.confidentialityImpactValue;
        break;

      case 'Integrity':
        this.integrityRiskFactor =
          this.integrityLikelihoodValue * this.integrityImpactValue;
        break;

      case 'Availability':
        this.availabilityRiskFactor =
          this.availabilityLikelihoodValue * this.availabilityImpactValue;
        break;

      case 'Privacy':
        this.privacyRiskFactor =
          this.privacyLikelihoodValue * this.privacyImpactValue;
        break;
    }
    if (
      this.confidentialityRiskFactor != 0 &&
      this.integrityRiskFactor != 0 &&
      this.availabilityRiskFactor != 0 &&
      this.privacyRiskFactor != 0
    ) {
      this.overallRiskRating =
        this.confidentialityRiskFactor +
        this.integrityRiskFactor +
        this.availabilityRiskFactor +
        this.privacyRiskFactor;
    }
  }

  changeColorRiskFactor(category: string) {
    // Define color for confidentialityRiskFactor
    if (category == 'Confidentiality') {
      if (
        this.confidentialityRiskFactor > 0 &&
        this.confidentialityRiskFactor < 9
      ) {
        return '#6DA34D'; // Green for low risk
      }
      if (
        this.confidentialityRiskFactor > 8 &&
        this.confidentialityRiskFactor < 17
      ) {
        return '#FFC107'; // Yellow for medium risk
      }
      if (this.confidentialityRiskFactor > 16) {
        return '#D9534F'; // Red for high risk
      }
    }
    if (category == 'Integrity') {
      // Define color for integrityRiskFactor
      if (this.integrityRiskFactor > 0 && this.integrityRiskFactor < 9) {
        return '#6DA34D'; // Green for low risk
      }
      if (this.integrityRiskFactor > 8 && this.integrityRiskFactor < 17) {
        return '#FFC107'; // Yellow for medium risk
      }
      if (this.integrityRiskFactor > 16) {
        return '#D9534F'; // Red for high risk
      }
    }
    if (category == 'Availability') {
      // Define color for availabilityRiskFactor
      if (this.availabilityRiskFactor > 0 && this.availabilityRiskFactor < 9) {
        return '#6DA34D'; // Green for low risk
      }
      if (this.availabilityRiskFactor > 8 && this.availabilityRiskFactor < 17) {
        return '#FFC107'; // Yellow for medium risk
      }
      if (this.availabilityRiskFactor > 16) {
        return '#D9534F'; // Red for high risk
      }
    }

    if (category == 'Privacy') {
      // Define color for privacyRiskFactor
      if (this.privacyRiskFactor > 0 && this.privacyRiskFactor < 9) {
        return '#6DA34D'; // Green for low risk
      }
      if (this.privacyRiskFactor > 8 && this.privacyRiskFactor < 17) {
        return '#FFC107'; // Yellow for medium risk
      }
      if (this.privacyRiskFactor > 16) {
        return '#D9534F'; // Red for high risk
      }
    }
    return '#6DA34D';
  }

  changeColorOverallRiskRating() {
    if (this.overallRiskRating < 30) {
      return '#6DA34D';
    }
    if (this.overallRiskRating > 31 && this.overallRiskRating < 99) {
      return '#FFC107';
    } else {
      return '#D9534F';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdownLikelihood'] && this.riskData?.riskAssessments) {
      const riskFactors = [
        'Confidentiality',
        'Integrity',
        'Availability',
        'Privacy',
      ];

      riskFactors.forEach((factor, index) => {
        const preSelectedLikelihood =
          this.riskData.riskAssessments[index]?.likelihoodMatrix?.likeliHood;
        const selectedFactor = this.dropdownLikelihood.find(
          (f) => f.assessmentFactor === preSelectedLikelihood
        );

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
      const riskFactors = [
        'Confidentiality',
        'Integrity',
        'Availability',
        'Privacy',
      ];

      riskFactors.forEach((factor, index) => {
        const preSelectedLikelihood =
          this.riskData.riskAssessments[index]?.impactMatix?.impact;
        const selectedFactor = this.dropdownImpact.find(
          (f) => f.assessmentFactor === preSelectedLikelihood
        );

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
      if (this.riskData.project) {
        this.preSelectedProject = this.riskData.project.id;
      }
    }
    if (changes['dropdownAssignee']) {
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
      } else {
        console.error('No matching reviewer found for the selected ID.');
      }
    }
  }

  ismsForm = new FormGroup({
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

  onSubmit() {
    this.isLoading=true;
    console.log(this.ismsForm.value);
    const formValue = this.ismsForm.value;

    if (this.ismsForm.invalid) {
      console.log('Form is invalid, submission blocked');
      this.ismsForm.markAllAsTouched(); // Highlights all errors
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
      (Number(this.confidentialityLikelihoodId) <= 0 &&
        Number(this.preSelectedConfidentialityLikelihood) <= 0) ||
      (Number(this.confidentialityImpactId) <= 0 &&
        Number(this.preSelectedConfidentialityImpact) <= 0) ||
      (Number(this.integrityLikelihoodId) <= 0 &&
        Number(this.preSelectedIntegrityLikelihood) <= 0) ||
      (Number(this.integrityImpactId) <= 0 &&
        Number(this.preSelectedIntegrityImpact) <= 0) ||
      (Number(this.availabilityLikelihoodId) <= 0 &&
        Number(this.preSelectedAvailabilityLikelihood) <= 0) ||
      (Number(this.availabilityImpactId) <= 0 &&
        Number(this.preSelectedAvailabilityImpact) <= 0) ||
      (Number(this.privacyLikelihoodId) <= 0 &&
        Number(this.preSelectedPrivacyLikelihood) <= 0) ||
      (Number(this.privacyImpactId) <= 0 &&
        Number(this.preSelectedPrivacyImpact) <= 0) ||
      (this.isInternal &&
        Number(this.internalReviewerIdFromDropdown) <= 0 &&
        Number(this.externalReviewerIdFromInput) <= 0 &&
        Number(this.externalReviewerIdFromDropdown) <= 0)
    ) {
      console.error(
        'Form validation failed. Please ensure all required fields are filled correctly.'
      );
      this.isValid = true;
      this.isLoading=false;
      return; // Stop form submission if validation fails
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
          : this.departmentIdForAdminToAdd &&
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
          likelihood:
            Number(this.confidentialityLikelihoodId) &&
            !isNaN(Number(this.confidentialityLikelihoodId))
              ? Number(this.confidentialityLikelihoodId)
              : this.preSelectedConfidentialityLikelihood &&
                !isNaN(Number(this.preSelectedConfidentialityLikelihood))
              ? Number(this.preSelectedConfidentialityLikelihood)
              : null,
          impact:
            Number(this.confidentialityImpactId) &&
            !isNaN(Number(this.confidentialityImpactId))
              ? Number(this.confidentialityImpactId)
              : this.preSelectedConfidentialityImpact &&
                !isNaN(Number(this.preSelectedConfidentialityImpact))
              ? Number(this.preSelectedConfidentialityImpact)
              : null,
          isMitigated: false,
          assessmentBasisId: 1,
          riskFactor: this.confidentialityRiskFactor,
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0 &&
              !isNaN(Number(this.internalReviewerIdFromDropdown))
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId:
              Number(this.externalReviewerIdFromInput) &&
              !isNaN(Number(this.externalReviewerIdFromInput))
                ? Number(this.externalReviewerIdFromInput)
                : !this.isInternal &&
                  Number(this.externalReviewerIdFromDropdown) !== 0 &&
                  !isNaN(Number(this.externalReviewerIdFromDropdown))
                ? Number(this.externalReviewerIdFromDropdown)
                : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
        {
          likelihood:
            Number(this.integrityLikelihoodId) &&
            !isNaN(Number(this.integrityLikelihoodId))
              ? Number(this.integrityLikelihoodId)
              : this.preSelectedIntegrityLikelihood &&
                !isNaN(Number(this.preSelectedIntegrityLikelihood))
              ? Number(this.preSelectedIntegrityLikelihood)
              : null,
          impact:
            Number(this.integrityImpactId) &&
            !isNaN(Number(this.integrityImpactId))
              ? Number(this.integrityImpactId)
              : this.preSelectedIntegrityImpact &&
                !isNaN(Number(this.preSelectedIntegrityImpact))
              ? Number(this.preSelectedIntegrityImpact)
              : null,
          isMitigated: false,
          assessmentBasisId: 2,
          riskFactor: this.integrityRiskFactor,
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0 &&
              !isNaN(Number(this.internalReviewerIdFromDropdown))
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId:
              Number(this.externalReviewerIdFromInput) &&
              !isNaN(Number(this.externalReviewerIdFromInput))
                ? Number(this.externalReviewerIdFromInput)
                : !this.isInternal &&
                  Number(this.externalReviewerIdFromDropdown) !== 0 &&
                  !isNaN(Number(this.externalReviewerIdFromDropdown))
                ? Number(this.externalReviewerIdFromDropdown)
                : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
        {
          likelihood:
            Number(this.availabilityLikelihoodId) &&
            !isNaN(Number(this.availabilityLikelihoodId))
              ? Number(this.availabilityLikelihoodId)
              : this.preSelectedAvailabilityLikelihood &&
                !isNaN(Number(this.preSelectedAvailabilityLikelihood))
              ? Number(this.preSelectedAvailabilityLikelihood)
              : null,
          impact:
            Number(this.availabilityImpactId) &&
            !isNaN(Number(this.availabilityImpactId))
              ? Number(this.availabilityImpactId)
              : this.preSelectedAvailabilityImpact &&
                !isNaN(Number(this.preSelectedAvailabilityImpact))
              ? Number(this.preSelectedAvailabilityImpact)
              : null,
          isMitigated: false,
          assessmentBasisId: 3,
          riskFactor: this.availabilityRiskFactor,
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0 &&
              !isNaN(Number(this.internalReviewerIdFromDropdown))
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId:
              Number(this.externalReviewerIdFromInput) &&
              !isNaN(Number(this.externalReviewerIdFromInput))
                ? Number(this.externalReviewerIdFromInput)
                : !this.isInternal &&
                  Number(this.externalReviewerIdFromDropdown) !== 0 &&
                  !isNaN(Number(this.externalReviewerIdFromDropdown))
                ? Number(this.externalReviewerIdFromDropdown)
                : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
        {
          likelihood:
            Number(this.privacyLikelihoodId) &&
            !isNaN(Number(this.privacyLikelihoodId))
              ? Number(this.privacyLikelihoodId)
              : this.preSelectedPrivacyLikelihood &&
                !isNaN(Number(this.preSelectedPrivacyLikelihood))
              ? Number(this.preSelectedPrivacyLikelihood)
              : null,
          impact:
            Number(this.privacyImpactId) && !isNaN(Number(this.privacyImpactId))
              ? Number(this.privacyImpactId)
              : this.preSelectedPrivacyImpact &&
                !isNaN(Number(this.preSelectedPrivacyImpact))
              ? Number(this.preSelectedPrivacyImpact)
              : null,
          isMitigated: false,
          assessmentBasisId: 4,
          riskFactor: this.privacyRiskFactor,
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0 &&
              !isNaN(Number(this.internalReviewerIdFromDropdown))
                ? Number(this.internalReviewerIdFromDropdown)
                : null,
            externalReviewerId:
              Number(this.externalReviewerIdFromInput) &&
              !isNaN(Number(this.externalReviewerIdFromInput))
                ? Number(this.externalReviewerIdFromInput)
                : !this.isInternal &&
                  Number(this.externalReviewerIdFromDropdown) !== 0 &&
                  !isNaN(Number(this.externalReviewerIdFromDropdown))
                ? Number(this.externalReviewerIdFromDropdown)
                : null,
            comments: ' ',
            reviewStatus: 1,
          },
        },
      ],
    };

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
  showTooltipLikelihood:boolean=false;
  showTooltipImpact:boolean=false;

  showTable(type: string) {
    this.tableType = type;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }
}
