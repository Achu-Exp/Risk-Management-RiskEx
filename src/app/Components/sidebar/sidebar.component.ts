import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'fa-solid fa-house', route: '/home', active: false },
    { id: 2, label: 'Users', icon: 'fa-solid fa-user', route: '/users', active: false },
    { id: 3, label: 'History', icon: 'fa-solid fa-clipboard', route: '/history', active: false },
    // { id: 4, label: 'Reports', icon: 'bi-bar-chart', route: '/reports', active: false },
    { id: 5, label: 'Approvals', icon: 'fa-solid fa-clock-rotate-left', route: '/approvaltable', active: false },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.setActiveFromRoute(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveFromRoute(event.urlAfterRedirects);
      }
    });
  }

  setActiveItem(selectedItem: any) {
    this.menuItems.forEach((item) => (item.active = false));
    selectedItem.active = true;
    this.router.navigate([selectedItem.route]);
  }

  setActiveFromRoute(currentRoute: string) {
    this.menuItems.forEach((item) => {
      item.active = item.route === currentRoute;
    });
  }
}
