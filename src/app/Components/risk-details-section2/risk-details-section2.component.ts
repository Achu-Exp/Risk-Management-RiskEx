import { Component, Input, input } from '@angular/core';
import { StepperComponent } from "../../UI/stepper/stepper.component";
import { CommonModule } from '@angular/common';
import { Step } from '../../Interfaces/Stepper.interface';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-risk-details-section2',
  standalone: true,
  imports: [StepperComponent,CommonModule],
  templateUrl: './risk-details-section2.component.html',
  styleUrl: './risk-details-section2.component.scss'
})
export class RiskDetailsSection2Component {


  @Input() riskMitigation=""
  @Input() riskContengency=""
  @Input() responsibilityOfAction=""
  @Input() plannedActionDate=""
  @Input() impact=""
  @Input() CreatedBy=""
  @Input() CreatedAt=""
  @Input() UpdatedBy=""
  @Input() UpdatedAt=""

  @Input() ReviewedBy=""
  @Input() ReviewedAt=""
  @Input() PostReviewedBy=""
  @Input() PostReviewedAt=""
  @Input() RiskStatus=""
  currentStep =1;
  constructor(private api:ApiService,private route:ActivatedRoute)
  {

  }



    stepperData:Step[]=[
      {
        id: 1,
        title: 'Open',
        isCompleted: false,
        actionBy: '...',
        date: '2025-01-03 05:04:00.059418+00',
        stepNumber: '01'
      },
      {
        id: 2,
        title: 'review',
        isCompleted: false,
        actionBy: 'Tony',
        date: '...',
        stepNumber: '02'
      },
      {
        id: 3,
        title: 'Mitigation',
        isCompleted: false,
        actionBy: 'Akshay',
        date: '...',
        stepNumber: '03'
      },
      {
        id: 4,
        title: 'Post Review',
        isCompleted: false,
        actionBy: '...',
        date: '.....',
        stepNumber: '04'
      },
      {
        id: 5,
        title: 'Closed',
        isCompleted: false,
        actionBy: '...',
        date: '.....',
        stepNumber: '05'
      }
    ]

  ngOnInit()
  {
    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');

      this.api.getReviewSatus(id!, true).subscribe((e: any) => {
        console.log('ReviewSatus', e);


        this.stepperData[0].actionBy = this.CreatedBy;
        this.stepperData[0].isCompleted = true;
        this.stepperData[0].date = this.CreatedAt;

        this.stepperData[1].actionBy = e.actionBy;
        this.stepperData[1].isCompleted = e.isReviewed >= 2 ? true : false;
        this.stepperData[1].date = e.isReviewed == 4 ? e.date : "....";
      });
      this.api.getReviewSatus(id!, false).subscribe((e: any) => {
        console.log('ReviewSatusafter', e);
        this.stepperData[3].actionBy = e.isReviewed == 4 ?this.UpdatedBy: '....' ;
        this.stepperData[3].isCompleted = e.isReviewed == 4 ? true : false;
        this.stepperData[3].date = e.date;


      if (this.RiskStatus == 'close') {
        this.stepperData[4].actionBy = this.UpdatedBy;
        this.stepperData[4].isCompleted = e.isReviewed == 4 ? true : false;;
        this.stepperData[4].date = this.UpdatedAt;
      }
      });
      this.api.getMitigationSatus(id!).subscribe((e: any) => {
        this.stepperData[2].actionBy = e.actionBy;
        this.stepperData[2].isCompleted = e.isMitigated;
        this.stepperData[2].date = e.date;
      });

    });
  }


  // onStepCompleted(stepId: number) {
  //   console.log(`Step ${stepId} completed`);
  //   this.completeStep(stepId);
  // }

  completeStep(stepId: number) {
    const step = this.stepperData.find((s) => s.id === stepId);
    if (step) {
      step.isCompleted = true;
    }
  }
}
