import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDropdownComponent } from '../form-dropdown/form-dropdown.component';
import { FormDateFieldComponent } from '../form-date-field/form-date-field.component';
import { FormRiskResponseComponent } from '../form-risk-response/form-risk-response.component';
import { FormTextAreaComponent } from '../form-text-area/form-text-area.component';
import { FormDataNotInListComponent } from '../form-data-not-in-list/form-data-not-in-list.component';
import { ApiService } from '../../Services/api.service';
import { FormSuccessfullComponent } from '../form-successfull/form-successfull.component';
import { FormReferenceHeatmapPopupComponent } from '../form-reference-heatmap-popup/form-reference-heatmap-popup.component';
import { FormConformPopupComponent } from '../form-conform-popup/form-conform-popup.component';
import { Router } from '@angular/router';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { FormLoaderComponent } from '../form-loader/form-loader.component';
import { FormLikelihoodImpactTooltipComponent } from '../form-likelihood-impact-tooltip/form-likelihood-impact-tooltip.component';
import { FormResponseTableComponent } from '../form-response-table/form-response-table.component';

@Component({
  selector: 'app-update-qms',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FormDropdownComponent,
    FormDateFieldComponent,
    FormRiskResponseComponent,
    ReactiveFormsModule,
    FormTextAreaComponent,
    FormDataNotInListComponent,
    FormSuccessfullComponent,
    FormReferenceHeatmapPopupComponent,
    FormConformPopupComponent,
    StyleButtonComponent,
    FormLoaderComponent,
    FormLikelihoodImpactTooltipComponent,
    FormResponseTableComponent
  ],
  templateUrl: './update-qms.component.html',
  styleUrl: './update-qms.component.scss',
})
export class UpdateQmsComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Input() overallRiskRatingBefore: number = 0;
  @Input() dropdownLikelihood: any[] = [];
  @Input() dropdownImpact: any[] = [];
  @Input() dropdownDepartment: any[] = [];
  @Input() dropdownReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  @Input() riskResponses: Array<{
    id: number;
    name: string;
    description: string;
    example: string;
    risks: string;
  }> = [];

  @Input() riskTypeId: number = 0;
  overallRiskRating: number = 0;
  likelihoodValue: number = 0;
  impactValue: number = 0;
  riskFactor: number = 0;
  likelihoodId: number = 0;
  impactId: number = 0;
  riskResponseValue: number = 0;
  reviewerNotInList: boolean = false;
  internalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromDropdown: number = 0;
  isInternal: boolean = true;
  externalReviewerIdFromInput: number = 0;
  residualValue: number = 0;
  percentageRedution: number = 0;
  residualRisk: number = 0;

  isSuccessReviewer: boolean = false;
  isErrorReviewer: boolean = false;
  HeatMapRefernce: boolean = false;
  error: string = '';
  openDropdownId: string | undefined = undefined;

  isCancel: boolean = false;
  isSave: boolean = false;
  isValid: boolean = false;
  newReviewername: string = '';
  isnewReviewernameDisplay: boolean = false;
  isLoading = false; // Initially false

  constructor(
    private el: ElementRef,

    private api: ApiService,
    private router: Router
  ) {}
  ngOnInit() {}
  handleDropdownOpen(dropdownId: string | undefined): void {

    this.openDropdownId = dropdownId;
  }
  isReviewerNotInList() {
    this.reviewerNotInList = !this.reviewerNotInList;
  }
  isHeatMapReference() {
    this.HeatMapRefernce = !this.HeatMapRefernce;
  }

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

  calculateOverallRiskRating() {
    if (this.likelihoodValue != 0 && this.impactValue != 0) {
      this.overallRiskRating = this.likelihoodValue * this.impactValue;
      this.residualValue =
        this.overallRiskRatingBefore - this.overallRiskRating;
      this.percentageRedution = parseFloat(
        ((this.residualValue / this.overallRiskRatingBefore) * 100).toFixed(2)
      );
      if (this.percentageRedution > 60) {
        this.residualRisk = 1;
      } else if (this.percentageRedution >= 40) {
        this.residualRisk = 2;
      } else {
        this.residualRisk = 3;
      }
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

  onRadioSelectionChange(value: any) {
    this.riskResponseValue = value;
    console.log('Selected value from child:', value);
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

  updateQmsForm = new FormGroup({
    closeDate: new FormControl('', Validators.required),
    remarks: new FormControl(''),
  });

  onSubmit() {
    this.isLoading=true;
    const formValue = this.updateQmsForm.value;
    console.log(formValue);
    if (
      Number(this.riskResponseValue) <= 0 ||
      Number(this.overallRiskRating) <= 0 ||
      (Number(this.likelihoodId) <= 0 && Number(this.impactId) <= 0) ||
      (this.isInternal &&
        Number(this.internalReviewerIdFromDropdown) <= 0 &&
        Number(this.externalReviewerIdFromInput) <= 0 &&
        Number(this.externalReviewerIdFromDropdown) <= 0)
    ) {
      console.log('Risk Response Value: ', this.riskResponseValue);
      console.log('Overall Risk Rating: ', this.overallRiskRating);
      console.log('Percentage Reduction: ', this.percentageRedution);
      console.log('Residual Risk: ', this.residualRisk);
      console.log('Residual Value: ', this.residualValue);
      console.log('Likelihood ID: ', this.likelihoodId);
      console.log('Impact ID: ', this.impactId);
      console.log(
        'Internal Reviewer ID: ',
        this.internalReviewerIdFromDropdown
      );
      console.log(
        'External Reviewer ID from input: ',
        this.externalReviewerIdFromInput
      );
      console.log(
        'External Reviewer ID from dropdown: ',
        this.externalReviewerIdFromDropdown
      );
      console.log(
        'External Reviewer ID from dropdown: ',
        this.overallRiskRatingBefore
      );

      console.log('Invalid numeric fields: Values must be greater than 0.');
      this.isValid = true;
      this.isLoading=false;
      return;
    }

    const payload = {
      closedDate: `${formValue.closeDate}T00:00:00.000Z`,
      riskResponseId: Number(this.riskResponseValue),
      riskStatus: 2,
      overallRiskRatingAfter: Number(this.overallRiskRating),
      percentageRedution: Number(this.percentageRedution),
      residualRisk: Number(this.residualRisk),
      residualValue: Number(this.residualValue),
      remarks: formValue.remarks || '',
      riskAssessments: [
        {
          likelihood: Number(this.likelihoodId),
          impact: Number(this.impactId),
          isMitigated: true,
          assessmentBasisId: null,
          riskFactor: Number(this.riskFactor),
          review: {
            userId:
              this.isInternal &&
              Number(this.internalReviewerIdFromDropdown) !== 0
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
            comments: '',
            reviewStatus: 3,
          },
        },
      ],
    };

    console.log(payload);
    this.submitForm.emit({ payload, riskType: this.riskTypeId });
    this.isLoading=false;
  }
  receiveCancel(value: any) {
    if (value == false) {
      this.isReviewerNotInList();
    }
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



  showModal = false;
    tableType = '';
    showResponseModel=false
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

  handleInfoClickResponse(event: boolean){
    this.showResponseModel=true

  }
  hideModalResponse() {
    this.showResponseModel = false;
  }
}
