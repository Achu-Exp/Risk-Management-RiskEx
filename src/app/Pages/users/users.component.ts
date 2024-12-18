import { department } from './../../Interfaces/deparments.interface';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BodyContainerComponent } from '../../Components/body-container/body-container.component';
import { ApiService } from '../../Services/api.service';
import {  NgFor, NgIf } from '@angular/common';
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BodyContainerComponent,
    NgIf,
    NgFor,
    ReusableTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  departments: department[] = [];

  projects: any[] = [];

  userForm: FormGroup;
  departmentForm: FormGroup;
  projectForm: FormGroup;

  constructor(public api: ApiService) {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', Validators.required),
      projectName: new FormControl(''),
    });
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.api.getDepartment().subscribe(
      (response) => {
        this.departments = response;
        console.log('Departments fetched successfully:', this.departments);
      },
      (error) => {
        console.error('Failed to fetch departments', error);
      }
    );
  }

  onDepartmentChange(event: any) {
    const selectedDepartment = event.target.value;
    console.log('Selected Department:', selectedDepartment);

    if (selectedDepartment) {
      this.api.getProjects(selectedDepartment).subscribe(
        (projects) => {
          if (projects && projects.length > 0) {
            this.projects = projects;
            console.log('Projects loaded for department:', this.projects);
          } else {
            console.log('No projects found for the selected department');
            this.projects = [];
          }
        },
        (error) => {
          console.error('Failed to load projects', error);
          this.projects = [];
        }
      );
    }
  }

  onSubmitDepartment() {
    if (this.departmentForm.valid) {
      const departmentData = this.departmentForm.value;

      this.api.addNewDepartment(departmentData).subscribe(
        (response) => {
          console.log('Department added successfully:', response.message);

          this.departmentForm.reset();

          const modal = document.getElementById('addDepartmentModal');
          if (modal) {
            (modal as HTMLElement).click();
          }

          console.log('Modal closed after saving department.');
        },
        (error) => {
          console.error('Failed to add the department', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      console.log('User saved:', this.userForm.value);
      // alert(`User "${this.userForm.value.name}" added successfully!`);
      this.userForm.reset();
      const modal = document.getElementById('addUserModal');
      if (modal) {
        (modal as HTMLElement).click();
      }
    } else {
      console.log('Form invalid');
    }
  }

  onSubmitProject() {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      this.api.addNewProject(projectData).subscribe(
        (response) => {
          console.log('Project saved successfully:', response);

          this.projectForm.reset();

          const modal = document.getElementById('addProjectModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        (error) => {
          console.error('Failed to save project:', error);
          console.log('Error saving project. Please try again.');
        }
      );
    } else {
      console.log('Form invalid');
    }
  }


  headerData: any = ['Name', 'Email', 'Department', 'Projects'];
  tableBody: any = [
    {
      Name: 'John Doe',
      Email: 'john.doe@example.com',
      Department: 'Engineering',
      Projects: 'Project A, Project B',
    },
    {
      Name: 'Jane Smith',
      Email: 'jane.smith@example.com',
      Department: 'Marketing',
      Projects: 'Campaign X, Campaign Y',
    },
    {
      Name: 'Alice Johnson',
      Email: 'alice.johnson@example.com',
      Department: 'HR',
      Projects: 'Recruitment, Employee Engagement',
    },
  ];
}
