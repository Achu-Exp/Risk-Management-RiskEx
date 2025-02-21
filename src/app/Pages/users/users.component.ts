import { department } from './../../Interfaces/deparments.interface';
import { Component,  ViewChild } from '@angular/core';
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
import { AuthService } from '../../Services/auth/auth.service';
import { SingleProjectDropdownComponent } from '../../Components/single-project-dropdown/single-project-dropdown.component';
import { UsermanagementpopupComponent } from "../../Components/usermanagementpopup/usermanagementpopup.component";
import { EmailService } from '../../Services/email.service';
import { FormLoaderComponent } from "../../Components/form-loader/form-loader.component";

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
    UsermanagementpopupComponent,
    FormLoaderComponent
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
  isLoader = false;


  headerData: string[] = [];
  headerDataDpt:string[]=['fullName','email','department','projects'];
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
    department:'',
    projects:[]
  }
]
  userForm: FormGroup;
  departmentForm: FormGroup;
  projectForm: FormGroup;
  updateDepartmentForm: FormGroup;
  updateProjectForm: FormGroup;
  departmentProjects: any[] = [];

  constructor(public api: ApiService, public authService: AuthService,  public emailService: EmailService,) {
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

  confirmationCallback: () => void = () => {};

  handleModalComplete() {
    this.refreshUsersData();
  }
  private normalizeWhitespace(value: string): string {
    return value?.trim() || '';
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
    const normalizedDepartment = this.normalizeWhitespace(department);
    this.api.getProjects(normalizedDepartment).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.projects = res;
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
        const departmentData = {
          name: this.normalizeWhitespace(this.departmentForm.get('name')?.value),
          departmentCode: this.normalizeWhitespace(this.departmentForm.get('departmentCode')?.value)
        };
        this.isLoader = true;
        this.api.addNewDepartment(departmentData).subscribe({
          next: (response) => {
            this.departmentForm.reset();
            this.loadDepartments();
            this.confirmationPopup.showResultModal('Department added successfully!', true);
            this.isLoader = false;
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
            this.isLoader = false;
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
      const addUserModal = document.getElementById('addUserModal');
      if (addUserModal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(addUserModal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
      const formData = this.userForm.getRawValue();

      this.confirmationMessage = 'Are you sure you want to add this user?';
      this.confirmationCallback = () => {
        const userData = {
          email: this.normalizeWhitespace(formData.email),
          fullName: this.normalizeWhitespace(formData.fullName),
          departmentName: this.normalizeWhitespace(formData.departmentName),
          projectIds: Array.isArray(formData.projectIds)
            ? formData.projectIds.map((project: any) =>
                typeof project === 'object' ? project.id : project
              ).filter(Boolean)
            : []
        };
        this.isLoader = true;
        this.api.addNewUser(userData).subscribe({
          next: (response) => {
            const emailContext = {
              email: userData.email,
              fullName: userData.fullName,
              defaultPassword: 'experion@123'
            };

            this.emailService.sendUserRegistrationEmail(
             formData.email,
              emailContext
            ).subscribe({
              next: (emailSent) => {
                if (emailSent) {
                  this.confirmationPopup.showResultModal(
                    'User added successfully and welcome email sent!',
                    true
                  );
                  this.isLoader = false;
                } else {
                  this.confirmationPopup.showResultModal(
                    'User added, but failed to send welcome email',
                    false
                  );
                  this.isLoader = false;
                }
              },
              error: (emailError) => {
                this.confirmationPopup.showResultModal(
                  'User added, but email sending failed',
                  false
                );
                this.isLoader = false;
              }
            });

            this.resetUserForm();
            this.refreshUsersData();
          },
          error: (error) => {
            let errorMessage = this.getErrorMessage(error);
            this.confirmationPopup.showResultModal(
              `Failed to add user: ${errorMessage}`,
              false
            );
            this.isLoader = false;
          }
        });
      };

      const modal = document.getElementById('confirmationModal');
      if (modal) {
        const bsModal = new (window as any).bootstrap.Modal(modal);
        bsModal.show();
      }
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });

      this.confirmationPopup.showResultModal(
        'Please fill in all required fields correctly.',
        false
      );
      this.isLoader = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.status) {
      case 400:
        return ' Please check your input data.User with the email already exists';
      case 401:
        return 'Authentication error: Please log in again.';
      case 403:
        return 'Authorization error: You do not have permission to perform this action.';
      case 409:
        return 'Conflict: User already exists.';
      case 500:
        return 'Server error: An internal server error occurred.';
      default:
        return error.error?.message || error.message || 'Unknown error occurred.';
    }
  }



  onSubmitProject() {
    if (this.projectForm.valid) {
      this.confirmationMessage = 'Are you sure you want to add this project?';
      this.confirmationCallback = () => {
        const projectData = this.projectForm.getRawValue();
        this.isLoader = true;
        this.api.addNewProject(projectData).subscribe({
          next: (response) => {
            this.projectForm.reset();

            if (this.authService.getUserRole() === 'DepartmentUser') {
              const userDepartment = this.authService.getDepartmentName();
              this.projectForm.patchValue({ departmentName: userDepartment });
            }

            if (projectData.departmentName) {
              this.loadProjectsForDepartment(projectData.departmentName);
            }

            this.confirmationPopup.showResultModal('Project added successfully!', true);
            this.isLoader = false;

            const modal = document.getElementById('addProjectModal');
            if (modal) {
              (modal as HTMLElement).click();
            }
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
              `Failed to add project: ${errorMessage}`,
              false
            );
            this.isLoader = false;
          }
        });
      };

      const modal = document.getElementById('confirmationModal');
      if (modal) {
        const bsModal = new (window as any).bootstrap.Modal(modal);
        bsModal.show();
      }
    } else {
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });
    }
  }

   onDepartmentSelect(dept: department) {
    if (dept) {
      const normalizedDeptName = this.normalizeWhitespace(dept.departmentName);
      const normalizedDeptCode = this.normalizeWhitespace(dept.departmentCode);

     this.updateDepartmentForm.patchValue({
        newDepartmentName: normalizedDeptName,
        newDepartmentCode: normalizedDeptCode
      });
    }
  }



  onUpdateDepartment() {
    if (this.updateDepartmentForm.valid) {
      this.confirmationMessage = 'Are you sure you want to update this department?';
      this.confirmationCallback = () => {
        const updateData = {
          departmentName: this.normalizeWhitespace(this.updateDepartmentForm.get('departmentName')?.value),
          newDepartmentName: this.normalizeWhitespace(this.updateDepartmentForm.get('newDepartmentName')?.value),
          newDepartmentCode: this.normalizeWhitespace(this.updateDepartmentForm.get('newDepartmentCode')?.value)
        };
        this.isLoader = true;
        this.api.updateDepartment(updateData).subscribe({
          next: (response) => {
            this.updateDepartmentForm.reset();
            this.loadDepartments();
            this.confirmationPopup.showResultModal('Department updated successfully!', true);
            this.isLoader = false;

            const modal = document.getElementById('updateDepartmentModal');
            if (modal) {
              (modal as HTMLElement).click();
            }
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
              `Failed to update department: ${errorMessage}`,
              false
            );
            this.isLoader = false;
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




  onProjectSelect(project: project) {
    if (project) {
      this.id = project.id;
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
    if (this.updateProjectForm.valid) {
      this.confirmationMessage = 'Are you sure you want to update this project?';
      this.confirmationCallback = () => {
        const projectId = this.id;
        const updateData: any = {
          projectName: this.updateProjectForm.get('projectName')?.value,
          newProjectName: this.updateProjectForm.get('newProjectName')?.value,
          newProjectCode: this.updateProjectForm.get('newProjectCode')?.value
        };
        this.isLoader = true;
        this.api.updateProject(updateData, projectId).subscribe({
          next: (response) => {
            this.updateProjectForm.reset();

            if (this.updateProjectForm.get('selectedDepartment')?.value) {
              this.loadProjectsForDepartment(this.updateProjectForm.get('selectedDepartment')?.value);
            }

            this.confirmationPopup.showResultModal('Project updated successfully!', true);
            this.isLoader = false;
            const modal = document.getElementById('updateProjectModal');
            if (modal) {
              (modal as HTMLElement).click();
            }
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
              `Failed to update project: ${errorMessage}`,
              false
            );
            this.isLoader = false;
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

  onProjectsSelected(projects: project[]) {
    // console.log('Selected projects:', projects);
  }
}
