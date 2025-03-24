import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output,
  OnInit,
  KeyValueDiffers,
  KeyValueDiffer,
  ChangeDetectorRef,
} from '@angular/core';
import { Step } from '../../Interfaces/Stepper.interface';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [DatePipe, SlicePipe,CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'], // Corrected "styleUrl" to "styleUrls"
})
export class StepperComponent {
  @Output() stepCompleted = new EventEmitter<number>();
  @Input() steps: Step[] = [];
  myListDiffer?: KeyValueDiffer<string, any>;
  currentStep = 1;

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['steps'] && this.steps) {
  //     this.steps.forEach((step) => {
  //       if (step.isCompleted) {
  //         this.emitStepCompleted(step.id);
  //       }
  //     });
  //   }
  // }
  constructor(
    private differs: KeyValueDiffers,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps']) {
      // Handle initial changes or significant list modifications
     // console.log('steps changed:', this.steps);
      this.myListDiffer = this.differs.find(this.steps).create();
    }
  }

  ngDoCheck() {
    if (this.myListDiffer) {
      const changes = this.myListDiffer.diff(this.steps);
      if (changes) {
        changes.forEachChangedItem((change) => {
          console.log(`Object with id ${change.key} changed:`);
          console.log('Previous Value:', change.previousValue);
          console.log('Current Value:', change.currentValue);

          // Handle specific property changes within the object
        });
      }

      console.log('stepsafter=', this.steps);

      this.steps.forEach((e: any) => {
        if (e.isCompleted) {
          this.completeStep(e.id);
        }
      });
    }
  }

  ngOnInit() {
    console.log('steps=', this.steps);

    setTimeout(() => {
      this.steps.forEach((e: any) => {
        if (e.isCompleted) {
          this.completeStep(e.id);
        }
      });
    }, 1000);
  }

  completeStep(stepId: number) {
    const step = this.steps.find((s) => s.id === stepId);
    if (step) {
      step.isCompleted = true;
      if (stepId < this.steps.length) {
        this.currentStep = stepId + 1;
      }
      this.emitStepCompleted(stepId);
    }
  }

  private emitStepCompleted(stepId: number) {
    this.stepCompleted.emit(stepId);
  }
}
