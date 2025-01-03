import { department } from './../../Interfaces/deparments.interface';
import { Component, HostListener, Input, output, SimpleChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { PaginationComponent } from '../../UI/pagination/pagination.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SearchbarComponent, FormsModule, PaginationComponent, CommonModule,],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  constructor( public api: ApiService,private route:ActivatedRoute){}

   onclickrow = output()
    rowClick(row:any) {

      this.onclickrow.emit(row);
      }

  items:any=[];
  paginatedItems:any=[];
  isActive = true;
  isDisabled = false;
  open = true;
  closed = false;
  isButtonVisible = false;
  checkPageForButtonVisibility(): void {
    const currentRoute = this.route.snapshot.url.join('/'); // Get current route path
    console.log(currentRoute);

    if (currentRoute === 'history') {
      this.isButtonVisible = false; // Hide button on page1
    } else if (currentRoute === 'home') {
      this.isButtonVisible = true; // Show button on page2
    }
  }

  @Input() paginated:any=[];
  filteredItems = [...this.items];
  isDepartmentDropdownOpen: boolean = false;
  isTypeDropdownOpen: boolean = false;

  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;

  // Filter dropdown values
  selectedRiskId = '';
  selectedRiskType = '';
  selectedDepartment = '';

  // uniqueRiskIds: string[] = [];
  uniqueRiskTypes: any[] = [];
  uniqueDepartments: any[] = [];


  filterTable(): void {

    this.filteredItems = this.items.filter((item:any) => {
      let matchesDateRange = true;

      if (this.filteredDateRange) {
        const { startDate, endDate } = this.filteredDateRange;

        if (startDate && endDate) {
          const itemDate = new Date(item.closedDate);
          console.log("Database date parsed:", itemDate);
          const start = new Date(startDate);
          console.log("start", start);
          const end = new Date(endDate);

          matchesDateRange = itemDate >= start && itemDate <= end ;
        }
      }

      return (
        matchesDateRange &&
        (this.selectedRiskType ? item.riskType === this.selectedRiskType : true) &&
        (this.selectedDepartment ? item.departmentName === this.selectedDepartment : true)
      );
      // return (
        // (this.selectedRiskId ? item.riskId === this.selectedRiskId : true) &&
      //   (this.filteredDateRange ? item.closedDate === this.filteredDateRange : true) &&
      //   (this.selectedRiskType ? item.riskType === this.selectedRiskType : true) &&
      //   (this.selectedDepartment ? item.departmentName === this.selectedDepartment : true)
      // );
    });
  console.log("filtered",this.filteredItems)
  this.currentPage = 1;
  this.totalItems = this.filteredItems.length;
  this.updatePaginatedItems();
  }


  onSearch(searchText: string): void {
    const lowercasedSearchText = searchText.toLowerCase();
    this.filteredItems = this.items.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );

    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }

  shouldDisplayPagination(): boolean {
    return this.filteredItems.length > this.itemsPerPage;
  }


  ngOnInit(): void {

    setTimeout(()=>{
    this.items = [...this.paginated];
    console.log("items",this.items);
    this.filteredItems = [...this.items];
    console.log(this.filteredItems);
    this.updateUniqueDepartments();
    this.updateUniqueTypes();
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
    this.route.url.subscribe(() => {
        this.checkPageForButtonVisibility();
      });


    },1000)
    this.updatePaginatedItems();

  }

  updateUniqueDepartments(): void {
    // this.api.getDepartment().subscribe((res: any) => {
    //   this.uniqueDepartments = res
    //   console.log("dep",this.uniqueDepartments);
    // });
    this.uniqueDepartments = [...new Set(this.items.map((item: any) => item.departmentName))];

  }

  updateUniqueTypes(): void {

    this.uniqueRiskTypes = ["Quality","Privacy","Security"];
  }

  updatePaginatedItems(): void {
    console.log("insie",this.filteredItems)
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginated = this.filteredItems.slice(startIndex, endIndex);
    this.totalItems = this.filteredItems.length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }



  toggleDepartmentDropdown(): void {
    this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
    this.isTypeDropdownOpen = false;
  }

  toggleTypeDropdown(): void {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
    this.isDepartmentDropdownOpen = false;
  }


  onDepartmentSelect(department: string): void {
    this.selectedDepartment = department;
    this.isDepartmentDropdownOpen = false;
    this.filterTable();
  }
  onTypeSelect(type: string): void {
    this.selectedRiskType = type;
    console.log(this.selectedRiskType);
    this.isTypeDropdownOpen = false;
    this.filterTable();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDepartmentDropdownOpen = false;
      this.isTypeDropdownOpen = false;
    }
  }

  resetFilters(): void {
    this.filteredItems = [...this.items];
    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }


  //datepicker
  @Input() filteredDateRange: { startDate: string; endDate: string } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredDateRange'] && this.filteredDateRange) {

      this.filterTable();
    }
  }
}
