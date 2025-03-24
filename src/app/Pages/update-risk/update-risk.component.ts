import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { UpdateQmsComponent } from '../../Components/update-qms/update-qms.component';
import { UpdateIsmsComponent } from '../../Components/update-isms/update-isms.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { EmailService } from '../../Services/email.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../Services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';

@Component({
  selector: 'app-update-risk',
  standalone: true,
  imports: [
    BodyContainerComponent,
    UpdateQmsComponent,
    UpdateIsmsComponent,
    CommonModule,
    FormSuccessfullComponent,
    FormLoaderComponent,
  ],
  templateUrl: './update-risk.component.html',
  styleUrl: './update-risk.component.scss',
})
export class UpdateRiskComponent {
  riskId: string = '';
  riskType: string = '';
  riskTypeId: number = 0;
  overallRiskRatingBefore: number = 0;
  departmentName: string = '';
  departmentId: string = '';
  dropdownDataLikelihood: any[] = [];
  dropdownDataImpact: any[] = [];
  dropdownDataDepartment: any[] = [];
  dropdownDataReviewer: Array<{
    id: number;
    fullName: string;
    email: string;
    type: string;
  }> = [];
  riskResponses: Array<{
    id: number;
    name: string;
    description: string;
    example: string;
    risks: string;
  }> = [];
  isSuccess: boolean = false;
  isError: boolean = false;
  error: string = '';
  riskData: any;
  context: any;
  reviewer: any;
  isLoading = false; // Initially false
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    public email: EmailService,
    public authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.riskId = params['riskId'];
      this.riskType = params['riskType'];
      this.overallRiskRatingBefore = params['overallRiskRatingBefore'];
    });
    if (this.riskType === 'Quality') {
      this.riskTypeId = 1;
    } else if (this.riskType === 'Security') {
      this.riskTypeId = 2;
    } else {
      this.riskTypeId = 3;
    }

    this.api
      .getRiskResponses()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Reviewer responses:', error);
          return of([]); // Return an empty array to prevent app crash
        })
      )
      .subscribe((res: any) => {
        this.riskResponses = res;
        this.cdRef.detectChanges();
      });

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
      .getDepartment()
      .pipe(
        catchError((error) => {
          console.error('Error fetching Departments:', error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.dropdownDataDepartment = res;
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
  }

  onFormSubmit(event: { payload: any; riskType: number }) {
    this.isLoading = true;
    const payload = event.payload;
    const riskType = event.riskType;

    if (riskType == 1) {
      this.api.updateQualityRisk(payload, Number(this.riskId)).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('Updated quality API response:', res);
          this.isSuccess = true;
          // this.sendReviewerMailOnClose();
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
          this.isLoading = false;

          // Extract error message from backend response
          this.error = error.error?.details
            ? error.error.details
            : 'An unexpected error occurred. Please try again.';

          console.error('Error updating risk:', error);

          // Show the error message in a popup
        },
        complete: () => {
          console.log('Update quality risk request completed.');
          this.sendReviewerMailOnClose();
        },
      });
      console.log('riskid:', Number(this.riskId));
    } else if (riskType == 2 || riskType == 3) {
      this.api
        .updateSecurityOrPrivacyRisk(payload, Number(this.riskId))
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            console.log('Updated security API response:', res);
            this.isSuccess = true;
            // this.sendReviewerMailOnClose();
          },
          error: (error: HttpErrorResponse) => {
            this.isError = true;
            this.isLoading = false;

            // Extract error message from backend response
            this.error = error.error?.message
              ? error.error.message
              : 'An unexpected error occurred. Please try again.';

            console.error('Error updating risk:', error);

            // Show the error message in a popup
          },
          complete: () => {
            console.log('Update security risk request completed.');
            this.sendReviewerMailOnClose();
          },
        });
    }
  }

  closeDialog() {
    this.isSuccess = false;
    this.isError = false;
    // this.router.navigate(['/home']);
  }

  closeDialogSuccess() {
    this.router.navigate(['/home']);
  }

  getReviewerNameandEmail(
    id: number,
    status: string,
    callback: (reviewer: { name: string; email: string }) => void
  ) {
    this.api.getRevieverDetails(id, status).subscribe((e: any) => {
      const reviewer = {
        name: e[0]?.fullName || 'Unknown',
        email: e[0]?.email || 'Unknown',
      };
      callback(reviewer);
    });
  }
  sendReviewerMailOnClose() {
    this.api
      .getRevieverDetails(Number(this.riskId), 'ApprovalPending')
      .subscribe((r: any) => {
        console.log('response on update to get reviewer details:', r);

        console.log('reviewer details fetching');

        this.reviewer = r[0].fullName;
        console.log('Reviewer Details:', this.reviewer);
        this.api.getRiskById(Number(this.riskId)).subscribe((res: any) => {
          this.riskData = res;
          console.log('risk Data:', this.riskData);
          this.context = {
            responsibleUser: this.reviewer,
            riskId: res.riskId,
            riskName: res.riskName,
            description: res.description,
            riskType: res.riskType,
            impact: res.impact,
            mitigation: res.mitigation,
            plannedActionDate: new Date(
              res.plannedActionDate
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            riskOwner:res.responsibleUser.fullName,
            overallRiskRating: res.overallRiskRating,
            riskresponse:res.riskResponse,
            id: res.id,
            rid: res.id,
          };
          console.log('Email Context:', this.context);

          // Send email to reviewer
          this.email.sendPostReviewerEmail(r[0].email, this.context).subscribe({
            next: () => {
              console.log('Reviewer Email:', r[0].email);
              console.log('Email Sent Successfully.');
            },
            error: (emailError) => {
              console.error('Failed to send email to reviewer:', emailError);
            },
          });
        });
      });
  }
}
