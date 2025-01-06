import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UsericonDropdownComponent } from "../../UI/usericon-dropdown/usericon-dropdown.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, UsericonDropdownComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  showThemeOverlay=false;
  menuItems = [
    { id: 1, label: 'Dashboard', icon: 'fa-solid fa-house', route: '/home', active: false },
    {id: 2, label: "Assignments", icon: "fa-solid fa-tasks", route: "/assignee",active: false},
    { id: 3, label: 'Approvals', icon: ' fa-solid fa-clipboard-check', route: '/approval-layout/approvaltable', active: false },
    { id: 4, label: 'Reports', icon: 'fa-solid fa-chart-line', route: '/reports', active: false },
    { id: 5, label: 'History', icon: 'fa-solid fa-clock-rotate-left', route: '/history', active: false },
    { id: 6, label: 'User Mangement', icon: 'fa-solid fa-users', route: '/users', active: false },
    { id: 7, label: 'Reference', icon: 'fa-solid fa-book', route: '/reference', active: false }

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

  setTheme(theme:any) {
    document.body.className = theme; // Apply the theme class to <body>
  }

  onMouseClick()
  {

      if(this.showThemeOverlay)
      document.getElementById("header-options-overlay")!.style.display="block"
      else
      document.getElementById("header-options-overlay")!.style.display="none"
      this.showThemeOverlay=!this.showThemeOverlay



  }

}
