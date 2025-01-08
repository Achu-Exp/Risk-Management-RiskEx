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
import { ReusableTableComponent } from '../../Components/reusable-table/reusable-table.component';

import { ProjectDropDownComponent } from '../../Components/project-drop-down/project-drop-down.component';
import { project } from '../../Interfaces/projects.interface';
import { DropDownDeparmentComponent } from '../../Components/drop-down-deparment/drop-down-deparment.component';
import { StyleButtonComponent } from '../../UI/style-button/style-button.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BodyContainerComponent,
    ReusableTableComponent,
    ProjectDropDownComponent,
    DropDownDeparmentComponent,
    StyleButtonComponent,
    NgIf,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  departments: department[] = [];
  projects: any[] = [];
  isDepartmentFieldDisabled = false;
  isAdmin: boolean = false;

  headerData: string[] = [];
  headerDataDpt:string[]=['fullName','email','projects'];
  headerDisplayMap: { [key: string]: string } = {
    fullName:'Name',
    email: 'Email Id',
    department: 'Department',
    projects:'Projects'
  };
tableBodyAdmin:any[]=[
  {
  fullName:'',
  email:'',
  department:'',
  projects:''
  }
]
tableBody:any[]=[
  {
    fullName:'',
  email:'',
  projects:[]
  }
]
  userForm: FormGroup;
  departmentForm: FormGroup;
  projectForm: FormGroup;

  constructor(public api: ApiService, public authService: AuthService) {
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      departmentCode:new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      departmentName: new FormControl('', Validators.required),
      projectNames: new FormControl([[]]),
    });
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
      projectCode: new FormControl('', Validators.required),
    });
  }




 private refreshUsersData() {
    const userRole = this.authService.getUserRole();
    if (userRole === 'Admin') {
      this.api.getAllUsers().subscribe({
        next: (users: any) => {
          this.tableBodyAdmin = users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
    } else if (userRole === 'DepartmentUser'||userRole?.includes('EMTUser')) {
      const department = this.authService.getDepartmentName();
      if (department) {
        this.api.getAllUsersByDepartmentName(department).subscribe({
          next: (users: any) => {
            this.tableBody = users;
          },
          error: (error) => {
            console.error('Error fetching department users:', error);
          }
        });
      }
    } else if (userRole?.includes('ProjectUsers')) {
      this.api.getUsersByProjects().subscribe({
        next: (users) => {
          this.tableBody = users;
        },
        error: (error) => {
          console.error('Error fetching project users:', error);
        }
      });
    }
  }

   private loadDepartments() {
    this.api.getDepartment().subscribe({
      next: (departments: department[]) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }
  resetUserForm() {
    this.userForm.reset();

    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.userForm.patchValue({
        departmentName: userDepartment
      });
      this.userForm.get('departmentName')?.disable();
    }
  }

  ngOnInit() {
    const userRole = this.authService.getUserRole();
    const userDepartment = this.authService.getDepartmentName();

    if (userRole === 'DepartmentUser' || userRole?.includes('ProjectUsers')) {
      this.userForm.patchValue({ departmentName: userDepartment });
      this.projectForm.patchValue({ departmentName: userDepartment });

      this.userForm.get('departmentName')?.disable();
      this.projectForm.get('departmentName')?.disable();
      this.isDepartmentFieldDisabled = true;
    }

    if (userRole === 'Admin') {
      this.headerData = ['fullName', 'email', 'department', 'projects'];
      this.isAdmin = true;
      this.refreshUsersData();
    } else if (userRole === 'DepartmentUser'||userRole?.includes('EMTUser')) {
      this.isAdmin = false;
      this.refreshUsersData();
    } else if (userRole?.includes('ProjectUsers')) {
      this.refreshUsersData();
    }

    this.userForm
      .get('departmentName')
      ?.valueChanges.subscribe((selectedDepartment) => {
        if (selectedDepartment) {
          this.loadProjectsForDepartment(selectedDepartment);
        }
      });

    this.loadDepartments();

    const addUserModal = document.getElementById('addUserModal');
    if (addUserModal) {
      addUserModal.addEventListener('hidden.bs.modal', () => {
        this.resetUserForm();
      });
    }
  }



  loadProjectsForDepartment(department: string) {
    this.api.getProjects(department).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.projects = res;
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



  onSubmitDepartment() {
    if (this.departmentForm.valid) {
      const departmentData = this.departmentForm.value;

      console.log('Submitting department data:', departmentData);

      this.api.addNewDepartment(departmentData).subscribe({
        next: (response) => {
          console.log('Department added successfully:', response.message);
          this.departmentForm.reset();

          this.loadDepartments();

          const modal = document.getElementById('addDepartmentModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        error: (error) => {
          console.error('Failed to add the department', error);
          if (error.error && error.error.message) {
            alert(error.error.message);
          }
        }
      });
    } else {
      console.error('Form is invalid:', this.departmentForm.errors);
    }
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.getRawValue();

      userData.projectNames = userData.projectNames?.length
        ? userData.projectNames.map((project: any) => project.name)
        : [];

      console.log('User saved:', userData);

      this.api.addNewUser(userData).subscribe({
        next: (response) => {
          console.log('User saved successfully:', response);


            this.resetUserForm();

          this.refreshUsersData();

          const modal = document.getElementById('addUserModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        error: (error) => {
          console.error('Failed to save user:', error);
        }
      });
    } else {
      console.log('Form invalid');
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onSubmitProject() {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.getRawValue();

      console.log('Submitting project data:', projectData);

      this.api.addNewProject(projectData).subscribe({
        next: (response) => {
          console.log('Project saved successfully:', response);
          this.projectForm.reset();

          if (this.authService.getUserRole() === 'DepartmentUser') {
            const userDepartment = this.authService.getDepartmentName();
            this.projectForm.patchValue({ departmentName: userDepartment });
          }

          if (projectData.departmentName) {
            this.loadProjectsForDepartment(projectData.departmentName);
          }

          const modal = document.getElementById('addProjectModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        error: (error) => {
          console.error('Failed to save project:', error);
          console.log('Error saving project. Please try again.');
        }
      });
    } else {
      console.log('Form invalid');
    }
  }

  onProjectsSelected(projects: project[]) {
    console.log('Selected projects:', projects);
  }
}
