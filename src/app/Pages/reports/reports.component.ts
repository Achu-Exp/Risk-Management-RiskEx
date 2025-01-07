import { Component, HostListener, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ReportGenerationService } from '../../Services/report-generation.service';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, StyleButtonComponent, DatepickerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  isAdmin: boolean = false;
  isDepartmentUser: boolean = false;
  isProjectUser : boolean = false;
  projectList: number[] =[];
  item:any=[];
  @Input() label: string = 'Generate Report';
  // @Input() data?: any[]; // Optional input for custom data
  data:any;
  items:any=[];
  type: any;
  constructor(private excelService: ReportGenerationService,private router: Router,public api: ApiService,public auth: AuthService) {}

  filtereddata():void{

  }
  onGenerateReport(): void {
    // this.api.gettabledata().subscribe((res: any) => {
    // this.data= res;
    console.log(this.filteredTableData);
    if (Array.isArray(this.filteredTableData) && this.filteredTableData.length > 0) {
      this.excelService.generateReport(this.filteredTableData, 'RiskReport');
    } else {
      console.error('Invalid data:', this.filteredTableData);
    }

    console.log('Data passed to generateReport:', this.filteredTableData);

  }

  filteredTableData: any[] = [];

  onFilteredData(filteredData: any[]): void {
    this.filteredTableData = filteredData;
    console.log('Received filtered data:', this.filteredTableData);
  }

  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.contains1')) {
        this.isDropdownOpen = false;
      }
    }

      OnClickRow(rowid:any): void {
        this.router.navigate([`/ViewRisk/${rowid}`]);
        console.log("rowdata",rowid);
      }

      ngOnInit(): void {
      this.type = history.state.type;
      console.log("histroyile type",this.type);
        // setTimeout(()=>{
      const role = this.auth.getUserRole();
      const department = this.auth.getDepartmentId();
      const pro = this.auth.getProjects();
      this.projectList = pro.map((project) => project.Id);
      console.log("output",this.projectList);
      console.log("dep",department);
      console.log("role",role);
      if (Array.isArray(role)) {
        this.isAdmin = role.includes("Admin");
        this.isDepartmentUser = role.includes("DepartmentUser");
        this.isProjectUser = role.includes("ProjectUsers");
      }

      if(this.type == null){
      if(this.isAdmin){
        this.api.gettabledata().subscribe((res: any) => {
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
      if(this.isDepartmentUser ){
        this.api.getDepartmentTable(department).subscribe((res:any)=>{
          this.item = res;
          this.items =[...this.item];
          console.log("depart",this.items);

        })
      }
      if(this.isProjectUser){
        this.api.getProjectTable(this.projectList).subscribe((res:any)=>{
          this.item = res;
          this.items =[...this.item];
          console.log("pro",this.items);
        })
      }
    }
    else{
      if(this.isAdmin){
        this.api.gettabledata().subscribe((res: any) => {
          this.items = res.filter((item: { riskType: any; }) => item.riskType === this.type);
          console.log(this.items);
        });

      }
      if(this.isDepartmentUser&&this.isProjectUser){
        this.api.getDepartmentTable(department).subscribe((res:any)=>{
          this.item = res.filter((item: { riskType: any; }) => item.riskType === this.type);
          this.items =[...this.item];
          console.log("depart",this.items);

        })
      }
      if(this.isDepartmentUser ){
        this.api.getDepartmentTable(department).subscribe((res:any)=>{
          this.item = res.filter((item: { riskType: any; }) => item.riskType === this.type);
          this.items =[...this.item];
          console.log("depart",this.items);

        })
      }
      if(this.isProjectUser){
        this.api.getProjectTable(this.projectList).subscribe((res:any)=>{
          this.item = res.filter((item: { riskType: any; }) => item.riskType === this.type);
          this.items =[...this.item];
          console.log("pro",this.items);
        })
      }
    }

    // },1000);

      }
      //datepicker
    selectedDateRange: { startDate: string; endDate: string } | null = null;

    onDateRangeSelected(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;
}
}
