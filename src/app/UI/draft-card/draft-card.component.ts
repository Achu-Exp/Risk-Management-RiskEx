import { Component, Input } from '@angular/core';
import { EditButtonComponent } from "../edit-button/edit-button.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";

@Component({
  selector: 'app-draft-card',
  standalone: true,
  imports: [EditButtonComponent, BodyContainerComponent],
  templateUrl: './draft-card.component.html',
  styleUrl: './draft-card.component.scss'
})
export class DraftCardComponent {

  @Input() data:any={}

}
