import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../../Services/email.service';
import { NgIf } from '@angular/common';
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './approved-response.component.html',
  styleUrl: './approved-response.component.scss',
})
export class ThankyouComponent {
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private email: EmailService,
    private notification: NotificationService
  ) {
    this.ApprovalForm = this.fb.group({
      reason: ['', Validators.required],
    });
  }
  riskId: number = 0;
  approvalStatus: string | null = null;
  ApprovalComments: string = '';
  riskData: any;
  context: any;

  ApprovalForm: FormGroup;
  isReasonSubmitted: boolean = false;

  // Getter for form control
  get reasonControl() {
    return this.ApprovalForm.get('reason');
  }
  isSubmitting = false;

  submitReason(): void {
    if (this.ApprovalForm.invalid) {
      this.ApprovalForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    this.ApprovalComments = this.ApprovalForm.value.reason;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.riskId = idParam ? +idParam : 0;
    this.approvalStatus = 'Approved';
    const approvalUpdates = {
      approvalStatus: 'Approved',
      comments: this.ApprovalComments,
    };

    this.api.updateReviewStatusAndComments(this.riskId, approvalUpdates).subscribe({
      next: () => {
        this.isReasonSubmitted = true;

        this.api.getRiskById(this.riskId).subscribe((res: any) => {
          console.log('risk status:', res.riskStatus);

          const impact = res.impact;
          const mitigation = res.mitigation;

          const reviewerName = res.riskAssessments &&
                              res.riskAssessments.length > 0 &&
                              res.riskAssessments[0].review ?
                              res.riskAssessments[0].review.reviewerName :
                              'External Reviewer';

          if (res.riskStatus === 'open') {
            const context = {
              responsibleUser: res.responsibleUser.fullName,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType,
              impact: impact,
              mitigation: mitigation,
              plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
              overallRiskRating: res.overallRiskRating,
              riskStatus: res.riskStatus,
              approvedBy: reviewerName,
              comments: this.ApprovalComments,
            };

            console.log('context:', context);

            this.email.sendAssigneeEmail(res.responsibleUser.email, context).subscribe({
              next: () => {
                console.log('Assignee email sent successfully');

                this.api.getriskOwnerEmailandName(this.riskId).subscribe({
                  next: (ownerRes: any) => {
                    this.email.sendApprovalEmail(ownerRes[0].email, context).subscribe({
                      next: () => {
                        console.log('Risk Owner approval email sent successfully');
                        this.notification.success('The risk has been approved successfully and emails sent to assignee and risk owner');
                      },
                      error: (emailError) => {
                        console.error('Failed to send approval email to risk owner:', emailError);
                        this.notification.success('The risk has been approved successfully and email sent to assignee');
                      }
                    });
                  },
                  error: (error) => {
                    console.error('Failed to get risk owner details:', error);
                    this.notification.success('The risk has been approved successfully and email sent to assignee');
                  }
                });
              },
              error: (emailError) => {
                console.error('Failed to send email to assignee:', emailError);
                this.notification.success('The risk has been approved successfully');
              }
            });
          }

          if (res.riskStatus === 'close') {
            const reviewerName = res.riskAssessments &&
                               res.riskAssessments.length > 0 &&
                               res.riskAssessments[0].review ?
                               res.riskAssessments[0].review.reviewerName :
                               'External Reviewer';

            const closureContext = {
              responsibleUser: res.responsibleUser.fullName,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType,
              impact: impact,
              mitigation: mitigation,
              plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
              overallRiskRating: res.overallRiskRating,
              riskStatus: res.riskStatus,
              verifiedBy: reviewerName,
              verificationComments: this.ApprovalComments
            };

            const closureContextOwner = {
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType: res.riskType,
              impact: impact,
              mitigation: mitigation,
              plannedActionDate: new Date(res.plannedActionDate).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
              overallRiskRating: res.overallRiskRating,
              verifiedBy: reviewerName,
              verificationComments: this.ApprovalComments
            };

            this.api.getriskOwnerEmailandName(this.riskId).subscribe({
              next: (ownerRes: any) => {
                this.email.sendRiskClosureEmail(ownerRes[0].email, closureContextOwner).subscribe({
                  next: () => {
                    console.log('Risk closure email sent to owner successfully');

                    this.email.sendRiskClosureEmail(res.responsibleUser.email, closureContext).subscribe({
                      next: () => {
                        console.log('Risk closure email sent to assignee successfully');
                        this.notification.success(
                          'The risk has been approved and closed successfully. Closure notifications sent to owner and assignee.'
                        );
                      },
                      error: (emailError) => {
                        console.error('Failed to send closure email to assignee:', emailError);
                        this.notification.success(
                          'The risk has been approved and closed successfully. Closure notification sent to owner only.'
                        );
                      }
                    });
                  },
                  error: (emailError) => {
                    console.error('Failed to send closure email to owner:', emailError);
                    this.notification.success(
                      'The risk has been approved and closed successfully, but email notifications failed.'
                    );
                  }
                });
              },
              error: (error) => {
                console.error('Failed to get risk owner details:', error);
                this.notification.success(
                  'The risk has been approved and closed successfully but email notifications could not be sent'
                );
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        this.notification.error('Failed to approve risk');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });

    console.log('Risk ID:', this.riskId);
    console.log('Approval Status', this.approvalStatus);
    console.log('Approval Comment:', this.ApprovalComments);
  }
}

