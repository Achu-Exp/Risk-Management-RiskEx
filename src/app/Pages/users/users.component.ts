import { department } from './../../Interfaces/deparments.interface';
import { Component, ViewChild } from '@angular/core';
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
import { SingleProjectDropdownComponent } from '../../Components/single-project-dropdown/single-project-dropdown.component';
import { UsermanagementpopupComponent } from "../../Components/usermanagementpopup/usermanagementpopup.component";

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
    SingleProjectDropdownComponent,
    UsermanagementpopupComponent
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  @ViewChild(UsermanagementpopupComponent) confirmationPopup!: UsermanagementpopupComponent;
  departments: department[] = [];
  projects: any[] = [];
  isDepartmentFieldDisabled = false;
  isAdmin: boolean = false;
  id:any
  isLoading = true;
  confirmationMessage: string = '';
 confirmationCallback: () => void = () => {};

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
  updateDepartmentForm: FormGroup;
  updateProjectForm: FormGroup;
  departmentProjects: any[] = [];

  constructor(public api: ApiService, public authService: AuthService) {
    this.departmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      departmentCode:new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      departmentName: new FormControl('', Validators.required),
      projectIds: new FormControl([[]]),
    });
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
      projectCode: new FormControl('', Validators.required),
    });
    this.updateDepartmentForm = new FormGroup({
      departmentName: new FormControl('', Validators.required),
      newDepartmentName: new FormControl('', Validators.required),
      newDepartmentCode: new FormControl('', Validators.required)
    });

    this.updateProjectForm = new FormGroup({
      selectedDepartment: new FormControl('', Validators.required),
      projectName: new FormControl('', Validators.required),
      newProjectName: new FormControl('', Validators.required),
      newProjectCode: new FormControl('', Validators.required)
    });
  }

  handleModalComplete() {
    this.refreshUsersData();
  }


 private refreshUsersData() {
  this.isLoading = true;
    const userRole = this.authService.getUserRole();
    if (userRole === 'Admin'||userRole?.includes('EMTUser')) {
      this.api.getAllUsers().subscribe({
        next: (users: any) => {
          this.tableBodyAdmin = users;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.isLoading = false;
        }
      });
    } else if (userRole === 'DepartmentUser') {
      const department:any = this.authService.getDepartmentId();
      if (department) {
        this.api.getUsersByDepartmentId(department).subscribe({
          next: (users: any) => {
            this.tableBody = users;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching department users:', error);
            this.isLoading = false;
          }
        });
      }
    } else if (userRole?.includes('ProjectUsers')) {
      this.api.getUsersByProjects().subscribe({
        next: (users) => {
          this.tableBody = users;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching project users:', error);
          this.isLoading = false;
        }
      });
    }
  }

   private loadDepartments() {
    this.isLoading = true;
    this.api.getDepartment().subscribe({
      next: (departments: department[]) => {
        this.departments = departments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading = false;
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
      this.updateProjectForm.patchValue({selectedDepartment:userDepartment});

      this.userForm.get('departmentName')?.disable();
      this.projectForm.get('departmentName')?.disable();
      this.updateProjectForm.get('selectedDepartment')?.disable();
      this.isDepartmentFieldDisabled = true;
    }

    if (userRole === 'Admin'||userRole?.includes('EMTUser')) {
      this.headerData = ['fullName', 'email', 'department', 'projects'];
      this.isAdmin = true;
      this.refreshUsersData();
    } else if (userRole === 'DepartmentUser') {
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
      this.confirmationMessage = 'Are you sure you want to add this department?';
      this.confirmationCallback = () => {
        const departmentData = this.departmentForm.value;

        this.api.addNewDepartment(departmentData).subscribe({
          next: (response) => {
            this.departmentForm.reset();
            this.loadDepartments();
            this.confirmationPopup.showResultModal('Department added successfully!', true);
          },
          error: (error) => {
            let errorMessage = '';

            if (error.status === 400) {
              errorMessage = 'Validation error: ' + (error.error?.message || 'Invalid data provided');
            } else if (error.status === 500) {
              errorMessage = 'Server error: An internal server error occurred';
            } else if (error.status === 401) {
              errorMessage = 'Authentication error: Please log in again';
            } else if (error.status === 403) {
              errorMessage = 'Authorization error: You do not have permission to perform this action';
            } else {
              errorMessage = error.error?.message || error.message || 'Unknown error occurred';
            }

            this.confirmationPopup.showResultModal(
              `Failed to add department: ${errorMessage}`,
              false
            );
          }
        });
      };

      const modal = document.getElementById('confirmationModal');
      if (modal) {
        const bsModal = new (window as any).bootstrap.Modal(modal);
        bsModal.show();
      }
    }
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.getRawValue();

      userData.projectIds = userData.projectIds?.length
        ? userData.projectIds.map((project: any) => project.id)
        : [];


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


   onDepartmentSelect(dept: department) {
    if (dept) {
      this.updateDepartmentForm.patchValue({
        newDepartmentName: dept.departmentName,
        newDepartmentCode: dept.departmentCode
      });
    }
  }
  onUpdateDepartment() {
    if (this.updateDepartmentForm.valid) {
      const updateData = {
        departmentName: this.updateDepartmentForm.get('departmentName')?.value,
        newDepartmentName: this.updateDepartmentForm.get('newDepartmentName')?.value,
        newDepartmentCode: this.updateDepartmentForm.get('newDepartmentCode')?.value
      };

      this.api.updateDepartment(updateData).subscribe({
        next: (response) => {
          console.log('Department updated successfully:', response);
          this.updateDepartmentForm.reset();

          this.loadDepartments();

          const modal = document.getElementById('updateDepartmentModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        error: (error) => {
          console.error('Failed to update department:', error);
        }
      });
    }
  }

  onProjectSelect(project: project) {
    if (project) {
      this.id = project.id; // Save the project ID
      this.updateProjectForm.patchValue({
        newProjectName: project.name,
        newProjectCode: project.projectCode
      });
    }
  }

  onProjectDepartmentSelect(dept: department) {
    if (dept) {
      this.updateProjectForm.patchValue({
        selectedDepartment: dept.departmentName
      });
    }
  }



  onUpdateProject() {
    const projectId = this.id;
    if (this.updateProjectForm.valid) {


      const updateData: any = {
        projectName: this.updateProjectForm.get('projectName')?.value,
        newProjectName: this.updateProjectForm.get('newProjectName')?.value,
        newProjectCode: this.updateProjectForm.get('newProjectCode')?.value
      };



      this.api.updateProject(updateData, projectId).subscribe({
        next: (response) => {
          console.log('Project updated successfully:', response.message);
          this.updateProjectForm.reset();

          if (this.updateProjectForm.get('selectedDepartment')?.value) {
            this.loadProjectsForDepartment(this.updateProjectForm.get('selectedDepartment')?.value);
          }

          const modal = document.getElementById('updateProjectModal');
          if (modal) {
            (modal as HTMLElement).click();
          }
        },
        error: (error) => {
          console.error('Failed to update project:', error);
          if (error.status === 400) {
            console.error('Validation error:', error.error.message);
          } else if (error.status === 500) {
            console.error('Server error:', error.error.message);
          }
        }
      });
    }
  }


  onProjectsSelected(projects: project[]) {
    console.log('Selected projects:', projects);
  }
}
