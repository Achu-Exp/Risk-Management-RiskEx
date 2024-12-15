
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './body-container.component.html',
  styleUrl: './body-container.component.scss'
})
export class BodyContainerComponent {

  @Input() backgroundColor="white"
   @Input() showShadow=true;
   @Input() padding='70'
}
