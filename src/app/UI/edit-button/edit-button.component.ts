import { Component, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.scss'
})
export class EditButtonComponent {


  onClick=output()
  @Input() icon=""

  onClicked()
  {
    this.onClick.emit()
  }


}
