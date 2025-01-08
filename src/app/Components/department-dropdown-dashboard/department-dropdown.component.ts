import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { department } from '../../Interfaces/deparments.interface';

@Component({
  selector: 'app-department-dropdown',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './department-dropdown.component.html',
  styleUrl: './department-dropdown.component.scss',
})
export class DepartmentDropdownComponent {
  dropdownOpen = false;
  searchTerm = '';
  selectedItems: department[] = [];
  selectedDepartment: string = 'Select Department';
  @Output() departmentsSelected: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor(public api: ApiService) {}

  dropdownOptions: department[] = [];
  selectedDepartmentIds: number[] = [];

  ngOnInit() {
    this.api.getDepartment().subscribe({
      next: (response: department[]) => {
        this.dropdownOptions = this.sortDepartments(response);
        console.log('Departments fetched and sorted successfully:', this.dropdownOptions);
      },
      error: (error) => {
        console.error('Failed to fetch departments', error);
      }
    });
  }

  private sortDepartments(departments: department[]): department[] {
    return departments.sort((a, b) => {
      const nameA = a.departmentName?.toLowerCase() || '';
      const nameB = b.departmentName?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }

  filterOptions() {
    const term = this.searchTerm.toLowerCase().trim();
    const filtered = this.dropdownOptions.filter((option: department) =>
      option.departmentName?.toLowerCase().includes(term)
    );
    return this.sortDepartments(filtered);
  }

  extractDepartmentIdsAndFetchData() {
    this.selectedItems = this.sortDepartments(this.selectedItems);
    this.selectedDepartmentIds = this.selectedItems.map(item => item.id);
    console.log('Extracted Department IDs:', this.selectedDepartmentIds);

    if (this.selectedDepartmentIds.length > 0) {
      this.departmentsSelected.emit(this.selectedDepartmentIds);
    } else {
      console.error('No department IDs selected.');
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('Dropdown Open State:', this.dropdownOpen);
  }

  toggleSelection(item: department) {
    const index = this.selectedItems.findIndex(
      (selected) => selected.id === item.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectedItems = this.sortDepartments(this.selectedItems);
    this.updateSelectedDepartment();
    this.extractDepartmentIdsAndFetchData();
  }

  isSelected(item: department) {
    return this.selectedItems.some((selected) => selected.id === item.id);
  }

  selectAll() {
    if (this.selectedItems.length === this.dropdownOptions.length) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.dropdownOptions];
    }
    this.selectedItems = this.sortDepartments(this.selectedItems);
    this.updateSelectedDepartment();
    this.extractDepartmentIdsAndFetchData();
  }

  isAllSelected() {
    return this.selectedItems.length === this.dropdownOptions.length;
  }

  updateSelectedDepartment() {
    if (this.selectedItems.length > 0) {
      const sortedItems = this.sortDepartments(this.selectedItems);
      this.selectedDepartment = sortedItems
        .map((dept) => dept.departmentName)
        .join(', ');
    } else {
      this.selectedDepartment = 'Select Department';
    }
    console.log(
      'Selected Departments:',
      this.selectedItems.map((d) => d.departmentName)
    );
  }

  passToOtherComponent() {
    const sortedItems = this.sortDepartments(this.selectedItems);
    console.log(
      'Passing selected departments to another component:',
      sortedItems
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  
}
