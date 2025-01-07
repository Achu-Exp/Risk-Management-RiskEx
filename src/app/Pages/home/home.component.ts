import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { DepartmentDropdownComponent } from "../../Components/department-dropdown-dashboard/department-dropdown.component";
import { ChartComponent } from "../../UI/chart/chart.component";
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ApiService } from '../../Services/api.service';
import { BubbleGraphComponent } from "../../UI/bubble-graph/bubble-graph.component";
import { StyleButtonComponent } from "../../UI/style-button/style-button.component";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, BodyContainerComponent, ButtonComponent, DepartmentDropdownComponent, ChartComponent, BubbleGraphComponent, CommonModule, StyleButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
        list: any;
        constructor(public api:ApiService,private router: Router,public authService:AuthService) {}

        privacyRiskCount: number = 0; // Default value
        qualityRiskCount: number = 0; // Default value
        securityRiskCount: number = 0; // Default value

        graph2labels:string[]=[];
        graph2chartType:any;
        graph2datasets:any[]=[];
        counter:number[]=[];
        risk:string[]=[];

        riskApproachingDeadline:any=[]
        risksWithHeighesOverallRating:any=[]
        openRiskCountByType:any=[]
        riskCategoryCounts:any=[]

        Criticality:any=[]
        graph2options:any

        ngOnInit(){


        this.api. getOpenRiskCountByType(this.authService.getUserRole() === 'Admin'?'' :this.authService.getDepartmentId()).subscribe((e:any)=>{
        this.openRiskCountByType=e
        this.list=e
        const riskcounts = this.list.reduce((acc: any, item: any) => {
        acc[item.riskType] = item.riskCount;
        return acc;
        }, {});

        this.privacyRiskCount = riskcounts['Privacy'] ;
        this.qualityRiskCount = riskcounts['Quality'] ;
        this.securityRiskCount = riskcounts['Security'];

        console.log("OpenRiskCount",e)
      })


        this.api.getRiskCategoryCounts(this.authService.getUserRole() === 'Admin'?'' :this.authService.getDepartmentId()).subscribe((e:any)=>{
        this.riskCategoryCounts=e
        this.list=e
            const count = this.list.map((element: { count: any; }) => element.count);
            this.counter = count

            const riskCat = this.list.map((element: {riskCategory:any})=>element.riskCategory);
            this.risk = riskCat;

            this.Criticality = this.list.reduce((acc: any, item: any) => {
            acc[item.riskCategory] = item.count;
            return acc;
            }, {});

            this.graph2datasets=[{
            data: this.counter,
            backgroundColor: [
            '#962DFF',
            '#E0C6FD',
            '#C6D2FD'
            ],
            hoverOffset: 20
            }]

            this.graph2labels=this.risk
            this.graph2chartType='doughnut'

            console.log("criticalitylevel",e)
        })

          this.api.getRiskApproachingDeadline(this.authService.getUserRole() === 'Admin'?'' :this.authService.getDepartmentId()).subscribe((e:any)=>{
          this.riskApproachingDeadline=e
          console.log("approaching",e)
          })

          this.api.getRisksWithHeigestOverallRating(this.authService.getUserRole() === 'Admin'?'':this.authService.getDepartmentId()).subscribe((e:any)=>{
          this.risksWithHeighesOverallRating=e
          console.log("heigest",e)
        })
    }

        OnCardClicked(id:number)
        {
          this.router.navigate([`ViewRisk/${id}`]) //         /ViewRisk/${this.allData.id}/
        }

        onBubbleClicked(type:string)
        {
          this.router.navigate([`reports`], { state: { type: type} });
        }

        OnRegisterRiskButtonCLicked()
        {
          this.router.navigate([`/addrisk`]) //         /ViewRisk/${this.allData.id}/

        }















// graph3labels:string[]=["Delivery Units","L&D","Sfm", "HR"];
// graph3chartType:any='bar'
// graph3datasets:any[]=[
//   {
//     data:[40,40,40,40],
//     label:"Quality",
//     backgroundColor: '#51AEF2',
//     yAxisID: 'y1',
//     borderColor: '#3E68B9',
//     pointBackgroundColor: '#3E68B9',
//     pointBorderColor: '#fff',
//     pointHoverBackgroundColor: '#fff',
//     pointHoverBorderColor: '#3E68B9',
//     barPercentage: 0.7, // Reduce individual bar width
//     categoryPercentage: 0.4 // Increase spacing between categories
//   },
//   {
//     data:[35,35,35,35],
//     label:"Privacy",
//     backgroundColor: '#6993E4',
//     yAxisID: 'y1',
//     borderColor: '#3E68B9',
//     pointBackgroundColor: '#3E68B9',
//     pointBorderColor: '#fff',
//     pointHoverBackgroundColor: '#fff',
//     pointHoverBorderColor: '#3E68B9',
//     barPercentage: 0.7, // Reduce individual bar width
//     categoryPercentage: 0.4// Increase spacing between categories
//   },
//   {
//     data:[25,25,25,25],
//     label:"Security",
//     backgroundColor: '#979797',
//     yAxisID: 'y1',
//     borderColor: '#3E68B9',
//     pointBackgroundColor: '#3E68B9',
//     pointBorderColor: '#fff',
//     pointHoverBackgroundColor: '#fff',
//     pointHoverBorderColor: '#3E68B9',
//     barPercentage: 0.7, // Reduce individual bar width
//     categoryPercentage: 0.4 // Increase spacing between categories
//   },
// ]
// // Options should be defined separately, not inside the datasets array
// graph3options: any = {
//   plugins: {
//     legend: {
//       display: true,
//       labels: {
//         boxWidth: 5,          // Reduce the width of the color box
//         boxHeight: 5,         // Optional: Adjust height for consistency
//         usePointStyle: true,   // Use smaller shapes for legend icons
//         pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
//         padding: 10            // Add spacing between legend items
//       }
//     }
//   },
//   responsive: true,
//   scales: {
//     y: {
//       beginAtZero: true // Ensure the Y-axis starts at 0
//     }
//   }
// };
// {
//   data:[40],
//   label:"Quality",
//   backgroundColor: '#51AEF2',
//   yAxisID: 'y1',
//   // borderColor: '#3E68B9',
//   pointBackgroundColor: '#51AEF2',
//   // pointBorderColor: '#fff',
//   // pointHoverBackgroundColor: '#fff',
//   pointHoverBorderColor: '#3E68B9',
// },
// {
//   data:[35],
//   label:"Privacy",
//   backgroundColor: '#6993E4',
//   yAxisID: 'y1',
//   // borderColor: '#3E68B9',
//   pointBackgroundColor: 'rgb(62, 104, 185, 0.6)',
//   // pointBorderColor: '#fff',
//   // pointHoverBackgroundColor: '#fff',
//   pointHoverBorderColor: '#3E68B9',
//   responsive: true,
// },
// {
//   data:[25],
//   label:"Security",
//   backgroundColor: '#979797',
//   yAxisID: 'y1',
//   // borderColor: '#3E68B9',
//   pointBackgroundColor: 'rgb(62, 104, 185, 0.4)',
//   // pointBorderColor: '#fff',
//   // pointHoverBackgroundColor: '#fff',
//   pointHoverBorderColor: '#3E68B9',
//   responsive: true,
//   // plugins: {
//   //   legend: {
//   //     position: 'top' // Or 'top', 'right', 'left'
//   //   }
//   // }
// },
// graph2options: any = {
//   plugins: {
//     legend: {
//       display: true,
//       labels: {
//         boxWidth: 5,          // Reduce the width of the color box
//         boxHeight: 5,         // Optional: Adjust height for consistency
//         usePointStyle: true,   // Use smaller shapes for legend icons
//         pointStyle: 'Circle', // Example shape: circle, rectRounded, etc.
//         padding: 10            // Add spacing between legend items
//       }
//     }
//   },
//   responsive: true,
//   scales: {
//     y: {
//       beginAtZero: true // Ensure the Y-axis starts at 0
//     }
//   }
// };
// graph1labels:string[]=["Critical","Moderate","Low"];
// graph1chartType:any='line'
// graph1datasets:any[]=[
//   {
//     data:[45,null,null],
//     label:"Critical",
//     backgroundColor: 'rgb(232, 8, 8,0.7)',
//     yAxisID: 'y1',
//     // borderColor: '#red',
//     pointBackgroundColor: 'rgb(232, 8, 8,0.7)',
//     // pointBorderColor: '#E80808',
//     pointHoverBackgroundColor: '#E80808',
//     pointHoverBorderColor: '#E80808',
//     tension: 0.1,
//   },
//   {
//     data:[null,30,null],
//     label:"Moderate",
//     backgroundColor: 'rgb(255, 180, 79)',
//     yAxisID: 'y1',
//     // borderColor: 'orange',
//     pointBackgroundColor: 'rgb(255, 180, 79)',
//     pointBorderColor: 'rgb(255, 180, 79)',
//     pointHoverBackgroundColor: 'rgb(255, 180, 79)',
//     pointHoverBorderColor: 'rgb(255, 180, 79)',
//     // responsive: true,
//     tension: 0.1,
//   },
//   {
//     data:[null,null,25],
//     label:"Low",
//     backgroundColor: '  rgb(31, 146, 84)',
//     yAxisID: 'y1',
//     // borderColor: 'yellow',
//     pointBackgroundColor: ' rgb(31, 146, 84)',
//     pointBorderColor: ' rgb(31, 146, 84)',
//     pointHoverBackgroundColor: ' rgb(31, 146, 84)',
//     pointHoverBorderColor: 'rgb(31, 146, 84)',
//     tension: 0.1,
//   },
// ]
// graph1labels: string[] = ["Critical", "Moderate", "Low"]; // X-axis labels
// graph1chartType:any='line'
// graph1datasets: any[] = [
//   {
//     data: [45, 30, 25], // Values to connect with a line
//     label: "Risk Metrics",
//     backgroundColor: 'rgb(81, 174, 242,0.8)', // Light blue background
//     borderColor: 'rgb(81, 174, 242,0.8)', // Light blue line
//     pointBackgroundColor: ['red', 'orange', 'green'], // Point colors
//     pointBorderColor: '#fff',
//     pointRadius: 5, // Size of points
//     pointHoverRadius: 8,
//     tension: 0.1, // Smooth curve
//   },
// ];
// Chart options with labels plugin







}
