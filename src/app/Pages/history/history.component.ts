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
    // setTimeout(()=>{
      const role = this.auth.getUserRole();
      this.isAdmin = role === 'Admin';
      console.log("admin",this.isAdmin);
      if (Array.isArray(role)) {
        this.isDepartmentUser = role.includes("DepartmentUser");
        console.log("dep",this.isDepartmentUser);
        this.isProjectUser = role.includes("ProjectUsers");
      }
      const department = this.auth.getDepartmentId();

      console.log("dep",department);
      console.log("role",role);

    if(this.isAdmin){
      this.api.gethistorytabledata().subscribe((res: any) => {
        this.items = res;
        console.log(this.items);
      });

    }
    if(this.isDepartmentUser&&this.isProjectUser){
      this.api.getDepartmentTable(department).subscribe((res:any)=>{
        this.item = res;
        this.items =[...this.item];
        console.log("depart",this.items);

      })
    }
    if(this.isDepartmentUser){
      this.api.getDepartmentHistoryTable(department).subscribe((res:any)=>{
        this.item = res;
        this.items =[...this.item];
        console.log("depart",this.items);

      })
    }
    if(this.isProjectUser){
      const pro = this.auth.getProjects();
      console.log("output!!!!",pro);
      this.projectList = pro.map((project) => project.Id);
      console.log("output",this.projectList);
      this.api.getProjectHistroyTable(this.projectList).subscribe((res:any)=>{
        this.item = res;
        this.items =[...this.item];
        console.log("pro",this.items);
      })
    }

  // },1000);

    }

    //datepicker
    selectedDateRange: { startDate: string; endDate: string } | null = null;

    onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
  }
}
