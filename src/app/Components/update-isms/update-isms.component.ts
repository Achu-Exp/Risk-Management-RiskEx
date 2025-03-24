import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  selector: 'app-update-isms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './update-isms.component.html',
  styleUrl: './update-isms.component.scss',
})
export class UpdateIsmsComponent {
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
  riskResponseValue: number = 0;
  reviewerNotInList: boolean = false;
  internalReviewerIdFromDropdown: number = 0;
  externalReviewerIdFromDropdown: number = 0;
  isInternal: boolean = true;
  externalReviewerIdFromInput: number = 0;
  residualValue: number = 0;
  percentageRedution: number = 0;
  residualRisk: number = 0;
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

  isSuccessReviewer: boolean = false;
  isErrorReviewer: boolean = false;
  HeatMapRefernce: boolean = false;
  openDropdownId: string | undefined = undefined;

  isCancel: boolean = false;
  isSave: boolean = false;
  isValid: boolean = false;

  newReviewername: string = '';
  isnewReviewernameDisplay: boolean = false;
  isLoading = false; // Initially false

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private api: ApiService,
    private router: Router
  ) {}

  // handleDropdownOpen(dropdownId: string) {

  //     this.openDropdownId === dropdownId ? undefined : dropdownId;
  // }

  handleDropdownOpen(dropdownId: string | undefined): void {

    this.openDropdownId = dropdownId;
  }
  isReviewerNotInList() {
    this.reviewerNotInList = !this.reviewerNotInList;
  }
  isHeatMapReference() {
    this.HeatMapRefernce = !this.HeatMapRefernce;
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
    console.log("vvvvvvvvvvvvvvvvvvvv",this.riskResponseValue)

    if (
      !formValue.closeDate ||
      this.riskResponseValue <= 0 ||
      this.overallRiskRating <= 0 ||
      this.percentageRedution <= 0 ||
      this.residualRisk <= 0 ||
      this.residualValue <= 0 ||
      Number(this.confidentialityLikelihoodId) <= 0 ||
      Number(this.confidentialityImpactId) <= 0 ||
      Number(this.integrityLikelihoodId) <= 0 ||
      Number(this.integrityImpactId) <= 0 ||
      Number(this.availabilityLikelihoodId) <= 0 ||
      Number(this.availabilityImpactId) <= 0 ||
      Number(this.privacyLikelihoodId) <= 0 ||
      Number(this.privacyImpactId) <= 0 ||
      (this.isInternal &&
        Number(this.internalReviewerIdFromDropdown) <= 0 &&
        Number(this.externalReviewerIdFromInput) <= 0 &&
        Number(this.externalReviewerIdFromDropdown) <= 0)
    ) {
      console.log(
        'Invalid Input: Please ensure all required fields have valid values.'
      );
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
          likelihood: Number(this.confidentialityLikelihoodId),
          impact: Number(this.confidentialityImpactId),
          isMitigated: true,
          assessmentBasisId: 1,
          riskFactor: Number(this.confidentialityRiskFactor),
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
        {
          likelihood: Number(this.integrityLikelihoodId),
          impact: Number(this.integrityImpactId),
          isMitigated: true,
          assessmentBasisId: 2,
          riskFactor: Number(this.integrityRiskFactor),
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
        {
          likelihood: Number(this.availabilityLikelihoodId),
          impact: Number(this.availabilityImpactId),
          isMitigated: true,
          assessmentBasisId: 3,
          riskFactor: Number(this.availabilityRiskFactor),
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
        {
          likelihood: Number(this.privacyLikelihoodId),
          impact: Number(this.privacyImpactId),
          isMitigated: true,
          assessmentBasisId: 4,
          riskFactor: Number(this.privacyRiskFactor),
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
  showTooltipLikelihood:boolean=false;
  showTooltipImpact:boolean=false;
  showResponseModel=false

  showTable(type: string) {
    this.tableType = type;
    this.showModal = true;
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
