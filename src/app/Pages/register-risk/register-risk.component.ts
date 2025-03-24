import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { QMSFormComponent } from '../../Components/qms-form/qms-form.component';
import { ISMSFormComponent } from '../../Components/isms-form/isms-form.component';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { Router } from '@angular/router';
import { EmailService } from '../../Services/email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';

@Component({
  selector: 'app-register-risk',
  standalone: true,
  imports: [
    BodyContainerComponent,
    QMSFormComponent,
    ISMSFormComponent,
    CommonModule,
    FormSuccessfullComponent,
    FormLoaderComponent,
  ],
  templateUrl: './register-risk.component.html',
  styleUrl: './register-risk.component.scss',
})
export class RegisterRiskComponent {
  isLoadingLoader: boolean = true;
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
  isLoading = false; // Initially false
  departmentCode: string = '';

  ngOnInit() {
    this.departmentName = this.authService.getDepartmentName()!;

    this.departmentId = this.authService.getDepartmentId()!;
    console.log('departttttt', this.departmentId);

    this.isAdmin = this.authService.getUserRole()!;
    console.log('roleeeeeeeee', this.isAdmin);

    this.api
      .getLikelyHoodDefinition()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Likelihood Definitions:', error);
          return of([]); // Return an empty array to prevent app crash
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataLikelihood = res;
        this.cdRef.detectChanges();
      });

    this.api
      .getImpactDefinition()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Impact Definitions:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataImpact = res;
        this.cdRef.detectChanges();
      });

    this.api
      .getProjects(this.departmentName)
      .pipe(
        catchError((error) => {
          console.error('Error fetching Projects:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataProject = res;
        this.cdRef.detectChanges();
      });

    this.api
      .getDepartment()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Departments:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataDepartment = res;
        console.log("datadropdown data",this.dropdownDataDepartment)
        console.log("departmentidisisis",this.departmentId)
      const departmentDataForDisplay=res.find(
        (factor:any) => factor.id == this.departmentId)
        console.log("data simple data data simple data",departmentDataForDisplay)
        this.departmentCode= departmentDataForDisplay.departmentCode
        console.log("code code code",this.departmentCode)
        this.cdRef.detectChanges();
      });

    this.api
      .getAllReviewer()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Reviewers:', error);
          return of({ reviewers: [] });
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataReviewer = res.reviewers;
        this.cdRef.detectChanges();
      });

    const departmentId: any = this.authService.getDepartmentId();
    this.api
      .getUsersByDepartmentId(departmentId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching Users by Department:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataAssignee = res;
        this.cdRef.detectChanges();
      });




      setTimeout(() => {
        this.isLoadingLoader = false; // Hide loader after delay
      }, 500); // 3 seconds delay





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
    this.isLoading = true;
    console.log('Payload received from child:', payload);
    if (payload.riskType == 1) {
      this.api.addnewQualityRisk(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('Risk saved successfully(Quality):', res);
          console.log('Generated Risk ID:', res.id);
          this.isSuccess = true;
          this.riskId = res.id;
          this.riskData = res;
          isSubmited = true;
          console.log('fgggggggggggggggggggg', res);

          this.sendEmailOnRegisterRisk(res.id, res);
          this.cdRef.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          this.isLoading = false;

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

          this.errorMessage = userFriendlyMessage.replace(/\n/g, '<br>');
          console.error('Error details:', error); // Keep debugging information in the console for developers
        },
      });
    } else if (payload.riskType == 2) {
      this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log(res);
          if (res.id) {
            this.isSuccess = true;
            this.riskId = res.id;
            this.riskData = res;
            console.log('response id for njnnmbhh security', this.riskId);
            isSubmited = true;
            this.sendEmailOnRegisterRisk(res.id, res);
            this.cdRef.detectChanges();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          this.isLoading = false;

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

          this.errorMessage = userFriendlyMessage.replace(/\n/g, '<br>');
          console.error('Error details:', error); // Keep debugging information in the console for developers
        },
      });
    } else {
      this.api.addnewSecurityOrPrivacyRisk(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('check res:', res);
          if (res.id) {
            console.log('res.id if ulill keri');
            this.isSuccess = true;
            this.riskId = res.id;
            this.riskData = res;
            isSubmited = true;
            this.sendEmailOnRegisterRisk(res.id, res);
            this.cdRef.detectChanges();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          this.isLoading = false;

          let userFriendlyMessage =
            'An unexpected error occurred. Please try again later.';

          if (error.status === 400) {
            // Handle validation errors
            if (error.error && error.error.errors) {
              const errorMessages = Object.values(error.error.errors)
                .flat()
                .join('\n');

              // Custom error messages for specific issues
              if (errorMessages.includes('The riskDto field is required')) {
                userFriendlyMessage =
                  'Please fill in all required fields before submitting.';
              } else if (
                errorMessages.includes(
                  'The JSON value could not be converted to System.DateTime'
                )
              ) {
                userFriendlyMessage =
                  'Invalid date format. Please select a valid date.';
              } else if (
                errorMessages.includes(
                  'The JSON value could not be converted to System.Int32'
                )
              ) {
                userFriendlyMessage =
                  'Invalid number input. Ensure all numerical fields contain valid numbers.';
              } else {
                userFriendlyMessage = errorMessages; // Show all validation errors
              }
            } else {
              userFriendlyMessage = error.error.message || userFriendlyMessage;
            }
          } else if (error.status === 500) {
            // Handle database/server errors
            userFriendlyMessage =
              error.error.message ||
              'A server error occurred. Please contact support.';

            if (error.error.details) {
              userFriendlyMessage += ` Details: ${error.error.details}`;
            }
          }

          // Show the error message in a popup
          this.errorMessage = userFriendlyMessage;

          console.error('Error details:', error); // Log for debugging
        },
      });
    }
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

    this.api
      .getProjects(departmentName)
      .pipe(
        catchError((error) => {
          console.error('Error fetching projects:', error);
          this.dropdownDataProjectForAdmin = [];
          return of([]); // Return empty array to handle the observable
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataProjectForAdmin = res;
        this.cdRef.detectChanges();
      });

    this.api
      .getAllUsersByDepartmentName(departmentName)
      .pipe(
        catchError((error) => {
          console.error('Error fetching users:', error);
          this.dropdownAssigneeForAdmin = [];
          return of([]); // Return empty array to handle the observable
        })
      )
      .subscribe((res: any) => {
        this.dropdownAssigneeForAdmin = res;
        this.cdRef.detectChanges();
      });
  }
  closeDialog() {
    this.isSuccess = false;
    this.isError = false;
    // this.router.navigate(['/home']);
  }

  closeDialogSuccess() {
    this.router.navigate(['/home']);
  }

  sendEmailOnRegisterRisk(riskId: number, riskData: any) {
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
            description: riskData.description,
            riskType:
              riskData.riskType === 1
                ? 'Quality'
                : this.riskData.riskType === 2
                ? 'Security'
                : 'Privacy',
            impact: riskData.impact,
            mitigation: riskData.mitigation,
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
