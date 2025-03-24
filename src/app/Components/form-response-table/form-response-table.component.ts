import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-response-table',
  standalone: true,
  imports: [],
  templateUrl: './form-response-table.component.html',
  styleUrl: './form-response-table.component.scss'
})
export class FormResponseTableComponent {
  @Output() closeResponseTable = new EventEmitter<void>();

    close() {
      this.closeResponseTable.emit();
    }

}
