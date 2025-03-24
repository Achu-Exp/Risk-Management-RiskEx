import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { EmailService } from '../../Services/email.service';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-rejected-response',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './rejected-response.component.html',
  styleUrl: './rejected-response.component.scss',
})
export class RejectedResponseComponent {
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private email: EmailService,
    private notification: NotificationService
  ) {
    this.rejectionForm = this.fb.group({
      reason: ['', Validators.required],
    });
  }
  riskId: number = 0;
  approvalStatus: string | null = null;
  rejectionReason: string = '';
  riskData: any;
  context: any;

  rejectionForm: FormGroup;
  isReasonSubmitted: boolean = false;

  // Getter for form control
  get reasonControl() {
    return this.rejectionForm.get('reason');
  }
  isSubmitting = false;

  submitReason(): void {
    if (this.rejectionForm.invalid) {
      this.rejectionForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;


    this.rejectionReason = this.rejectionForm.value.reason;
    console.log('Rejection Reason:', this.rejectionReason);
    // this.isReasonSubmitted = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus = 'Rejected';

      const rejectionUpdates = {
        approvalStatus: 'Rejected',
        comments : this.rejectionReason
      }
      this.api.updateReviewStatusAndComments(this.riskId, rejectionUpdates).subscribe({
        next: () => {
          console.log('Risk ID:', this.riskId);
          console.log('Approval Status', this.approvalStatus);
          this.api.getRiskById(this.riskId).subscribe((res: any) => {
            this.riskData = res;
            
            const reviewerName = res.riskAssessments &&
                                 res.riskAssessments.length > 0 &&
                                 res.riskAssessments[0].review ?
                                 res.riskAssessments[0].review.reviewerName :
                                 'External Reviewer';

            if (res.riskStatus === 'open' || res.riskStatus === 'close') {
              this.context = {
                reviewer: reviewerName,
                responsibleUser: res.createdBy.fullName,
                riskId: res.riskId,
                riskName: res.riskName,
                description: res.description,
                riskType: res.riskType,
                impact: res.impact,
                mitigation: res.mitigation,
                plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: res.overallRiskRating,
                reason: this.rejectionReason,
              };
              this.email.sendOwnerEmail(res.createdBy.email, this.context).subscribe({
                next: () => {
                  console.log('Reviewer Email:', res.createdBy.email);
                  console.log('Email Sent Successfully.');
                },
                error: (emailError) => {
                  console.error('Failed to send email to reviewer:', emailError);
                },
              });
            }
            if(res.riskStatus === 'close'){

              this.context = {
                reviewer: reviewerName,
                responsibleUser: res.responsibleUser.fullName,
                riskId: res.riskId,
                riskName: res.riskName,
                description: res.description,
                riskType: res.riskType,
                impact: res.impact,
                mitigation: res.mitigation,
                plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
                overallRiskRating: res.overallRiskRating,
                reason: this.rejectionReason,
              };
              this.email.sendOwnerEmail(res.responsibleUser.email, this.context).subscribe({
                next: () => {
                  console.log('Reviewer Email:', res.responsibleUser.email);
                  console.log('Email Sent Successfully.');
                },
                error: (emailError) => {
                  console.error('Failed to send email to reviewer:', emailError);
                },
              });

            }
          });
          this.isReasonSubmitted = true;
        },error: (error) => {
          console.error('Error updating review status:', error);
          this.notification.error('Failed to Reject risk');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });

  }

  ngOnInit() {

  }
}
