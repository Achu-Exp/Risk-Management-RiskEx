import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-crumbs',
  standalone: true,
  imports: [RouterLink,NgFor,NgIf],
  templateUrl: './crumbs.component.html',
  styleUrl: './crumbs.component.scss'
})
  export class CrumbsComponent implements OnInit {
    breadcrumbs: any= [];

    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
          console.log("crumbs",this.breadcrumbs);

        });
    }

    public createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any = []): any {
      const children: ActivatedRoute[] = route.children;

      if (children.length === 0) {
        return breadcrumbs;
      }



      for (const child of children) {

        const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
        console.log("route url",routeURL)
        console.log("urllll",url)
        if (routeURL !== '') {
          url += `/${routeURL}`;
          console.log('url:',url);

        }

        const label = child.snapshot.data['breadcrumb'];
        if (label) {
          breadcrumbs.push({ label, url });
        }


        return this.createBreadcrumbs(child, url, breadcrumbs);
      }



      return breadcrumbs;
    }
  }
