import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overall-rating-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-rating-card.component.html',
  styleUrls: ['./overall-rating-card.component.scss']
})
export class OverallRatingCardComponent {

  @Input() value: number = 0;
  @Input() title: string = '';
  @Input() backgroundColor: string = '';
  @Input() textColor: string = '';
  @Input() height: number = 45; // Default height in vh
  @Input() width: number = 45; // Default width in vh
  @Input() assessmentData: any[] = [];

  isHovered: boolean = false;
  riskAssessmentBefore:any=[]
  riskAssessmentAfter:any=[]
  isMitigated=false

  ngOnInit()
  {
    setTimeout(()=>{

      this.assessmentData.forEach((e:any)=>{

        if(e.isMitigated)
        {


          this.isMitigated=true
        }
      //this.overallRiskRatingBefore += (e.impactMatix.value*e.likelihoodMatrix.value)
      })
      this.riskAssessmentAfter=this.assessmentData.filter((e:any)=>e.isMitigated)

      this.riskAssessmentBefore=this.assessmentData.filter((e:any)=>!e.isMitigated)



    //   this.riskAssessmentAfter.forEach((e:any)=>{
    //     this.overallRiskratingAfter += (e.impactMatix.value*e.likelihoodMatrix.value)
    // })
    },1000)
  }

  // Get dynamic background color based on input or value
  get dynamicBackgroundColor(): string {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }
    if (this.value <= 30) {
      return 'green';
    }
    if (this.value > 30 && this.value < 99) {
      return '#FFBF00';
    }
    return 'red';
  }

  // Get dynamic text color based on input or value
  get dynamicTextColor(): string {
    if (this.textColor) {
      return this.textColor;
    }
    if (this.value <= 30) {
      return 'green';
    }
    if (this.value > 30 && this.value < 99) {
      return '#FFBF00';
    }
    return 'red';
  }

  // Trigger hover effect
  onMouseOver() {
    this.isHovered = true;
  }

  // Reset hover effect
  onMouseOut() {
    this.isHovered = false;
  }

  // Return dynamic styles for width, height, background, and text color
  get dynamicStyles(): { [key: string]: string } {
    return {
      'background-color': this.dynamicBackgroundColor,  // Dynamic background color
      'color': this.dynamicTextColor,  // Dynamic text color

      'transition': 'all 0.5s ease',   // Transition for smooth resizing
    };
  }


}
