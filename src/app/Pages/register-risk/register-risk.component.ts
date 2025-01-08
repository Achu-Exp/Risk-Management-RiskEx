import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { QMSFormComponent } from '../../Components/qms-form/qms-form.component';
import { ISMSFormComponent } from '../../Components/isms-form/isms-form.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { Router } from '@angular/router';
import { EmailService } from '../../Services/email.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [
    BodyContainerComponent,
    QMSFormComponent,
    ISMSFormComponent,
    CommonModule,
    FormSuccessfullComponent,
  ],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss',
})
export class RegisterRiskComponent {
  reviewer: any;
  context: any;

  constructor(
    private api: ApiService,
    public authService: AuthService,
    private cdRef: ChangeDetectorRef,
    public email: EmailService,
    private router: Router
  ) {}
  receivedDepartmentIdForAdmin: number = 0;
  bgColor: string = '';
  selectedRiskType: number = 1;
  departmentName: string = '';
  departmentId: string = '';
  isAdmin: string = '';
  dropdownDataLikelihood: any[] = [];
  dropdownDataImpact: any[] = [];
  dropdownDataProject: any[] = [];
  dropdownDataDepartment: any[] = [];
  dropdownDataAssignee: any[] = [];
  dropdownDataReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  dropdownDataProjectForAdmin: any[] = [];
  dropdownAssigneeForAdmin: any[] = [];
  isSuccess: boolean = false;
  isError: boolean = false;
  riskId: number = 0;
  error: string = '';
  errorMessage: string = '';
  errorDetails: string = '';
  riskData: any;

  ngOnInit() {
    this.departmentName = this.authService.getDepartmentName()!;

    this.departmentId = this.authService.getDepartmentId()!;

    this.isAdmin = this.authService.getUserRole()!;
    console.log(this.isAdmin);


  this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
    this.dropdownDataLikelihood=res;
  })

  this.api.getImpactDefinition().subscribe((res:any)=>{
    this.dropdownDataImpact=res
  })

  this.api.getProjects(this.departmentName).subscribe((res:any)=>{
    this.dropdownDataProject=res
  })

  this.api.getDepartment().subscribe((res:any)=>{
    this.dropdownDataDepartment=res
  })

  this.api.getAllReviewer().subscribe((res:any)=>{
    this.dropdownDataReviewer=res.reviewers
  })

  this.api.getAllUsersByDepartmentName(this.departmentName).subscribe((res:any)=>{
    this.dropdownDataAssignee=res
    console.log("departments",res)
  })

  this.cdRef.detectChanges();

}

  riskTypes = [
    { type: 'Quality', value: 1 },
    { type: 'Security', value: 2 },
    { type: 'Privacy', value: 3 },
  ];

  setRiskType(riskValue: number) {
    this.selectedRiskType = riskValue;
  }

  onFormSubmit(payload: any) {
    let isSubmited = false;
    console.log('Payload received from child:', payload);
    if (payload.riskType == 1) {
      this.api.addnewQualityRisk(payload).subscribe({
        next: (res: any) => {
          console.log('Risk saved successfully(Quality):', res);
          console.log('Generated Risk ID:', res.id);
          this.isSuccess = true;
          this.riskId = res.id;
          this.riskData = res;
          isSubmited = true;
          this.sendEmailOnRegisterRisk(res.id,res);
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;

          let userFriendlyMessage =
            'An unexpected error occurred. Please try again later.';

          if (error.status === 400) {
            // Handle validation errors
            if (error.error && error.error.errors) {
              const errorMessages = Object.values(error.error.errors)
                .flat()
                .join('\n'); // Show all validation errors line by line

              // Provide specific messages for certain errors
              if (errorMessages.includes('The riskDto field is required')) {
                userFriendlyMessage = 'Please fill in all required fields.';
              } else if (
                errorMessages.includes(
                  'The JSON value could not be converted to System.DateTime'
                )
              ) {
                userFriendlyMessage =
                  'The date format for the Planned Action Date is invalid. Please provide a valid date.';
              } else {
                userFriendlyMessage = errorMessages;
              }
            } else {
              userFriendlyMessage = error.error.message || userFriendlyMessage;
            }
          } else if (error.status === 500) {
            // Handle database errors
            userFriendlyMessage =
              error.error.message ||
              'A server error occurred. Please contact support.';

            if (error.error.details) {
              userFriendlyMessage += ` Details: ${error.error.details}`;
            }
          }

          this.errorMessage = userFriendlyMessage;
          console.error('Error details:', error); // Keep debugging information in the console for developers
        },
      });
    } else if (payload.riskType == 2) {
      this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.id) {
            this.isSuccess = true;
            this.riskId = res.id;
            this.riskData = res;
            console.log('response id for njnnmbhh security', this.riskId);
            isSubmited = true;
            this.sendEmailOnRegisterRisk(res.id,res);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;

          let userFriendlyMessage =
            'An unexpected error occurred. Please try again later.';

          if (error.status === 400) {
            // Handle validation errors
            if (error.error && error.error.errors) {
              const errorMessages = Object.values(error.error.errors)
                .flat()
                .join('\n'); // Show all validation errors line by line

              // Provide specific messages for certain errors
              if (errorMessages.includes('The riskDto field is required')) {
                userFriendlyMessage = 'Please fill in all required fields.';
              } else if (
                errorMessages.includes(
                  'The JSON value could not be converted to System.DateTime'
                )
              ) {
                userFriendlyMessage =
                  'The date format for the Planned Action Date is invalid. Please provide a valid date.';
              } else {
                userFriendlyMessage = errorMessages;
              }
            } else {
              userFriendlyMessage = error.error.message || userFriendlyMessage;
            }
          } else if (error.status === 500) {
            // Handle database errors
            userFriendlyMessage =
              error.error.message ||
              'A server error occurred. Please contact support.';

            if (error.error.details) {
              userFriendlyMessage += ` Details: ${error.error.details}`;
            }
          }

          this.errorMessage = userFriendlyMessage;
          console.error('Error details:', error); // Keep debugging information in the console for developers
        },
      });
    } else {
      this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
        next: (res: any) => {
          console.log('check res:', res);
          if (res.id) {
            console.log('res.id if ulill keri');
            this.isSuccess = true;
            this.riskId = res.id;
            this.riskData = res;
            isSubmited = true;
            this.sendEmailOnRegisterRisk(res.id,res);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;

          let userFriendlyMessage =
            'An unexpected error occurred. Please try again later.';

          if (error.status === 400) {
            // Handle validation errors
            if (error.error && error.error.errors) {
              const errorMessages = Object.values(error.error.errors)
                .flat()
                .join('\n'); // Show all validation errors line by line

              // Provide specific messages for certain errors
              if (errorMessages.includes('The riskDto field is required')) {
                userFriendlyMessage = 'Please fill in all required fields.';
              } else if (
                errorMessages.includes(
                  'The JSON value could not be converted to System.DateTime'
                )
              ) {
                userFriendlyMessage =
                  'The date format for the Planned Action Date is invalid. Please provide a valid date.';
              } else {
                userFriendlyMessage = errorMessages;
              }
            } else {
              userFriendlyMessage = error.error.message || userFriendlyMessage;
            }
          } else if (error.status === 500) {
            // Handle database errors
            userFriendlyMessage =
              error.error.message ||
              'A server error occurred. Please contact support.';

            if (error.error.details) {
              userFriendlyMessage += ` Details: ${error.error.details}`;
            }
          }

          this.errorMessage = userFriendlyMessage;
          console.error('Error details:', error); // Keep debugging information in the console for developers
        },
      });


      

    }
   
  }

  getRiskTypeClass() {
    if (this.selectedRiskType === 1) {
      this.bgColor = 'var(--quality-color)';
      return 'risk-type-1';
    } else if (this.selectedRiskType === 2) {
      this.bgColor = 'var(--security-color)';
      return 'risk-type-2';
    } else if (this.selectedRiskType === 3) {
      this.bgColor = 'var(--privacy-color)';
      return 'risk-type-3';
    }
    return ''; // Default or no class
  }

  receiveValue(value: any) {
    this.receivedDepartmentIdForAdmin = value;
    console.log(
      'this.receivedDepartmentIdForAdmin',
      this.receivedDepartmentIdForAdmin
    );
    const departmentData = this.dropdownDataDepartment.find(
      (factor) => Number(factor.id) === this.receivedDepartmentIdForAdmin
    );
    console.log(departmentData);

    const departmentName = departmentData.departmentName;
    console.log('department name from child', departmentName);

    this.api.getProjects(departmentName).subscribe(
      (res: any) => {
        this.dropdownDataProjectForAdmin = res;
      },
      (error: any) => {
        this.dropdownDataProjectForAdmin = [];
      }
    );
    this.api.getAllUsersByDepartmentName(departmentName).subscribe(
      (res: any) => {
        this.dropdownAssigneeForAdmin = res;
      },
      (error: any) => {
        this.dropdownAssigneeForAdmin = [];
      }
    );
  }
  closeDialog() {
    this.isSuccess = false;
    this.isError = false;
    // this.router.navigate(['/home']);
  }


  sendEmailOnRegisterRisk(riskId:number,riskData:any){
      console.log('before is submit:', this.isSuccess);
      if (this.isSuccess) {
        console.log('after is submit');
        // Fetch reviewer details
        this.api.getRevieverDetails(riskId, 'ReviewPending').subscribe({
          next: (r: any) => {
            const reviewer = r[0].fullName;
            console.log('Reviewer Details:', reviewer);

           const context = {
              responsibleUser: reviewer,
              riskId: riskData.riskId,
              riskName: riskData.riskName,
              description:riskData.description,
              riskType:
                riskData.riskType === 1
                  ? 'Quality'
                  : this.riskData.riskType === 2
                  ? 'Security'
                  : 'Privacy',
              impact:riskData.impact,
              mitigation:riskData.mitigation,
              plannedActionDate: new Date(
                riskData.plannedActionDate
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              overallRiskRating: riskData.overallRiskRatingBefore,
              // reason:riskData.riskAssessments[0].review.comments,
              id: riskData.id,
              rid: riskData.id,
            };
            console.log('Email Context:', context);
            console.log('Reviewer Email:', r[0].email);

            // Send email to reviewer
            this.email.sendReviewerEmail(r[0].email, context).subscribe({
              next: () => {
                console.log('Reviewer Email:', r[0].email);
                console.log('Email Sent Successfully.');
              },
              error: (emailError) => {
                console.error('Failed to send email to reviewer:', emailError);
              },
            });
          },
          error: (reviewerError) => {
            console.error('Failed to fetch reviewer details:', reviewerError);
          },
        });
      }

  }
}
