import { department } from './../../Interfaces/deparments.interface';
import { Component, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { ButtonComponent } from "../../UI/button/button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';



@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, DatepickerComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  isProjectUser : boolean = false;
  projectList: number[] =[];
  item:any=[];
  @Input() items:any=[];

  constructor(private router: Router,public api: ApiService,public auth: AuthService) {}

    OnClickRow(rowid:any): void {
      this.router.navigate([`/ViewRisk/${rowid}`]);
      console.log("rowdata",rowid);

    }



    ngOnInit(): void {

      setTimeout(() => {
        const role = this.auth.getUserRole();
        const department = this.auth.getDepartmentId();
        const pro = this.auth.getProjects();

        // Set roles
        this.isAdmin = Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
        this.isDepartmentUser = Array.isArray(role) ? role.includes('DepartmentUser') : role === 'DepartmentUser';
        this.isProjectUser = Array.isArray(role) ? role.includes('ProjectUsers') : role === 'ProjectUsers';

        console.log("Roles: Admin:", this.isAdmin, "DepartmentUser:", this.isDepartmentUser, "ProjectUser:", this.isProjectUser);

        // Prepare Project List
        this.projectList = pro ? pro.map((project) => project.Id) : [];
        console.log("Project List:", this.projectList);

        // Fetch data based on conditions
        this.fetchAllData(department);
      }, 200);
    }

    fetchAllData(department: any): void {
      if (this.isAdmin) {
        this.api.gethistorytabledata().subscribe((res: any) => {
          this.items = res;
          console.log("Admin All Data:", this.items);
        });
      }
      if (this.isDepartmentUser) {
        this.api.getDepartmentHistoryTable(department).subscribe((res: any) => {
          this.items = res;
          console.log("Department User All Data:", this.items);
        });
      }
      if (this.isProjectUser) {
        this.api.getProjectHistroyTable(this.projectList).subscribe((res: any) => {
          this.items = res;
          console.log("Project User All Data:", this.items);
        });
      }
    }

    //datepicker
    selectedDateRange: { startDate: string; endDate: string } | null = null;

    onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
  }
}
