import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { UpdateQmsComponent } from "../../Components/update-qms/update-qms.component";
import { UpdateIsmsComponent } from "../../Components/update-isms/update-isms.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormSuccessfullComponent } from '../../Components/form-successfull/form-successfull.component';
import { EmailService } from '../../Services/email.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-update-risk',
  standalone: true,
  imports: [
    BodyContainerComponent,
    UpdateQmsComponent,
    UpdateIsmsComponent,
    CommonModule,
    FormSuccessfullComponent,
  ],
  templateUrl: './update-risk.component.html',
  styleUrl: './update-risk.component.scss',
})
export class UpdateRiskComponent {

riskId: string='';
riskType: string='';
riskTypeId:number=0
overallRiskRatingBefore:number=0
departmentName:string=''
departmentId:string='';
dropdownDataLikelihood: any[] = []
dropdownDataImpact:any[]=[]
dropdownDataDepartment:any[]=[]
dropdownDataReviewer: Array<{ id: number; fullName: string; email: string; type: string }> = [];
riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
isSuccess:boolean=false
isError:boolean=false
error:string=''
riskData:any
context:any
reviewer:any

constructor(private route: ActivatedRoute,private api:ApiService,private router: Router,public email:EmailService, public authService: AuthService,
  private cdRef: ChangeDetectorRef,) {}

ngOnInit(){
  this.route.queryParams.subscribe(params =>{
    this.riskId = params['riskId'];
    this.riskType = params['riskType'];
    this.overallRiskRatingBefore = params['overallRiskRatingBefore'];


  });
  if( this.riskType='Quality'){
    this.riskTypeId=1
  }else if(this.riskType='Security'){
    this.riskTypeId=2
  }else{
    this.riskTypeId=3

  }


  // this.api.getLikelyHoodDefinition().subscribe((res:any)=>{
  //   this.dropdownDataLikelihood=res;
  // })

  // this.api.getImpactDefinition().subscribe((res:any)=>{
  //   this.dropdownDataImpact=res
  // })

  // this.api.getAllReviewer().subscribe((res:any)=>{
  //   this.dropdownDataReviewer=res.reviewers
  // })

  // this.api.getRiskResponses().subscribe((res:any)=>{
  //   this.riskResponses=res
  // })
  // this.api.getDepartment().subscribe((res:any)=>{
  //   this.dropdownDataDepartment=res
  // })

  this.api.getRiskResponses().pipe(
    catchError((error) => {
      console.error('Error fetching Reviewer responses:', error);
      return of([]); // Return an empty array to prevent app crash
    })
  ).subscribe((res: any) => {
    this.riskResponses=res
    this.cdRef.detectChanges();
  });


  this.api.getLikelyHoodDefinition().pipe(
    catchError((error) => {
      console.error('Error fetching Likelihood Definitions:', error);
      return of([]); // Return an empty array to prevent app crash
    })
  ).subscribe((res: any) => {
    this.dropdownDataLikelihood = res;
    this.cdRef.detectChanges();
  });

  this.api.getImpactDefinition().pipe(
    catchError((error) => {
      console.error('Error fetching Impact Definitions:', error);
      return of([]);
    })
  ).subscribe((res: any) => {
    this.dropdownDataImpact = res;
    this.cdRef.detectChanges();
  });


  this.api.getDepartment().pipe(
    catchError((error) => {
      console.error('Error fetching Departments:', error);
      return of([]);
    })
  ).subscribe((res: any) => {
    this.dropdownDataDepartment = res;
    this.cdRef.detectChanges();
  });

  this.api.getAllReviewer().pipe(
    catchError((error) => {
      console.error('Error fetching Reviewers:', error);
      return of({ reviewers: [] });
    })
  ).subscribe((res: any) => {
    this.dropdownDataReviewer = res.reviewers;
    this.cdRef.detectChanges();
  });





}

onFormSubmit(event: { payload: any, riskType: number }) {
  const payload = event.payload;
  const riskType = event.riskType;

  // if (riskType == 1) {
  //   this.api.updateQualityRisk(payload,Number(this.riskId)).subscribe((res:any)=>{
  //     console.log("updated quality api response:",res)
  //     this.isSuccess=true

  //   },

  // (error:any)=>{
  //   this.isError=true
  //   this.error=error.message
  // })
  // console.log("riskid:",Number(this.riskId));

  if (riskType == 1) {
    this.api.updateQualityRisk(payload, Number(this.riskId)).subscribe({
      next: (res: any) => {
        console.log("Updated quality API response:", res);
        this.isSuccess = true;
      },
      error: (error: any) => {
        this.isError = true;
        this.error = error.message.replace(/\n/g, '<br>'); // Replace newlines with <br> for display
      },
      complete: () => {
        console.log("Update quality risk request completed.");
      }
    });
  console.log("riskid:",Number(this.riskId));

  // this.api.getRevieverDetails(Number(this.riskId)).subscribe({
  //   next: (r: any) => {
  //     console.log("reviewer details fetching");

  //     this.reviewer = r[0].fullName;
  //     console.log('Reviewer Details:', this.reviewer);
  //       const riskDetails=this.getRiskDetails(Number(this.riskId));
  //       console.log(riskDetails);

  //      this.context = {
  //       responsibleUser: this.reviewer,
  //       riskId: riskDetails.riskId,
  //       riskName: riskDetails.riskName,
  //       description: riskDetails.description,
  //       riskType: riskDetails.riskType ,
  //       impact: riskDetails.impact,
  //       mitigation: riskDetails.mitigation,
  //       plannedActionDate: new Date(riskDetails.plannedActionDate).toLocaleDateString('en-US', {
  //         year: 'numeric',
  //         month: 'long',
  //         day: 'numeric'
  //       }),
  //       overallRiskRating: riskDetails.overallRiskRatingBefore,
  //       id:riskDetails.id,
  //       rid:riskDetails.id
  //     };
  //     console.log('Email Context:', this.context);

  //     // Send email to reviewer
  //     this.email.sendReviewerEmail(r[0].email, this.context).subscribe({
  //       next: () => {
  //         console.log('Reviewer Email:', r[0].email);
  //         console.log('Email Sent Successfully.');
  //       },
  //       error: (emailError) => {
  //         console.error('Failed to send email to reviewer:', emailError);
  //       },
  //     });
  //   },
  //   error: (reviewerError) => {
  //     console.error('Failed to fetch reviewer details:', reviewerError);

  //   },
  // });
  }
  else if (riskType == 2 || riskType==3) {
    this.api.updateSecurityOrPrivacyRisk(payload, Number(this.riskId)).subscribe({
      next: (res: any) => {
        console.log("Updated security API response:", res);
        this.isSuccess = true;
      },
      error: (error: any) => {
        this.isError = true;
        this.error = error.message.replace(/\n/g, '<br>');
        console.error("Error updating security risk:", error);
      },
      complete: () => {
        console.log("Update security risk request completed.");
      }
    });
  }
  
  this.api.getRevieverDetails(Number(this.riskId),'ApprovalPending').subscribe({
    next: (r: any) => {
      console.log('reviewer details fetching');

      this.reviewer = r[0].fullName;
      console.log('Reviewer Details:', this.reviewer);
      this.api.getRiskById(Number(this.riskId)).subscribe((res:any)=>{
        this.riskData=res
        console.log("risk Data:",this.riskData);
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
          overallRiskRating: res.overallRiskRating,
          id: res.id,
          rid: res.id,
        };
        console.log('Email Context:', this.context);

        // Send email to reviewer
        this.email.sendReviewerEmail(r[0].email, this.context).subscribe({
          next: () => {
            console.log('Reviewer Email:', r[0].email);
            console.log('Email Sent Successfully.');
          },
          error: (emailError) => {
            console.error('Failed to send email to reviewer:', emailError);
          },
        });

      })
      // const riskDetails = this.getRiskDetails(Number(this.riskId));
      // console.log("risk Details after function call:",riskDetails);


    },
    error: (reviewerError) => {
      console.error('Failed to fetch reviewer details:', reviewerError);
    },
  });
}



  closeDialog() {
    this.isSuccess = false;
    this.isError = false;
    // this.router.navigate(['/home']);
  }
  getReviewerNameandEmail(
    id: number,
    status: string,
    callback: (reviewer: { name: string; email: string }) => void
  ) {
    this.api.getRevieverDetails(id, status).subscribe((e: any) => {
      const reviewer = {
        name: e[0]?.fullName || "Unknown",
        email: e[0]?.email || "Unknown",
      };
      callback(reviewer);
    });
  }

}
