import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { EmailService } from '../../Services/email.service';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
  assignee:any;
  // updates:any={};
  //"SI NO",
  headerDisplayMap: { [key: string]: string } = {
    riskId: 'Risk ID',
    riskName: 'Risk Name',
    description: 'Description',
    riskType: 'Risk Type',
    riskDepartment: 'Department',
    departmentName: 'Department',
    plannedActionDate: 'Planned Action Date',
    overallRiskRating: 'CRR',
    riskStatus: 'Risk Status',
    reviewerName: 'Reviewer',
    reviewerDepartment: 'Reviewer Department',
  };

  tableBodyAdmin: any[] = [
    {
      riskId: '',
      riskName: '',
      description: '',
      riskType: '',
      riskDepartment: 'N/A',
      plannedActionDate: Date,
      overallRiskRating: 0,
      riskStatus: '',
      reviewerName: 'N/A',
      reviewerDepartment: 'N/A',
    },
  ];
  tableBody: any[] = [
    {
      riskId: '',
      riskName: '',
      description: '',
      riskType: '',
      plannedActionDate: Date,
      overallRiskRating: 0,
      departmentName: '',
      riskStatus: '',
    },
  ];

  commentForm: any;
  isButtonClicked: boolean = false;
  cancelMessage: string = '';
  approveMessage: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public email:EmailService
    
  ) {}

  ngOnInit(): void {
    const role = this.auth.getUserRole(); // Fetch user role
    this.isAdmin = role === 'Admin';
    if (this.isAdmin) {
      this.headerData = [
        'riskId',
        'riskName',
        'description',
        'riskType',
        'riskDepartment',
        'plannedActionDate',
        'overallRiskRating',
        'riskStatus',
        'reviewerName',
        'reviewerDepartment',
      ];

      this.api.getAllRisksTobeReviewed().subscribe((response: any) => {
        this.tableBodyAdmin = response || [];
        console.log("admin tablebody:",this.tableBodyAdmin);

        
      });
    } else {
      this.headerData = [
        'riskId',
        'riskName',
        'description',
        'riskType',
        'plannedActionDate',
        'overallRiskRating',
        'departmentName',
        'riskStatus',
      ];
      this.api.getRisksByReviewerId().subscribe((response: any) => {
        console.log('API Response:', response);
      
        if (Array.isArray(response)) {
          this.tableBody = response;
        } else {
          console.error('Expected an array but got:', response);
          this.tableBody = []; // Default to an empty array if the response is not valid
        }
      
        console.log('tableBody:', this.tableBody);
      });
      
    }
  }

  OnClickRow(rowData: any): void {
    this.router.navigate([`approvals/${rowData.id}`]);
    console.log('rowdata', rowData);
  }


  showApproveDialog = false;
  showRejectDialog = false;
  selectedRow: any;


  approveRisk(event: {row: any, comment: string}) {
    const updates = {
      approvalStatus: "Approved",
      comments: event.comment 
    };
    let id = event.row.id;
    this.api.updateReviewStatusAndComments(id,updates);
    this.api.getAssigneeByRiskId(id).subscribe((res:any)=>{
      this.assignee=res;
      // console.log(this.assignee);  
      const context = {
        responsibleUser: this.assignee.fullName,
        riskId: event.row.riskId,
        riskName: event.row.riskName,
        description: event.row.description,
        riskType:event.row.riskType,
        plannedActionDate:event.row.plannedActionDate,
        overallRiskRating:event.row.overallRiskRating,
        riskStatus:event.row.riskStatus
      };
      console.log("context:",context);
      this.email.sendAssigneeEmail(this.assignee.email,context).subscribe({
        next: () => {
          console.log('Assignee email sent successfully');
          // this.router.navigate(['/thankyou']);
        },
        error: (emailError) => {
          console.error('Failed to send email to assignee:', emailError);
          // Navigate to thank you page even if email fails
          // this.router.navigate(['/thankyou']);
        }
      })
      
    });


    // this.api.sendEmailToAssignee(id);    
    console.log('Approved:', event.row);
    console.log('Comment:', event.comment);
  }

  rejectRisk(event: {row: any, comment: string}) {
    const updates = {
      approvalStatus: "Rejected",
      comments: event.comment 
    };
    let id = event.row.id;
    this.api.updateReviewStatusAndComments(id,updates);
    this.api.getriskOwnerEmailandName(id).subscribe((res:any)=>{
      this.assignee=res;
      // console.log(this.assignee);  
      const context = {
        responsibleUser: res[0].name,
        riskId: event.row.riskId,
        riskName: event.row.riskName,
        description: event.row.description,
        riskType:event.row.riskType,
        plannedActionDate:event.row.plannedActionDate,
        overallRiskRating:event.row.overallRiskRating,
        riskStatus:event.row.riskStatus,
        reason:event.comment 
      };
      console.log("context:",context);
      this.email.sendOwnerEmail(res[0].email,context).subscribe({
        next: () => {
          console.log('owner email sent successfully');
          // this.router.navigate(['/thankyou']);
        },
        error: (emailError) => {
          console.error('Failed to send email to risk owner:', emailError);
          // Navigate to thank you page even if email fails
          // this.router.navigate(['/thankyou']);
        }
      })
      
    });
    console.log('Rejected:', event.row);
    console.log('Comment:', event.comment);
  }
}
