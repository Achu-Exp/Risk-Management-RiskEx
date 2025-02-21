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


  ngOnInit(){
    // console.log("initial data:",this.data);
    const role = this.auth.getUserRole(); // Fetch user role
    this.isAdmin = role === 'Admin';
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe(e=>{
      // console.log("Data=",e)
      this.data=e
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
      // Perform rejection logic here
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
              responsibleUser: res.createdBy.fullName,
              riskId: res.riskId,
              riskName: res.riskName,
              description: res.description,
              riskType:res.riskType,
              impact: res.impact,
              mitigation: res.mitigation,
              plannedActionDate:res.plannedActionDate,
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
          // Send email to reviewer
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

    } else {
      // console.log('Risk approved with comment:', event.comment);
      const updates = {
        approvalStatus: "Approved",
        comments: event.comment
      };
      this.notification.success("The risk has Approved successfully")
      let id = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.api.updateReviewStatusAndComments(id,updates).subscribe((res:any)=>{
        console.log("approval response:",res);
        
      });
      this.showButtons = false;
      this.api.getRiskById(id).subscribe((res:any)=>{
        if(res.riskStatus==='open'){
          const context = {
            responsibleUser: res.responsibleUser.fullName,
            riskId: res.riskId,
            riskName: res.riskName,
            description: res.description,
            riskType:res.riskType,
            plannedActionDate:new Date(res.plannedActionDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
            overallRiskRating:res.overallRiskRating,
            riskStatus:res.riskStatus
          };
          // console.log("context:",context);
          this.email.sendAssigneeEmail(res.responsibleUser.email,context).subscribe({
            next: () => {
              // console.log('Assignee email sent successfully');
              // this.router.navigate(['/thankyou']);

            },
            error: (emailError) => {
              console.error('Failed to send email to assignee:', emailError);
              // Navigate to thank you page even if email fails
              // this.router.navigate(['/thankyou']);
            }
          })
        }

      })



    }
    setTimeout(() => {
      this.router.navigate(['/approvaltable']);
    }, 1000);
  

  }

  handlePopupCancel() {
    this.isPopupOpen = false;
    // console.log('Popup canceled');
  }

}
