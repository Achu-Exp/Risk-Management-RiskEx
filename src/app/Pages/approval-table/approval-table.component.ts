import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';
import { EmailService } from '../../Services/email.service';
import { NotificationService } from '../../Services/notification.service';
import { FormLoaderComponent } from '../../Components/form-loader/form-loader.component';

@Component({
  selector: 'app-approval-table',
  standalone: true,
  imports: [
    BodyContainerComponent,
    ReusableTableComponent,
    FormLoaderComponent,
  ],
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss',
})
export class ApprovalTableComponent {
  headerData: string[] = [];
  assignee: any;
  isLoading = false;
  isLoader = false;
  impact: string = '';
  mitigation: string = '';

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
  isEMT = false;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public email: EmailService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  private refreshTableDataAdmin() {
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
    ];

    this.api.getAllRisksTobeReviewed().subscribe((response: any) => {
      console.log('admin tablebody:', response);
      this.tableBodyAdmin = response;
      this.isLoading = false;
    });
  }
  private refershTableData() {
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
    this.tableBody = [
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
    this.api
      .getRisksByReviewerId(this.auth.getCurrentUserId())
      .subscribe((response: any) => {
        console.log('API Response:', response);
        this.tableBody = response;
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

 approveRisk(event: { row: any; comment: string }) {
  this.isLoader = true;
  const updates = {
    approvalStatus: 'Approved',
    comments: event.comment,
  };
  let id = event.row.id;

  this.api.getRiskById(id).subscribe(
    (riskDetails: any) => {
      this.impact = riskDetails.impact;
      this.mitigation = riskDetails.mitigation;

      this.api.updateReviewStatusAndComments(id, updates).subscribe({
        next: () => {
          this.api.getriskOwnerEmailandName(id).subscribe({
            next: (ownerRes: any) => {
              this.api.getAssigneeByRiskId(id).subscribe({
                next: (assigneeRes: any) => {
                  this.assignee = assigneeRes;

                  const context = {
                    responsibleUser: this.assignee.fullName,
                    riskId: event.row.riskId,
                    riskName: event.row.riskName,
                    description: event.row.description,
                    riskType: event.row.riskType,
                    impact: this.impact,
                    mitigation: this.mitigation,
                    plannedActionDate: new Date(
                      event.row.plannedActionDate
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                    overallRiskRating: event.row.overallRiskRating,
                    riskStatus: event.row.riskStatus,
                    approvedBy: this.auth.getUserName(),
                    comments: event.comment,
                  };

                  if (event.row.riskStatus === 'close') {
                    const closureContext = {
                      ...context,
                      verifiedBy: this.auth.getUserName(),
                      verificationComments: event.comment
                    };
                    const closureContextOwner = {
                      riskId: event.row.riskId,
                    riskName: event.row.riskName,
                    description: event.row.description,
                    riskType: event.row.riskType,
                    impact: this.impact,
                    mitigation: this.mitigation,
                    plannedActionDate: new Date(
                      event.row.plannedActionDate
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                    overallRiskRating: event.row.overallRiskRating,
                      verifiedBy: this.auth.getUserName(),
                      verificationComments: event.comment
                    };

                    this.email.sendRiskClosureEmail(ownerRes[0].email, closureContextOwner).subscribe({
                      next: () => {
                        console.log('Risk closure email sent to owner successfully');

                        this.email.sendRiskClosureEmail(this.assignee.email, closureContext).subscribe({
                          next: () => {
                            console.log('Risk closure email sent to assignee successfully');
                            this.notification.success(
                              'The risk has been approved and closed successfully. Closure notifications sent to owner and assignee.'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          },
                          error: (emailError) => {
                            console.error('Failed to send closure email to assignee:', emailError);
                            this.notification.success(
                              'The risk has been approved and closed successfully. Closure notification sent to owner only.'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          }
                        });
                      },
                      error: (emailError) => {
                        console.error('Failed to send closure email to owner:', emailError);
                        this.notification.success(
                          'The risk has been approved and closed successfully, but email notifications failed.'
                        );
                        this.isLoader = false;
                        this.refershTableData();
                        this.cdr.markForCheck();
                      }
                    });
                  } else {

                    this.email.sendAssigneeEmail(this.assignee.email, context).subscribe({
                      next: () => {
                        console.log('Assignee approval email sent successfully');

                        this.email.sendApprovalEmail(ownerRes[0].email, context).subscribe({
                          next: () => {
                            console.log('Risk Owner approval email sent successfully');
                            this.notification.success(
                              'The risk has been approved successfully and Email sent to assignee and risk owner'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          },
                          error: (emailError) => {
                            console.error('Failed to send approval email to risk owner:', emailError);
                            this.notification.success(
                              'The risk has been approved successfully and Email sent to assignee'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          }
                        });
                      },
                      error: (emailError) => {
                        console.error('Failed to send email to assignee:', emailError);

                        this.email.sendApprovalEmail(ownerRes[0].email, context).subscribe({
                          next: () => {
                            this.notification.success(
                              'The risk has been approved successfully and Email sent to risk owner'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          },
                          error: (ownerEmailError) => {
                            console.error('Failed to send email to risk owner:', ownerEmailError);
                            this.notification.success(
                              'The risk has been approved successfully but email notifications failed'
                            );
                            this.isLoader = false;
                            this.refershTableData();
                            this.cdr.markForCheck();
                          }
                        });
                      }
                    });
                  }
                },
                error: (error) => {
                  console.error('Failed to get assignee details:', error);
                  this.notification.success('The risk has been approved successfully but email notifications could not be sent');
                  this.isLoader = false;
                  this.refershTableData();
                  this.cdr.markForCheck();
                }
              });
            },
            error: (error) => {
              console.error('Failed to get risk owner details:', error);
              this.notification.success('The risk has been approved successfully but email notifications could not be sent');
              this.isLoader = false;
              this.refershTableData();
              this.cdr.markForCheck();
            }
          });
        },
        error: (error) => {
          console.error('Error updating review status:', error);
          this.notification.error('Failed to approve risk');
          this.isLoader = false;
        }
      });
    },
    (error) => {
      console.error('Error getting risk details:', error);
      this.notification.error('Failed to get risk details');
      this.isLoader = false;
    }
  );
}

  rejectRisk(event: { row: any; comment: string }) {
    this.isLoader = true;
    const updates = {
      approvalStatus: 'Rejected',
      comments: event.comment,
    };
    let id = event.row.id;
    this.api.getRiskById(id).subscribe((res: any) => {
      this.impact = res.impact;
      this.mitigation = res.mitigation;
    });
    this.api.updateReviewStatusAndComments(id, updates).subscribe({
      next: () => {
        if (
          event.row.riskStatus === 'open' ||
          event.row.riskStatus === 'close'
        ) {
          this.api.getriskOwnerEmailandName(id).subscribe({
            next: (res: any) => {
              this.assignee = res;
              const context = {
                reviewer: this.auth.getUserName(),
                responsibleUser: res[0].name,
                riskId: event.row.riskId,
                riskName: event.row.riskName,
                description: event.row.description,
                riskType: event.row.riskType,
                impact: this.impact,
                mitigation: this.mitigation,
                plannedActionDate: new Date(
                  event.row.plannedActionDate
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                overallRiskRating: event.row.overallRiskRating,
                riskStatus: event.row.riskStatus,
                reason: event.comment,
              };
              // this.refershTableData();
              // console.log('context:', context);

              this.email.sendOwnerEmail(res[0].email, context).subscribe({
                next: () => {
                  if (event.row.riskStatus === 'close') {
                    this.api.getAssigneeByRiskId(id).subscribe({
                      next: (assigneeRes: any) => {
                        const assigneeContext = {
                          reviewer: this.auth.getUserName(),
                          responsibleUser: assigneeRes.fullName,
                          riskId: event.row.riskId,
                          riskName: event.row.riskName,
                          description: event.row.description,
                          riskType: event.row.riskType,
                          impact: event.row.impact,
                          mitigation: event.row.mitigation,
                          plannedActionDate: new Date(
                            event.row.plannedActionDate
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }),
                          overallRiskRating: event.row.overallRiskRating,
                          riskStatus: event.row.riskStatus,
                          reason: event.comment,
                        };
                        // this.refershTableData();

                        this.email
                          .sendOwnerEmail(assigneeRes.email, assigneeContext)
                          .subscribe({
                            next: () => {
                              this.notification.success(
                                'The risk has been rejected successfully '
                              );
                              this.isLoader = false;
                              this.refershTableData();
                              this.cdr.markForCheck();
                            },
                            error: (emailError) => {
                              console.error(
                                'Failed to send email to assignee:',
                                emailError
                              );
                              this.notification.success(
                                'The risk has been rejected successfully'
                              );
                              this.isLoader = false;
                              this.refershTableData();
                              this.cdr.markForCheck();
                            },
                          });
                      },
                      error: (error) => {
                        console.error('Failed to get assignee details:', error);
                        this.notification.success(
                          'The risk has been rejected successfully'
                        );
                        this.isLoader = false;
                        this.refershTableData();
                        this.cdr.markForCheck();
                      },
                    });
                  } else {
                    this.notification.success(
                      'The risk has been rejected successfully'
                    );
                    this.isLoader = false;
                    this.refershTableData();
                    this.cdr.markForCheck();
                  }
                },
                error: (emailError) => {
                  console.error(
                    'Failed to send email to risk owner:',
                    emailError
                  );
                  this.notification.success(
                    'The risk has been rejected successfully'
                  );
                  this.isLoader = false;
                  this.refershTableData();
                  this.cdr.markForCheck();
                },
              });
            },
            error: (error) => {
              console.error('Failed to get risk owner details:', error);
              this.notification.success(
                'The risk has been rejected successfully'
              );
              this.isLoader = false;
              this.refershTableData();
              this.cdr.markForCheck();
            },
          });
        }
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        this.notification.error('Failed to reject risk');
        this.isLoader = false;
      },
    });

    console.log('Rejected:', event.row);
    console.log('Comment:', event.comment);
  }
}
