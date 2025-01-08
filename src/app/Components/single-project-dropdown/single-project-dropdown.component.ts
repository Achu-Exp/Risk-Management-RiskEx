import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { project } from '../../Interfaces/projects.interface';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-single-project-dropdown',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './single-project-dropdown.component.html',
  styleUrl: './single-project-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleProjectDropdownComponent),
      multi: true
    }
  ]
})
export class SingleProjectDropdownComponent implements OnChanges, ControlValueAccessor {
  @Input() departmentName: string = '';
  @Output() projectSelected = new EventEmitter<project>();

  dropdownOpen = false;
  selectedProject: project | null = null;
  displayValue: string = 'Select Project';
  projects: project[] = [];
  disabled = false;
  loading = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private api: ApiService, public authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['departmentName']) {
      if (this.departmentName) {
        this.loadProjectsForDepartment();
      } else {
        this.resetComponent();
      }
    }
  }

  private resetComponent() {
    this.projects = [];
    this.selectedProject = null;
    this.displayValue = 'Select Project';
    this.dropdownOpen = false;
    this.loading = false;
    this.emitChanges();
  }

  loadProjectsForDepartment() {
    this.loading = true;
    this.dropdownOpen = false;

    this.api.getProjects(this.departmentName).subscribe({
      next: (response: project[]) => {
        this.projects = response;
        this.loading = false;
        console.log('Projects fetched successfully:', this.projects);
      },
      error: (error) => {
        console.error('Failed to fetch projects', error);
        this.resetComponent();
      }
    });
  }

  toggleDropdown() {
    if (!this.disabled && this.projects.length > 0) {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        this.onTouched();
      }
    }
  }

  selectProject(project: project) {
    this.selectedProject = project;
    this.displayValue = project.name;
    this.dropdownOpen = false;
    this.emitChanges();
    this.projectSelected.emit(project);
  }

  private emitChanges() {
    this.onChange(this.selectedProject?.name || null);
  }

  writeValue(value: string): void {
    const project = this.projects.find(p => p.id.toString() === value);
    if (project) {
      this.selectedProject = project;
      this.displayValue = project.name;
    } else {
      this.selectedProject = null;
      this.displayValue = 'Select Project';
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.single-dropdown-content');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }
}
