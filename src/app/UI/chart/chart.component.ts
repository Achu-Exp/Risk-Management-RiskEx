import { BaseChartDirective} from 'ng2-charts';
import { Component, Input, SimpleChanges} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register the components
Chart.register(...registerables, ChartDataLabels);



@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {


  @Input() labels:string[]=[];
  @Input() chartType: ChartType = 'line';
  @Input() datasets: any[]=[];
  // @Input()  datalabels: any[]=[];



  chartData: ChartConfiguration['data'] = {
  datasets: this.datasets,
  labels: this.labels,
  // datalabels:this.datalabels
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0,
      },

    },
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value: any) => {
          return value;
        },
        color: '#000000', // Text color (e.g., red)
        font: {
          size: 14, // Font size
          // family: 'Arial', // Font family
          weight: 'bold', // Font weight (e.g., bold, normal, lighter)

        }
      },
      legend: {
      position: 'right', // Legend on the right
      labels: {

        padding: 30, // Adjust this to increase the gap
        boxWidth: 35,
        boxHeight: 10,
      font: {
      size: 15,
      // family: 'Montserrat', // Font family
      weight: 'normal' // Font weight
      },
      color: '#000000'

      }

      },

      },


    //   layout: {
    //     padding: {
    //         right: 50 // Add padding on the right side
    //     }
    // }

  //   const options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //         legend: {
  //             position: 'right' as const,
  //             align: 'center' as const,
  //             labels: {
  //                 boxWidth: 10,
  //                 padding: 10,
  //             },
  //         },
  //         tooltip: {
  //             enabled: true,
  //         },
  //     },
  //     cutout: '50%', // Adjust the hole size
  // };





  };



  ngOnChanges(changes: SimpleChanges){
    if(changes['labels']){
      this.chartData.labels = this.labels;
    }

    if(changes['datasets']){
      this.chartData.datasets = this.datasets;
    }

    // if(changes['datalabels']){
    //   this.chartData.datalabels = this.datalabels;
    // }


  }

}








