import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-risk-response',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-risk-response.component.html',
  styleUrl: './form-risk-response.component.scss'
})
export class FormRiskResponseComponent {
@Input() riskResponses:Array<{ id: number; name: string; description: string; example: string; risks:string }> = [];
@Output() selectedValueChange = new EventEmitter<any>();
@Input() label:string=''
@Input() required:string=''
@Output() infoClicked = new EventEmitter<boolean>();


selectedResponse: any = null

constructor(private el: ElementRef){}

onRadioChange(event: any) {
  this.selectedValueChange.emit(this.selectedResponse);
  console.log("selecetd value:",this.selectedResponse);



}

notifyParent() {
  this.infoClicked.emit(true);
}
}
