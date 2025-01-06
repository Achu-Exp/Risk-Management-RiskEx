import { Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
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
    private route: ActivatedRoute
    
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

  // formatDate(value: any): string {
  //   if (!value) return '';
    
  //   if (typeof value === 'string' && value.includes('-')) {
  //     const date = new Date(value);
  //     if (!isNaN(date.getTime())) {
  //       const day = String(date.getDate()).padStart(2, '0');
  //       const month = String(date.getMonth() + 1).padStart(2, '0'); 
  //       const year = date.getFullYear();
  //       return `${day}-${month}-${year}`;
  //     }
  //   }
  //   return value;
  // }

  approveRisk(event: {row: any, comment: string}) {
    const updates = {
      approvalStatus: "Approved",
      comments: event.comment 
    };
    let id = event.row.id;
    this.api.updateReviewStatusAndComments(id,updates);
    this.api.sendEmailToAssignee(id);
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
    console.log('Rejected:', event.row);
    console.log('Comment:', event.comment);
  }
}
