import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-conform-popup',
  standalone: true,
  imports: [],
  templateUrl: './form-conform-popup.component.html',
  styleUrl: './form-conform-popup.component.scss'
})
export class FormConformPopupComponent {
  @Input() message: string = 'Operation completed successfully!';
  @Input() bgColor:string=''
  @Output() closeDialog = new EventEmitter<void>();
  @Output() notCloseDialog = new EventEmitter<void>();
  constructor(private el: ElementRef){}



ngOnInit(){

  this.el.nativeElement.style.setProperty('--bg-color', this.bgColor);

}

  close() {
    this.closeDialog.emit();
  }
  notClose(){
    this.notCloseDialog.emit();
  }

}
