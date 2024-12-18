import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "../../UI/textarea/textarea.component";
import { OverallRatingCardComponent } from "../../UI/overall-rating-card/overall-rating-card.component";


@Component({
  selector: 'app-qms-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownComponent, ButtonComponent, CommonModule, TextareaComponent, OverallRatingCardComponent],
  templateUrl: './qms-form.component.html',
  styleUrl: './qms-form.component.scss'
})
export class QMSFormComponent {

  @Input() riskTypeValue: string=''
  data:any
  @Output() sendDataToParent = new EventEmitter<object>();
  isCustomSelected = false;

  selectedValue1: number  = 0;
  selectedValue2: number = 0;
  result: number = 0;



  qmsForm=new FormGroup({
    riskType:new FormControl(''),
    status:new FormControl(''),
    riskName:new FormControl(''),
    description:new FormControl(''),
    riskImpact:new FormControl(''),
    projectId:new FormControl(''),
    likelihood:new FormControl(''),
    impact:new FormControl(''),
    mitigation:new FormControl(''),
    contingency:new FormControl(''),
    responsibilityOfAction:new FormControl(''),
    plannedActionDate:new FormControl(''),
    reviewer:new FormControl()


  })


  dropdownDataLikelihood=[
    {"type":"Very Low","value":"0.1"},
    {"type":"Low","value":"0.2"},
    {"type":"Medium","value":"0.4"},
    { "type":"High","value":"0.8"},
    { "type":"Very High","value":"1"},
  ];

  dropdownDataImpact=[
    {"type":"Very Low","value":"10"},
    {"type":"Low","value":"20"},
    {"type":"Medium","value":"40"},
    { "type":"High","value":"80"},
    { "type":"Very High","value":"100"},
  ];

  dropdownDataReviewer=[
    {"name":"Achu s nair","email":"123"},
    {"name":"Shamna Sherin","email":"123"},
    {"name":"Deepak Denny","email":"123"},
    { "name":"Bindhya C Philip","email":"123"},
    { "name":"Vivek V N","email":"123"},
  ];

constructor(public api:ApiService){}

  ngOninit(){
    this.api.getRiskCurrentAssessment().subscribe((res:any)=>{
      this.data=res
      console.log(this.data)

    })


  }



  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
  }



  onsubmit(){

    const userConfirmed = window.confirm('Do you want to save?');
    if (userConfirmed) {
      this.saveData();
      this.qmsForm.get('riskType')?.setValue(this.riskTypeValue);
      this.qmsForm.get('status')?.setValue("open");

      console.log("Updated riskType value:", this.qmsForm.get('riskType')?.value);
      const formValue = this.qmsForm.getRawValue();

      this.sendDataToParent.emit(this.qmsForm.value);
      console.log("actual data");

      console.log(formValue);
    } else {
      alert('User canceled saving.');
    }


     }

     onDropdownChange1(value: any): void {
      this.selectedValue1 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
      this.updateResult();  // Update the result when a value is selected
    }

    // Method to handle value change for the second dropdown
    onDropdownChange2(value: any): void {
      this.selectedValue2 = value ? parseFloat(value.target.value) : 0; // Convert string value to number
      this.updateResult();  // Update the result when a value is selected
    }

    // Method to calculate the multiplication of both selected values
    updateResult(): void {
      const val1 = this.selectedValue1 ?? 0;  // If null or undefined, default to 0
      const val2 = this.selectedValue2 ?? 0;  // If null or undefined, default to 0

    //   if (val1 !== 0 && val2 !== 0) {
    //     this.result = parseFloat((val1 * val2).toFixed(2));  // Multiply if both values are non-zero
    //   } else {
    //     this.result = 0;  // Default to 0 if either value is not selected
    //   }


    if (this.selectedValue1 !== 0 && this.selectedValue2 !== 0) {
      // If both dropdowns are selected, calculate the multiplication result and set it to `a`
      this.result = parseFloat((val1 * val2).toFixed(2));
    } else if (this.selectedValue1 !== 0) {
      // If only the first dropdown is selected, update `a` with the first value
      this.result = this.selectedValue1;
    } else if (this.selectedValue2 !== 0) {
      // If only the second dropdown is selected, update `a` with the second value
      this.result= this.selectedValue2;
    }

    }

    getBackgroundColor() {
      if (this.result <= 30) {
        return { 'background-color': ' #4CAF50' };
      } else if (this.result >= 31 && this.result <= 99) {
        return { 'background-color': '#FFC107' };
      }
      else if(this.result>=100 && this.result<=300){
        return { 'background-color': '#FF5722' };

      }
      else{
       return{'background-color': 'transparent'}

      }

    }


    saveData() {
      alert('Data saved successfully!');

    }


}
