import { Component, Input } from '@angular/core';
import { RiskBasicDetailsCardComponent } from "../../Components/risk-basic-details-card/risk-basic-details-card.component";
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { RiskDetailsSection2Component } from "../../Components/risk-details-section2/risk-details-section2.component";
import { RiskDetailsSection3MitigationComponent } from "../../Components/risk-details-section3-mitigation/risk-details-section3-mitigation.component";
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-risk',
  standalone: true,
  imports: [RiskBasicDetailsCardComponent, BodyContainerComponent, RiskDetailsSection2Component, RiskDetailsSection3MitigationComponent],
  templateUrl: './view-risk.component.html',
  styleUrl: './view-risk.component.scss'
})
export class ViewRiskComponent {

  data:any=[]

  constructor(public api:ApiService,public route:ActivatedRoute)
  {

  }

  ngOnInit()
  {
    let id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.api.getRiskById(id).subscribe(e=>{
      console.log("Data=",e)
      this.data=e
    })
  }


}
