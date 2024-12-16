import { Component } from '@angular/core';
import { QmsEditComponent } from "../../Components/qms-edit/qms-edit.component";
import { IsmsEditComponent } from "../../Components/isms-edit/isms-edit.component";

@Component({
  selector: 'app-edit-risk',
  standalone: true,
  imports: [QmsEditComponent, IsmsEditComponent],
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent {

  riskType:string='Security'

}
