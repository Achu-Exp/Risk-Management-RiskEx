import { department } from './../../Interfaces/deparments.interface';
import { Component, HostListener, Input, Output, output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../UI/searchbar/searchbar.component';
import { PaginationComponent } from '../../UI/pagination/pagination.component';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatepickerComponent } from "../../UI/datepicker/datepicker.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SearchbarComponent, FormsModule, PaginationComponent, CommonModule, DatepickerComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  constructor( public api: ApiService,private route:ActivatedRoute,private router: Router){}

   onclickrow = output()
    rowClick(row:any) {

      this.onclickrow.emit(row);
      }

  items:any=[];
  // paginatedItems:any=[];
  isActive = true;
  isDisabled = false;
  open = true;
  closed = false;
  isButtonVisible = false;

  @Input() paginated:any=[];
  filteredItems = [...this.items];
  isDepartmentDropdownOpen: boolean = false;
  isTypeDropdownOpen: boolean = false;
  isStatusDropdownOpen:boolean =false;
  isReviewStatusDropdownOpen:boolean =false;
  isResidualRiskDropdownOpen:boolean =false;

  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number = 0;

  // Filter dropdown values
  selectedRiskId = '';
  selectedRiskType = '';
  selectedDepartment = '';
  selectedStatus = '';
  selectedReviewStatus = '';
  selectedResidual ='';

  // uniqueRiskIds: string[] = [];
  uniqueRiskTypes: any[] = [];
  uniqueDepartments: any[] = [];
  uniqueStatus: any[] = [];
  uniqueReviewStatus: any[] = [];
  uniqueResidual:any[]=[];

  @Output() filteredData = new EventEmitter<any[]>();


  filterTable(): void {

    this.filteredItems = this.items.filter((item:any) => {
      let matchesDateRange = true;

      if (this.filteredDateRange) {
        const { startDate, endDate } = this.filteredDateRange;

        if (startDate && endDate) {
          const itemDate = new Date(item.plannedActionDate);
          console.log("Database date parsed:",itemDate);
          const start = new Date(startDate);
          console.log("start", start);
          const end = new Date(endDate);

          matchesDateRange = itemDate >= start && itemDate <= end ;
        }
      }

      return (
        matchesDateRange &&
        (this.selectedRiskType ? item.riskType === this.selectedRiskType : true) &&
        (this.selectedStatus ? item.riskStatus === this.selectedStatus : true) &&
        (this.selectedResidual ? item.residualRisk === this.selectedResidual : true) &&
        (this.selectedReviewStatus ? item.riskAssessments[0].reviewStatus  === this.selectedReviewStatus : true) &&
        (this.selectedDepartment ? item.departmentName === this.selectedDepartment : true)
      );

    });
  console.log("filtered",this.filteredItems)
  this.currentPage = 1;
  this.totalItems = this.filteredItems.length;
  this.updatePaginatedItems();
  // this.filteredData.emit(this.filteredItems);

  }


  onSearch(searchText: string): void {
    const lowercasedSearchText = searchText.toLowerCase();
    console.log(lowercasedSearchText);

    this.filteredItems = this.items.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value != null && value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );

    this.currentPage = 1;
    this.totalItems = this.filteredItems.length;
    this.updatePaginatedItems();
  }



  ngOnInit(): void {

    this.initializeItems();
    const currentRoute = this.route.snapshot.url.join('/');
    console.log(currentRoute);

    if (currentRoute === 'history') {
      this.isButtonVisible = true;
    } else if (currentRoute === 'home') {
      this.isButtonVisible = false;
    }

    this.updatePaginatedItems();
  }

  private initializeItems(): void {
    setTimeout(()=>{
      this.items = [...this.paginated];
      console.log("items",this.items);
      this.filteredItems = [...this.items];
      console.log(this.filteredItems);
      this.updateUniqueDepartments();
      this.updateUniqueTypes();
      this.updateUniqueReviewStatus();
      this.updateUniqueStatus();
      this.updateResidualRiskStatus();
      this.totalItems = this.filteredItems.length;
      this.updatePaginatedItems();


      },1000)
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
  updateUniqueStatus(): void {

    this.uniqueStatus = ["close","open"];
  }
  updateUniqueReviewStatus(): void {

    this.uniqueReviewStatus = ["ReviewPending","ReviewCompleted","ApprovalPending","ApprovalCompleted","Rejected","HasValue"];
  }
  updateResidualRiskStatus(): void {

    this.uniqueResidual = ["Low","Medium","High"];
  }

  updatePaginatedItems(): void {
    console.log("insie",this.filteredItems)
    const startIndex = (this.currentPage -1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginated = this.filteredItems.slice(startIndex, endIndex);
    this.totalItems = this.filteredItems.length;
    // this.itemsPerPage=this.paginated.length;
    this.filteredData.emit(this.filteredItems);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }



  toggleDepartmentDropdown(): void {
    this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }

  toggleTypeDropdown(): void {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleStatusDropdown(): void {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleReviewStatusDropdown(): void {
    this.isReviewStatusDropdownOpen = !this.isReviewStatusDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isResidualRiskDropdownOpen = false;
  }
  toggleResidualDropdown(): void {
    this.isResidualRiskDropdownOpen = !this.isResidualRiskDropdownOpen;
    this.isDepartmentDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isReviewStatusDropdownOpen = false;
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
  onStatusSelect(status: string): void {
    this.selectedStatus = status;
    console.log(this.selectedStatus);
    this.isStatusDropdownOpen = false;
    this.filterTable();
  }
  onReviewStatusSelect(status: string): void {
    this.selectedReviewStatus = status;
    console.log(this.selectedReviewStatus);
    this.isReviewStatusDropdownOpen = false;
    this.filterTable();
  }
  onResidualSelect(status: string): void {
    this.selectedResidual = status;
    console.log(this.selectedResidual);
    this.isResidualRiskDropdownOpen = false;
    this.filterTable();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDepartmentDropdownOpen = false;
      this.isTypeDropdownOpen = false;
      this.isStatusDropdownOpen = false;
      this.isReviewStatusDropdownOpen = false;
    }
  }

  // resetFilters(): void {
  //   this.filteredItems = [...this.items];
  //   this.currentPage = 1;
  //   this.totalItems = this.filteredItems.length;
  //   this.updatePaginatedItems();
  // }


  //datepicker
  @Input() filteredDateRange: { startDate: string; endDate: string } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredDateRange'] && this.filteredDateRange) {

      this.filterTable();
    }


  }
  shouldDisplayPagination(): boolean {
    console.log(this.paginated.length)
    return this.filteredItems.length > this.itemsPerPage;

  }
}
