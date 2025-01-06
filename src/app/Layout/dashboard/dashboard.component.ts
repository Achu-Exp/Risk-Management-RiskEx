import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../Components/sidebar/sidebar.component';
import { NavbarComponent } from '../../UI/navbar/navbar.component';
import { CrumbsComponent } from '../../UI/crumbs/crumbs.component';
import { GlobalStateServiceService } from '../../Services/global-state-service.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    CrumbsComponent,

],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  navbarData: any = {};
  crumpList:any=[]

  constructor(private router: Router, private activatedRoute: ActivatedRoute,public globalState:GlobalStateServiceService) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const routeData = this.activatedRoute.firstChild?.snapshot.data;
      this.navbarData = routeData || {};
    });




  }

  Navigate(endpoint:string)
  {
    console.log("End",endpoint)
      this.router.navigate(["/"+endpoint])
  }
}
