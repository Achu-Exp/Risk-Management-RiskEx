import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { DepartmentDropdownComponent } from '../../Components/department-dropdown-dashboard/department-dropdown.component';
import { ChartComponent } from '../../UI/chart/chart.component';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth/auth.service';
import { ApiService } from '../../Services/api.service';
import { BubbleGraphComponent } from '../../UI/bubble-graph/bubble-graph.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { DashbaordCardContainerComponent } from '../../Components/dashbaord-card-container/dashbaord-card-container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    BodyContainerComponent,
    DepartmentDropdownComponent,
    ChartComponent,
    BubbleGraphComponent,
    CommonModule,
    StyleButtonComponent,
    DashbaordCardContainerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  list: any;
  constructor(
    public api: ApiService,
    private router: Router,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  privacyRiskCount: number = 0;
  qualityRiskCount: number = 0;
  securityRiskCount: number = 0;

  graph2labels: string[] = [];
  graph2chartType: any;
  graph2datasets: any[] = [];



  counter: number[] = [];
  risk: string[] = [];

  riskApproachingDeadline: any = [];
  risksWithHeighesOverallRating: any = [];
  openRiskCountByType: any = [];
  riskCategoryCounts: any = [];

  Criticality: any = [];
  graph2options: any;

  isAllDataFetched = 0;

  ngOnInit() {
    this.ApiInvocations();
  }

  ApiInvocations() {
    console.log('Role', this.authService.getProjects());

    let isAdminOrEMTuser =
      this.authService.getUserRole() === 'Admin' ||
      this.authService.getUserRole()?.includes('EMTUser');
    let isProjectUser = this.authService
      .getUserRole()
      ?.includes('ProjectUsers');

    this.api
      .getOpenRiskCountByType(
        isAdminOrEMTuser ? [] : [parseInt(this.authService.getDepartmentId()!)],
        isProjectUser
          ? this.authService.getProjects().map((item) => item.Id)
          : []
      )
      .subscribe((e: any) => {
        this.openRiskCountByType = e;
        this.list = e;
        console.log(this.list);
        const count = this.list.map(
          (element: { riskCount: any }) => element.riskCount
        );
        const counter: number[] = count;

        const riskCat = this.list.map(
          (element: { riskType: any }) => element.riskType
        );
        this.risk = riskCat;

        this.Criticality = this.list.reduce((acc: any, item: any) => {
          acc[item.riskCategory] = item.count;
          return acc;
        }, {});

        const riskcounts = this.list.reduce((acc: any, item: any) => {
          acc[item.riskType] = item.riskCount;
          console.log(item.riskType);
          return acc;
        }, {});

        this.privacyRiskCount = riskcounts['Privacy'];
        this.qualityRiskCount = riskcounts['Quality'];
        this.securityRiskCount = riskcounts['Security'];

        console.log('OpenRiskCount', e);
        this.cdr.detectChanges();

        this.isAllDataFetched++;
      });

    this.api
      .getRiskCategoryCountsByDepartment(
        isAdminOrEMTuser ? [] : [parseInt(this.authService.getDepartmentId()!)],
        isProjectUser
          ? this.authService.getProjects().map((item) => item.Id)
          : []
      )
      .subscribe((e: any) => {
        console.log('darat', e);
        this.riskCategoryCounts = e;
        this.list = e;
        const count = this.list.map((element: { count: any }) => element.count);
        this.counter = count;
        const counter: number[] = count;
        console.log('Output', counter);

        const riskCat = this.list.map(
          (element: { riskCategory: any }) => element.riskCategory
        );
        this.risk = riskCat;

        this.Criticality = this.list.reduce((acc: any, item: any) => {
          acc[item.riskCategory] = item.count;

          return acc;
        }, {});

        this.graph2datasets = [
          {
            data: counter,
            backgroundColor: ['#962DFF', '#C6D2FD', '#E0C6FD'],
            hoverOffset: 10,
          },
        ];

        this.graph2chartType = 'doughnut';
        this.graph2labels = this.risk;
        console.log('criticalitylevel', e);
        this.cdr.detectChanges();
        this.isAllDataFetched++;
      });

    this.api
      .getRiskCategoryCounts(
        isAdminOrEMTuser ? '' : this.authService.getDepartmentId()
      )
      .subscribe((e: any) => {
        this.riskCategoryCounts = e;
        this.list = e;

        const count = this.list.map((element: { count: any }) => element.count);
        const counter: number[] = count;

        const riskCat = this.list.map(
          (element: { riskCategory: any }) => element.riskCategory
        );
        this.risk = riskCat;

        this.Criticality = this.list.reduce((acc: any, item: any) => {
          acc[item.riskCategory] = item.count;
          return acc;
        }, {});

        this.graph2datasets = [
          {
            data: counter,
            backgroundColor: ['#962DFF', '#C6D2FD', '#E0C6FD'],
            hoverOffset: 10,
          },
        ];

        this.graph2chartType = 'doughnut';
        this.graph2labels = riskCat;
        console.log('criticalitylevel', e);
        this.cdr.detectChanges();
        this.isAllDataFetched++;
      });

    this.api
      .getRiskApproachingDeadline(
        isAdminOrEMTuser ? [] : [parseInt(this.authService.getDepartmentId()!)],
        isProjectUser
          ? this.authService.getProjects().map((item) => item.Id)
          : []
      )
      .subscribe((e: any) => {
        this.riskApproachingDeadline = e;
        console.log('approaching', e);
        this.cdr.detectChanges();
        this.isAllDataFetched++;
      });

    this.api
      .getRisksWithHeigestOverallRating(
        isAdminOrEMTuser ? [] : [parseInt(this.authService.getDepartmentId()!)],
        isProjectUser
          ? this.authService.getProjects().map((item) => item.Id)
          : []
      )
      .subscribe((e: any) => {
        this.risksWithHeighesOverallRating = e;
        console.log('heigest', e);
        this.cdr.detectChanges();
        this.isAllDataFetched++;
      });
  }

  OnCardClicked(id: number) {
    this.router.navigate([`ViewRisk/${id}`]);
  }

  onBubbleClicked(type: string) {
    this.router.navigate([`reports`], { state: { type: type } });
  }

  OnRegisterRiskButtonCLicked() {
    this.router.navigate([`/addrisk`]);
  }

  GetSelectedDepartment(event: any) {
    this.isAllDataFetched = 0;
    console.log('Selected Departments=', event);

    this.api
      .getRiskCategoryCountsByDepartment(event, [])
      .subscribe((e: any) => {
        console.log('darat', e);

        this.riskCategoryCounts = e;
        this.list = e;
        const count = this.list.map((element: { count: any }) => element.count);
        this.counter = count;
        const counter: number[] = count;

        const riskCat = this.list.map(
          (element: { riskCategory: any }) => element.riskCategory
        );
        this.risk = riskCat;

        this.Criticality = this.list.reduce((acc: any, item: any) => {
          acc[item.riskCategory] = item.count;

          return acc;
        }, {});

        this.graph2datasets = [
          {
            data: counter,
            backgroundColor: ['#962DFF', '#C6D2FD', '#E0C6FD'],
            hoverOffset: 10,
          },
        ];

        this.graph2chartType = 'doughnut';
        this.graph2labels = this.risk;
        console.log('criticalitylevel', e);
        this.cdr.detectChanges();
        this.isAllDataFetched++;
      });

    this.api.getOpenRiskCountByType(event, []).subscribe((e: any) => {
      this.openRiskCountByType = e;
      this.list = e;
      const riskcounts = this.list.reduce((acc: any, item: any) => {
        acc[item.riskType] = item.riskCount;
        return acc;
      }, {});

      this.privacyRiskCount = riskcounts['Privacy'];
      this.qualityRiskCount = riskcounts['Quality'];
      this.securityRiskCount = riskcounts['Security'];
      console.log(
        this.privacyRiskCount,
        this.qualityRiskCount,
        this.securityRiskCount
      );

      this.cdr.detectChanges();
      this.isAllDataFetched++;
    });

    this.api.getRisksWithHeigestOverallRating(event, []).subscribe((e: any) => {
      this.risksWithHeighesOverallRating = e;
      this.cdr.detectChanges();
      this.isAllDataFetched++;
    });

    this.api.getRiskApproachingDeadline(event, []).subscribe((e: any) => {
      this.riskApproachingDeadline = e;
      this.isAllDataFetched++;
    });
  }
}
