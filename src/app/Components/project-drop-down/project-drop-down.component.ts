import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { project } from '../../Interfaces/projects.interface';

@Component({
  selector: 'app-project-drop-down',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './project-drop-down.component.html',
  styleUrl: './project-drop-down.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectDropDownComponent),
      multi: true
    }
  ]
})
export class ProjectDropDownComponent implements OnChanges, ControlValueAccessor {
  @Input() departmentName: string = '';
  @Output() selectedProjectsChange = new EventEmitter<project[]>();

  dropdownOpen = false;
  selectedItems: project[] = [];
  selectedProject: string = 'Select Projects';
  filteredProjects: project[] = [];
  disabled = false;
  loading = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['departmentName']) {
      if (this.departmentName) {
        this.loadProjectsForDepartment();
      } else {
        // Reset when department is cleared
        this.resetComponent();
      }
    }
  }

  private resetComponent() {
    this.filteredProjects = [];
    this.selectedItems = [];
    this.dropdownOpen = false;
    this.loading = false;
    this.updateSelectedProject();
    this.emitChanges();
  }

  loadProjectsForDepartment() {
    this.loading = true;
    this.dropdownOpen = false;

    this.api.getProjects(this.departmentName).subscribe(
      (response: project[]) => {
        this.filteredProjects = response;
        this.selectedItems = [];
        this.updateSelectedProject();
        this.emitChanges();
        this.loading = false;
        console.log('Projects fetched successfully:', this.filteredProjects);
      },
      (error) => {
        console.error('Failed to fetch projects', error);
        this.resetComponent();
      }
    );
  }

  toggleDropdown() {
    if (!this.disabled && this.filteredProjects.length > 0) {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        this.onTouched();
      }
    }
  }

  toggleSelection(item: project) {
    const index = this.selectedItems.findIndex(
      (selected) => selected.id === item.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectedProject();
    this.emitChanges();
  }

  isSelected(item: project) {
    return this.selectedItems.some((selected) => selected.id === item.id);
  }

  selectAll() {
    if (this.selectedItems.length === this.filteredProjects.length) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.filteredProjects];
    }
    this.updateSelectedProject();
    this.emitChanges();
  }

  isAllSelected() {
    return this.selectedItems.length === this.filteredProjects.length && this.filteredProjects.length > 0;
  }

  updateSelectedProject() {
    if (this.selectedItems.length > 0) {
      this.selectedProject = this.selectedItems
        .map((proj) => proj.projectName)
        .join(', ');
    } else {
      this.selectedProject = 'Select Projects';
    }
  }

  private emitChanges() {
    this.selectedProjectsChange.emit(this.selectedItems);
    this.onChange(this.selectedItems);
  }

  // ControlValueAccessor methods
  writeValue(value: project[]): void {
    if (value) {
      this.selectedItems = value;
      this.updateSelectedProject();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
