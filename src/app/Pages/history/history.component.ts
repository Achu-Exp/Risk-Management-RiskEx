import { CommonModule } from '@angular/common';
import { department } from './../../Interfaces/deparments.interface';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
  imports: [TableComponent, BodyContainerComponent, DatepickerComponent, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  isProjectUser : boolean = false;
  isEmtUser:boolean =false;
  isLoading = false;
  projectList: number[] =[];
  item:any=[];
  @Input() items:any=[];

  constructor(private router: Router,public api: ApiService,public auth: AuthService, private cdr: ChangeDetectorRef) {}

    OnClickRow(rowid:any): void {
      this.router.navigate([`/ViewRisk/${rowid}`]);
      console.log("rowdata",rowid);

    }



    ngOnInit(): void {

      setTimeout(() => {
        const role = this.auth.getUserRole();
        const department = this.auth.getDepartmentId();
        const pro = this.auth.getProjects();
        this.isLoading = true;

        // Set roles
        this.isAdmin = Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
        this.isDepartmentUser = role === 'DepartmentUser';
        this.isProjectUser = Array.isArray(role) ? role.includes('ProjectUsers') : role === 'ProjectUsers';
        this.isEmtUser = Array.isArray(role) ? role.includes('EMTUser') : role ==="EMTUser";
        console.log("Roles: Admin:", this.isAdmin, "DepartmentUser:", this.isDepartmentUser, "ProjectUser:", this.isProjectUser,"EMTUser:", this.isEmtUser);

        // Prepare Project List
        this.projectList = pro ? pro.map((project) => project.Id) : [];
        console.log("Project List:", this.projectList);

        // Fetch data based on conditions
        this.fetchAllData(department);
      }, 100);
    }

    fetchAllData(department: any): void {
      if (this.isAdmin || this.isEmtUser) {
        this.api.gethistorytabledata().subscribe((res: any) => {
          this.items = res;
          this.cdr.detectChanges();
          this.isLoading = false;
          console.log("Admin All Data:", this.items);
        });
      }
      if (this.isDepartmentUser) {
        this.api.getDepartmentHistoryTable(department).subscribe((res: any) => {
          this.items = res;
          this.cdr.detectChanges();
          this.isLoading = false;
          console.log("Department User All Data:", this.items);
        });
      }
      if (this.isProjectUser) {
        this.api.getProjectHistroyTable(this.projectList).subscribe((res: any) => {
          this.items = res;
          this.cdr.detectChanges();
          this.isLoading = false;
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
