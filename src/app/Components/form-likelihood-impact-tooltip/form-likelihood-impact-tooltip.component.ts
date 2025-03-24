import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-likelihood-impact-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-likelihood-impact-tooltip.component.html',
  styleUrl: './form-likelihood-impact-tooltip.component.scss'
})
export class FormLikelihoodImpactTooltipComponent {
  @Input() showModal: boolean = false;
  @Input() tableType: string = '';
  @Output() closeRiskModal = new EventEmitter<void>(); // Notify parent when closed

  likelihoodHeader = ['Likelihood', 'Definitions', 'Chance of Occurrence'];
  likelihoodRows = [
    ['Low', 'Minimal probability of occurrence.', '≤10%'],
    ['Medium', 'Moderate probability with some historical evidence.', '10-50%'],
    ['High', 'Significant probability based on trends.', '50-90%'],
    ['Critical', 'Almost certain to occur.', '≥90%']
  ];

  impactHeader = ['Impact', 'Definitions'];
  impactRows = [
    ['Low', 'Minimal effects on operations or finances.'],
    ['Medium', 'Moderate disruption or manageable losses.'],
    ['High', 'Major disruptions or substantial financial losses.'],
    ['Critical', 'Severe consequences, threatening operations.']
  ];

  // Emit event to notify parent on close
  close() {
    this.closeRiskModal.emit();
  }

}
