import { Component, Input } from '@angular/core';
import { DropdownComponent } from "../../UI/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-isms',
  standalone: true,
  imports: [DropdownComponent,CommonModule,FormsModule],
  templateUrl: './update-isms.component.html',
  styleUrl: './update-isms.component.scss'
})
export class UpdateIsmsComponent {
@Input() riskTypeValue: string=''
result: number = 0;
reviewerNotInList:boolean=false
assigneeNotInList:boolean=false
isAdmin:string='admin'
likelihoodValue:number=0
impactValue:number=0
riskFactor:number=0
selectedResponse: string = '';

confidentialityRiskFactor:number=0
integrityRiskFactor:number=0
availabilityRiskFactor:number=0
privacyRiskFactor:number=0
confidentialityLikelihoodValue:number=0
confidentialityImpactValue:number=0
integrityLikelihoodValue:number=0
integrityImpactValue:number=0
availabilityLikelihoodValue:number=0
availabilityImpactValue:number=0
privacyLikelihoodValue:number=0
privacyImpactValue:number=0



  dropdownDataLikelihood=[
    { "type":"Select Likelihood","value":""},
    {"type":"Low","value":"0.1"},
    {"type":"Medium","value":"0.2"},
    { "type":"High","value":"0.4"},
    { "type":"Critical","value":"0.6"}
  ];

  dropdownDataImpact=[
    { "type":"select Impact","value":""},
    {"type":"Low","value":"10"},
    {"type":"Medium","value":"20"},
    { "type":"High","value":"40"},
    { "type":"Critical","value":"80"}
  ];

  dropdownDataReviewer=[
    {"name":"Select--","email":""},
    {"name":"Achu s nair","email":"123"},
    {"name":"Shamna Sherin","email":"123"},
    {"name":"Deepak Denny","email":"123"},
    { "name":"Bindhya C Philip","email":"123"},
    { "name":"Vivek V N","email":"123"},
  ];

  dropdownDataProject=[
    {"name":"Select--","id":""},
    {"name":"japanese training","id":"p12-34"},
    {"name":"risk management","id":"p-34-56"},
    {"name":"pit-stop","id":"p34-54"},
    { "name":"query management","id":"p01-01"},
    { "name":"HR inventory","id":"p03-3"},
  ];

  dropdownDataDepartment=[
    {"name":"Select--","id":""},
    {"name":"SFM","id":"1"},
    {"name":"ACE","id":"2"},
    {"name":"HR","id":"3"},
    { "name":"L&D","id":"4"},
    { "name":"DU1","id":"5"},
  ];

  riskResponses = [
  { id: 1, label: "Avoid" },
  { id: 2, label: "Mitigate" },
  { id: 3, label: "Transfer" },
  { id: 4, label: "Accept" }
  ];

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const minHeight = 40;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }

  isReviewerNotInList(){
    this.reviewerNotInList=!this.reviewerNotInList
  }

  isAssigneeNotInList(){
    this.assigneeNotInList=!this.assigneeNotInList
  }

  onDropdownChange(value: any, type: string, category: string): void {
    const parsedValue = value ? parseFloat(value.target.value) : 0;

    switch (category) {
      case 'Confidentiality':
        if (type === 'Likelihood') {
          this.confidentialityLikelihoodValue = parsedValue;
        } else if (type === 'Impact') {
          this.confidentialityImpactValue = parsedValue;
        }
        this.calculateRiskFactor('Confidentiality');
        break;

      case 'Integrity':
        if (type === 'Likelihood') {
          this.integrityLikelihoodValue = parsedValue;
        } else if (type === 'Impact') {
          this.integrityImpactValue = parsedValue;
        }
        this.calculateRiskFactor('Integrity');
        break;

      case 'Availability':
        if (type === 'Likelihood') {
          this.availabilityLikelihoodValue = parsedValue;
        } else if (type === 'Impact') {
          this.availabilityImpactValue = parsedValue;
        }
        this.calculateRiskFactor('Availability');
        break;

      case 'Privacy':
        if (type === 'Likelihood') {
          this.privacyLikelihoodValue = parsedValue;
        } else if (type === 'Impact') {
          this.privacyImpactValue = parsedValue;
        }
        this.calculateRiskFactor('Privacy');
        break;
    }
  }

  calculateRiskFactor(category: string): void {
    switch (category) {
      case 'Confidentiality':
        this.confidentialityRiskFactor = this.confidentialityLikelihoodValue * this.confidentialityImpactValue;
        break;

      case 'Integrity':
        this.integrityRiskFactor = this.integrityLikelihoodValue * this.integrityImpactValue;
        break;

      case 'Availability':
        this.availabilityRiskFactor = this.availabilityLikelihoodValue * this.availabilityImpactValue;
        break;

      case 'Privacy':
        this.privacyRiskFactor = this.privacyLikelihoodValue * this.privacyImpactValue;
        break;
    }
    if(this.confidentialityRiskFactor !=0 && this.integrityRiskFactor !=0 && this.availabilityRiskFactor !=0 && this.privacyRiskFactor !=0){

      this.result= this.confidentialityRiskFactor + this.integrityRiskFactor + this.availabilityRiskFactor + this.privacyRiskFactor
    }
  }

  changeColorOverallRiskRating(){
    if(this.result<30){
      return '#6DA34D';
    }
    if(this.result>31 && this.result<99){
      return '#FFC107'
    }
    else{
      return '#D9534F'
    }
  }

}