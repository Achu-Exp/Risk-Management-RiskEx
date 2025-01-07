import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-successfull',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-successfull.component.html',
  styleUrl: './form-successfull.component.scss'
})
export class FormSuccessfullComponent {
  @Input() message: string = 'Operation completed successfully!';
  @Input() isSuccessfull:boolean=true
  @Input() bgColor:string=''
  @Input() HeaderMessage:string=''


  @Output() closeDialog = new EventEmitter<void>();
  constructor(private el: ElementRef){}



ngOnInit(){

  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);

}

  close() {
    this.closeDialog.emit();
  }
}
