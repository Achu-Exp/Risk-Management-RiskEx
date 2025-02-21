import { NgFor } from '@angular/common';
import { Component ,AfterViewInit, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-matrix';


Chart.register(...registerables);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [NgFor],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})

  export class HeatmapComponent implements OnInit {
    likelihoods = [
      { value: 0.1, label: 'Low' },
      { value: 0.2, label: 'Medium' },
      { value: 0.4, label: 'High' },
      { value: 0.6, label: 'Critical' }
    ];
  
    impacts = [
      { value: 10, label: 'Low' },
      { value: 20, label: 'Medium' },
      { value: 40, label: 'High' },
      { value: 60, label: 'Critical' }
    ];
  
    // matrixData:any = [
    //   // Low Impact (10)
    //   { impact: 25, likelihood: 0.25, value: , color: '#90EE90' },  // Green
    //   { impact: 10, likelihood: 20, value: 1, color: '#98FB98' },  // Light green
    //   { impact: 10, likelihood: 30, value: 1, color: '#FFFF00' },  // Yellow
    //   { impact: 10, likelihood: 40, value: 3, color: '#FFB6C1' },  // Light pink
  
    //   // Medium Impact (20)
    //   { impact: 20, likelihood: 10, value: 4, color: '#98FB98' },  // Light green
    //   { impact: 20, likelihood: 20, value: 5, color: '#FFFF00' },  // Yellow
    //   { impact: 20, likelihood: 30, value: 7, color: '#FFB6C1' },  // Light pink
    //   { impact: 20, likelihood: 40, value: 7, color: '#F08080' },  // Coral
  
    //   // High Impact (30)
    //   { impact: 30, likelihood: 10, value: 7, color: '#FFFF00' },  // Yellow
    //   { impact: 30, likelihood: 20, value: 7, color: '#FFB6C1' },  // Light pink
    //   { impact: 30, likelihood: 30, value: 10, color: '#F08080' }, // Coral
    //   { impact: 30, likelihood: 40, value: 6, color: '#FF0000' },  // Red
  
    //   // Very High Impact (40)
    //   { impact: 40, likelihood: 10, value: 7, color: '#FFB6C1' },  // Light pink
    //   { impact: 40, likelihood: 20, value: 12, color: '#F08080' }, // Coral
    //   { impact: 40, likelihood: 30, value: 14, color: '#FF0000' }, // Red
    //   { impact: 40, likelihood: 40, value: 9, color: '#FF0000' }   // Red
    // ];
    matrixData = this.impacts.flatMap(impact => 
      this.likelihoods.map(likelihood => {
        const value = Math.round(impact.value * likelihood.value); // Calculate value
        let color;
    
        // Assign color based on value
        // if (value <= 10) color = 'green'; // Green
        // else if (value <= 20) color = '#FFFF00'; // Yellow
        // // else if (value <= ) color = '#FFB6C1'; // Light pink
        // else if (value <= 100) color = 'red'; // Coral
        // else color = '#FF0000'; // Red

        if (value <= 10) {
          color = '#4CAF50';      // A pleasant green
      } else if (value <= 20) {
          color = '#FDD835';      // Warm yellow
      } else {
          color = '#EF5350';      // Soft red
      }
    
        return {
          impact: impact.value,
          likelihood: likelihood.value,
          value: value,
          color: color
        };
      }));
    
  
    constructor() { }
  
    ngOnInit(): void { }
  
    getCellsForImpact(impact: number): any {
      return this.matrixData.filter((cell: { impact: number; }) => cell.impact === impact);
    }
  }