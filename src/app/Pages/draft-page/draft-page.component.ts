import { Component } from '@angular/core';
import { BodyContainerComponent } from "../../Components/body-container/body-container.component";
import { ReusableTableComponent } from "../../Components/reusable-table/reusable-table.component";
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth/auth.service';

@Component({
  selector: 'app-draft-page',
  standalone: true,
  imports: [BodyContainerComponent, ReusableTableComponent],
  templateUrl: './draft-page.component.html',
  styleUrl: './draft-page.component.scss'
})
export class DraftPageComponent {
 isLoading = false;

  constructor(private router: Router,private api:ApiService,private auth:AuthService) {}




headerData:any=[
"riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate",
];


headerDisplayMap: { [key: string]: string } = {


  riskName: "Risk Name",
  description: "Description",
  riskType: "Risk Type",
  overallRiskRating: "CRR",
  departmentName:'Department ',
  responsibleUser:'Responsible User',

  plannedActionDate:"End Date",

};

tableBody:any[]=[
  {

    riskName: '',
    description: '',
    riskType: '',
    overallRiskRating: 0,
    departmentName:"",
    responsibleUser:"",

    plannedActionDate: Date,

  },
]

ngOnInit()
{
    this.isLoading = true;
    if(this.auth.getUserRole()=="Admin")
    {
      this.headerData=[
        "riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","Action"
      ];

      this.tableBody=[
        {

          riskName: '',
          description: '',
          riskType: '',
          overallRiskRatingBefore: 0,
          departmentName:"",
          responsibleUserName:"",
          plannedActionDate: Date,

        },
      ]




      this.api.getDraftOfAdmin().subscribe((e:any)=>{

        this.tableBody=e;
        console.log("draftdata",e);

        this.isLoading = false;
      })
    }
    else{

      this.headerData=[
        "riskName","description","riskType","overallRiskRating",  "departmentName","responsibleUser","plannedActionDate","Action"
      ];
      this.tableBody=[
        {

          riskName: '',
          description: '',
          riskType: '',
          overallRiskRatingBefore: 0,
          departmentName:"",
          responsibleUserName:"",
          plannedActionDate: Date,

        },
      ]



      this.api.getDraft(this.auth.getDepartmentId()).subscribe((e:any)=>{
          console.log("draftdata",e);
        this.tableBody=e;
        this.isLoading = false;
      })

    }




}


onDraftEdited(row: any) {
  //console.log("draftrowdata",row);
    this.router.navigate([`/addrisk`],{queryParams:row});// depart name or id


}


onDraftDeleted(row: any) {
  console.log("Draftid",row.id);
  this.api.deleteDraft(row.id).subscribe((e:any)=>{
  });

  this.tableBody.forEach((item, index) => {
    if (item.id === row.id) {
      let templist=[...this.tableBody]
      templist.splice(index, 1);
      this.tableBody=[...templist]
    }
  })
}
}
