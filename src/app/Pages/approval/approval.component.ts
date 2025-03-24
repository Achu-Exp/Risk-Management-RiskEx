import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { RiskBasicDetailsCardComponent } from '../../Components/risk-basic-details-card/risk-basic-details-card.component';
import { RiskDetailsSection2Component } from '../../Components/risk-details-section2/risk-details-section2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { ConfirmationPopupComponent } from '../../Components/confirmation-popup/confirmation-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { EmailService } from '../../Services/email.service';
import { AuthService } from '../../Services/auth/auth.service';
import { RiskDetailsSection3MitigationComponent } from "../../Components/risk-details-section3-mitigation/risk-details-section3-mitigation.component";
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [
    BodyContainerComponent,
    RiskBasicDetailsCardComponent,
    RiskDetailsSection2Component,
    FormsModule,
    ReactiveFormsModule,
    StyleButtonComponent,
    ConfirmationPopupComponent, NgIf,
    RiskDetailsSection3MitigationComponent
],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent {
  data:any=[];
  isAdmin:boolean=false;
  showButtons:boolean=true;
  constructor(public api: ApiService, public route:ActivatedRoute, private email:EmailService,private auth:AuthService, private notification:NotificationService,private router:Router) {}
  isLoading=true
  basdicDetailsData:any={}
  riskDetailsSection2Data:any={}
  riskDetailsSection3MitigationData:any={}

  ngOnInit(){
    // console.log("initial data:",this.data);
    const role = this.auth.getUserRole(); // Fetch user role
    this.isAdmin = role === 'Admin';
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe(e=>{
      // console.log("Data=",e)
      this.data=e
      this.basdicDetailsData={
        riskNumber:this.data.riskNumber,
        riskType:this.data.riskType,
        riskDesc:this.data.riskDesc,
        riskName:this.data.riskName,
        overallRiskRating:this.data.overallRiskRating,
        riskStatus:this.data.riskStatus,
        isEditable:false,
        allData:this.data
      }

      this.riskDetailsSection2Data={
        riskMitigation:this.data.mitigation,
        riskContengency:this.data.contingency,
        responsibilityOfAction:this.data.responsibleUser.fullName        ,
        plannedActionDate:this.data.plannedActionDate,
        impact:this.data.impact,
        CreatedBy:this.data.createdBy.fullName,
        CreatedAt:this.data.createdAt,
        UpdatedBy:this.data.updatedBy.fullName,
        UpdatedAt:this.data.updatedAt,
        ReviewedBy:this.data.reviewedBy,
        ReviewedAt:this.data.reviewedAt,
        PostReviewedBy:this.data.postReviewedBy,
        PostReviewedAt:this.data.postReviewedAt,
        RiskStatus:this.data.riskStatus,
        ClosedDate:this.data.closedDate,
        RiskResponse:this.data.riskResponse,
        Remarks:this.data.remarks
      }

      this.riskDetailsSection3MitigationData={
        riskId:this.data.riskId,
        riskAssesments:this.data.riskAssessments,
        status:this.data.status,
        type:this.data.type,
        residualRisk:this.data.residualRisk,
        residualValue:this.data.residualValue,
        percentageReduction:this.data.percentageReduction,

      }
      // console.log("data description",this.data.description);
      this.isLoading=false
    });

  }



  isPopupOpen = false;
  popupTitle = '';
  popupConfirmText = '';
  showPopupComment = true;
  isPopupReject = false;


  isDataAvailable(): boolean {
    return this.data && Object.keys(this.data).length > 0;
  }


  openPopup(isReject: boolean) {
    this.isPopupOpen = true;
    this.isPopupReject = isReject;

    if (isReject) {
      this.popupTitle = 'Reject Risk';
      this.popupConfirmText = 'Reject';
    } else {
      this.popupTitle = 'Approve Risk';
      this.popupConfirmText = 'Approve';
    }
  }

  handlePopupConfirm(event: { comment: string }) {
    this.isPopupOpen = false;

    if (this.isPopupReject) {
      // console.log('Risk rejected with comment:', event.comment);
      const updates = {
        approvalStatus: "Rejected",
        comments: event.comment
      };
      this.notification.success("The risk has been Rejected ")
      let id = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.api.updateReviewStatusAndComments(id,updates);
      this.showButtons = false;
      this.api.getRiskById(id).subscribe((res:any)=>{
        if(res.riskStatus==='open' || res.riskStatus==='close'){

            const context = {
              reviewer: this.auth.getUserName(),
              responsibleUser: res.createdBy.fullName,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType:res.riskType,
              impact: res.impact,
              mitigation: res.mitigation,
              plannedActionDate:new Date(res.plannedActionDate )
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              overallRiskRating:res.overallRiskRating,
              riskStatus:res.riskStatus,
              reason:event.comment
            };
            console.log("context:",context);
            this.email.sendOwnerEmail(res.createdBy.email,context).subscribe({
              next: () => {
                // console.log('owner email sent successfully');
                // this.router.navigate(['/approvaltable']);
              },
              error: (emailError) => {
                console.error('Failed to send email to risk owner:', emailError);

              }
            })


        }
        if(res.riskStatus === 'close'){

          const context = {
            reviewer: this.auth.getUserName(),
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
            reason: event.comment,
          };
          this.email.sendOwnerEmail(res.responsibleUser.email, context).subscribe({
            next: () => {
              // console.log('Reviewer Email:', res.responsibleUser.email);
              // console.log('Email Sent Successfully.');
            },
            error: (emailError) => {
              console.error('Failed to send email to reviewer:', emailError);
            },
          });

        }
      })

    }else {
      const updates = {
        approvalStatus: "Approved",
        comments: event.comment
      };
      this.notification.success("The risk has been Approved successfully");
      let id = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.api.updateReviewStatusAndComments(id, updates).subscribe((updateRes: any) => {
        this.showButtons = false;

        this.api.getRiskById(id).subscribe((res: any) => {
          if(res.riskStatus === 'open') {
            const context = {
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
              riskStatus: res.riskStatus,
              approvedBy: this.auth.getUserName(),
              comments: event.comment
            };

            this.email.sendAssigneeEmail(res.responsibleUser.email, context).subscribe({
              next: () => {
                console.log('Assignee email sent successfully');

                this.api.getriskOwnerEmailandName(id).subscribe({
                  next: (ownerRes: any) => {
                    this.email.sendApprovalEmail(ownerRes[0].email, context).subscribe({
                      next: () => {
                        console.log('Risk owner approval email sent successfully');
                      },
                      error: (emailError) => {
                        console.error('Failed to send approval email to risk owner:', emailError);
                      }
                    });
                  },
                  error: (error) => {
                    console.error('Failed to get risk owner details:', error);
                  }
                });
              },
              error: (emailError) => {
                console.error('Failed to send email to assignee:', emailError);
              }
            });
          } else if(res.riskStatus === 'close') {
            const closureContext = {
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
              riskStatus: res.riskStatus,
              verifiedBy: this.auth.getUserName(),
              verificationComments: event.comment
            };

            const closureContextOwner = {
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
              verifiedBy: this.auth.getUserName(),
              verificationComments: event.comment
            };

            this.api.getriskOwnerEmailandName(id).subscribe({
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
      });
    }

    setTimeout(() => {
      this.router.navigate(['/approvaltable']);
    }, 2000);
  }

  handlePopupCancel() {
    this.isPopupOpen = false;
    // console.log('Popup canceled');
  }

}
