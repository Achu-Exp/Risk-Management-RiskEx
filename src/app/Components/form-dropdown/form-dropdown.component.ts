
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DropdownComponent } from '../../UI/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [DropdownComponent,CommonModule],
  templateUrl: './form-dropdown.component.html',
  styleUrl: './form-dropdown.component.scss'
})
export class FormDropdownComponent  {

  @Input() dropdownData:any[]=[]
  @Input() dropdownDisplay:string=''
  @Input() dropdownValue:string=''
   @Input() dropdownCode:string=''
    @Input() showInfoButton:boolean=false
  @Input() label:string=''
  @Input() required:string=''
  @Input() selectValue:string=''
  @Output() change = new EventEmitter<any>();
  @Input() selectedValue: any = null;
  @Input() openDropdownId: string | undefined = undefined; // Get from parent
  @Output() openDropdown = new EventEmitter<string>(); // Notify parent
  @Input() message:string=''
  @Input() backgroundColor:string=''
  @Input() showInfoButtonLikeliHoodImpact:boolean=false
  @Output() infoClicked = new EventEmitter<boolean>();
  notifyParent() {
    this.infoClicked.emit(true);
  }





  onChange(event: any): void {


    this.change.emit(event);


  }






  dropdownId = Math.random().toString(36).substring(2, 9); // Generate unique ID

  toggleDropdown() {
    this.openDropdown.emit(this.dropdownId); // Notify parent

  }

  get isDropdownOpen() {
    return this.openDropdownId === this.dropdownId;
  }



}
