import { Component, Input } from '@angular/core';
import { TableComponent } from "../../Components/table/table.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { Router } from '@angular/router';
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";
import { ReportGenerationService } from '../../Services/report-generation.service';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent, BodyContainerComponent, StyleButtonComponent, DatepickerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  @Input() label: string = 'Generate Report';
  // @Input() data?: any[]; // Optional input for custom data
  data:any;
  items:any=[];
  constructor(private excelService: ReportGenerationService,private router: Router,public api: ApiService) {}

  onGenerateReport(): void {
    this.api.gettabledata().subscribe((res: any) => {
    this.data= res;
    console.log(this.data);
    if (Array.isArray(this.data) && this.data.length > 0) {
      this.excelService.generateReport(this.data, 'RiskReport');
    } else {
      console.error('Invalid data:', this.data);
    }
    });
    console.log('Data passed to generateReport:', this.data);

  }



      OnClickRow(rowid:any): void {
        this.router.navigate([`/ViewRisk/${rowid}`]);
        console.log("rowdata",rowid);
      }

      ngOnInit(): void {

        this.api.gettabledata().subscribe((res: any) => {
          this.items = res;
          console.log(this.items);
        });
      
      }

}
