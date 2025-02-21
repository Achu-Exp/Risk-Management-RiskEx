import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { EmailService } from '../../Services/email.service';
import { NotificationService } from '../../Services/notification.service';
import { FormLoaderComponent } from "../../Components/form-loader/form-loader.component";

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent, FormLoaderComponent],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
  assignee:any;
  isLoading = false;
  isLoader = false;
  impact:string='';
  mitigation:string='';


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
  isEMT=false;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public email:EmailService,
    private cdr: ChangeDetectorRef,
    private notification:NotificationService

  ) {}


  private refreshTableDataAdmin(){
    this.isLoading = true;
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
    this.tableBodyAdmin = [
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
    ]

    this.api.getAllRisksTobeReviewed().subscribe((response: any) => {
      console.log("admin tablebody:",response);
      this.tableBodyAdmin = response ;
      this.isLoading = false;


    });


  }
  private refershTableData(){
    this.isLoading = true;
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
    this.tableBody= [
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
    ]
    this.api.getRisksByReviewerId(this.auth.getCurrentUserId()).subscribe((response: any) => {
      console.log('API Response:', response);
      this.tableBody=response;
      console.log('tableBody:', this.tableBody);
      this.isLoading = false;

    });
  }

  ngOnInit(): void {

    const role = this.auth.getUserRole();
    this.isAdmin = role === 'Admin';

    this.isLoading = true;
    if (this.isAdmin) {

      this.refreshTableDataAdmin();

    } else {
      this.refershTableData();

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
    this.isLoader =true;
    const updates = {
      approvalStatus: "Approved",
      comments: event.comment
    };
    let id = event.row.id;

    this.api.updateReviewStatusAndComments(id, updates).subscribe({
      next: (response) => {
        if (event.row.riskStatus === 'open') {
          this.api.getAssigneeByRiskId(id).subscribe((res: any) => {
            this.assignee = res;
            const context = {
              responsibleUser: this.assignee.fullName,
              riskId: event.row.riskId,
              riskName: event.row.riskName,
              description: event.row.description,
              riskType: event.row.riskType,
              plannedActionDate: event.row.plannedActionDate,
              overallRiskRating: event.row.overallRiskRating,
              riskStatus: event.row.riskStatus
            };
            // this.refershTableData();

            this.email.sendAssigneeEmail(this.assignee.email, context).subscribe({
              next: () => {
                this.notification.success("The risk has been approved successfully and Email sent to assignee");
                this.isLoader = false;
                this.refershTableData();
              },
              error: (emailError) => {
                console.error('Failed to send email to assignee:', emailError);
                this.isLoader = false;
                // this.refershTableData();
              },
              complete: () => {
                this.cdr.markForCheck();
              }
            });
          });
        } else if (event.row.riskStatus === 'close') {
          this.notification.success("The risk has been approved and closed successfully");
          this.isLoader = false;
          this.refershTableData();
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        this.notification.error("Failed to approve risk");
        this.isLoader = false;
      }
    });
}



  rejectRisk(event: {row: any, comment: string}) {
    this.isLoader = true;
    const updates = {
      approvalStatus: "Rejected",
      comments: event.comment
    };
    let id = event.row.id;
this.api.getRiskById(id).subscribe((res:any)=>{
  this.impact=res.impact;
  this.mitigation=res.mitigation

})
    this.api.updateReviewStatusAndComments(id, updates).subscribe({
      next: () => {
        if (event.row.riskStatus === 'open' || event.row.riskStatus === 'close') {
          this.api.getriskOwnerEmailandName(id).subscribe({
            next: (res: any) => {
              this.assignee = res;
              const context = {
                responsibleUser: res[0].name,
                riskId: event.row.riskId,
                riskName: event.row.riskName,
                description: event.row.description,
                riskType: event.row.riskType,
                impact:  this.impact,
                mitigation: this.mitigation,
                plannedActionDate: event.row.plannedActionDate,
                overallRiskRating: event.row.overallRiskRating,
                riskStatus: event.row.riskStatus,
                reason: event.comment
              };
              // this.refershTableData();
console.log("context:",context);

              this.email.sendOwnerEmail(res[0].email, context).subscribe({
                next: () => {
                  if (event.row.riskStatus === 'close') {
                    this.api.getAssigneeByRiskId(id).subscribe({
                      next: (assigneeRes: any) => {
                        const assigneeContext = {
                          responsibleUser: assigneeRes.fullName,
                          riskId: event.row.riskId,
                          riskName: event.row.riskName,
                          description: event.row.description,
                          riskType: event.row.riskType,
                          impact: event.row.impact,
                          mitigation: event.row.mitigation,
                          plannedActionDate: event.row.plannedActionDate,
                          overallRiskRating: event.row.overallRiskRating,
                          riskStatus: event.row.riskStatus,
                          reason: event.comment
                        };
                        // this.refershTableData();

                        this.email.sendOwnerEmail(assigneeRes.email, assigneeContext).subscribe({
                          next: () => {

                            this.notification.success("The risk has been rejected successfully ");
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          },
                          error: (emailError) => {
                            console.error('Failed to send email to assignee:', emailError);
                            this.notification.success("The risk has been rejected successfully");
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          }
                        });
                      },
                      error: (error) => {
                        console.error('Failed to get assignee details:', error);
                        this.notification.success("The risk has been rejected successfully");
                        this.isLoader = false;
                        this.refershTableData();
                        this.cdr.markForCheck();
                      }
                    });
                  } else {
                    this.notification.success("The risk has been rejected successfully");
                    this.isLoader = false;
                    this.refershTableData();
                    this.cdr.markForCheck();
                  }
                },
                error: (emailError) => {
                  console.error('Failed to send email to risk owner:', emailError);
                  this.notification.success("The risk has been rejected successfully");
                  this.isLoader = false;
                  this.refershTableData();
                  this.cdr.markForCheck();
                }
              });
            },
            error: (error) => {
              console.error('Failed to get risk owner details:', error);
              this.notification.success("The risk has been rejected successfully");
              this.isLoader = false;
              this.refershTableData();
              this.cdr.markForCheck();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        this.notification.error("Failed to reject risk");
        this.isLoader = false;
      }
    });

    console.log('Rejected:', event.row);
    console.log('Comment:', event.comment);
 }
}
