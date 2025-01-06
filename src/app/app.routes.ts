import { Routes } from '@angular/router';

import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { ViewRiskComponent } from './Pages/view-risk/view-risk.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';



import { AuthComponent } from './Layout/auth/auth.component';
import { LoginComponent } from './Pages/login/login.component';
import { UsersComponent } from './Pages/users/users.component';

import { HistoryComponent } from './Pages/history/history.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { ApprovalComponent } from './Pages/approval/approval.component';
import { WildComponentComponent } from './Pages/wild-component/wild-component.component';
import { RegisterRiskComponent } from './Pages/register-risk/register-risk.component';



import { ForgetpswrdComponent } from './Pages/forgetpswrd/forgetpswrd.component';
import { ResetpswrdComponent } from './Pages/resetpswrd/resetpswrd.component';
import { HomeComponent } from './Pages/home/home.component';
import { ApprovalTableComponent } from './Pages/approval-table/approval-table.component';
import { EditRiskComponent } from './Pages/edit-risk/edit-risk.component';
import { ChangepasswordComponent } from './Components/changepassword/changepassword.component';
import { ReferenceComponent } from './Pages/reference/reference.component';
import { SsoComponent } from './Pages/sso/sso.component';
import { AssignmentComponent } from './Pages/assignment/assignment.component';
import { AuthGuard } from './Gaurd/auth.guard';
import { UpdateRiskComponent } from './Pages/update-risk/update-risk.component';
import { ApprovalLayoutComponent } from './Layout/approval-layout/approval-layout.component';


export const routes: Routes = [

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path:'',component:DashboardComponent, canActivate: [AuthGuard], data:{title: 'Risk Management',breadcrumb: 'Dashboard' },
    children:[
      {
        path:'home',component:HomeComponent, data:{title: 'Risk Management' }
      },
      {
        path:'ViewRisk/:id',component:ViewRiskComponent,  data: { title: 'View Risk',breadcrumb: 'View Risk' },

      },


      // {path:"ViewRisk/:id",component:ViewRiskComponent}
      {
        path:'addrisk',component:RegisterRiskComponent,data: { title: 'Register Risk',breadcrumb: 'Register Risk' }
      },
      {
        path:'users',component:UsersComponent,data: { title: 'Manage Users and Departments' ,breadcrumb: 'User Management'},
      },
      {
        path:'assignee',component:AssignmentComponent,data: { title: 'Assignments' ,breadcrumb: 'Assignments'},
      },
      {
        path:'history',component:HistoryComponent,data: { title: 'History',breadcrumb: 'History' }
      },
      {
        path:'reports',component:ReportsComponent,data: { title: 'Reports',breadcrumb: 'Report' }
      },
      // {path:'approval-layout', component:ApprovalLayoutComponent,data: { title: 'Approvals'},children:[
      //   {
      //     path:'approvaltable',component:ApprovalTableComponent, data: { title: 'Approvals' ,breadcrumb: 'Approvals'},children:[
      //       {
      //         path:'approvals/:id',component:ApprovalComponent,data: { title: 'Approvals',breadcrumb: 'View Risk' }
      //       }
      //     ]
      //   },
       
      // ]},
      {
        path:'approvaltable',component:ApprovalTableComponent, data: { title: 'Approvals' ,breadcrumb: 'Approvals'}
      },
      {
        path:'approvals/:id',component:ApprovalComponent,data: { title: 'Approvals',breadcrumb: 'Approvals / View Risk' }
      },
      {
        path:"reference",component:ReferenceComponent,data:{title: 'Reference' ,breadcrumb: 'Reference'}
      },
      {
        path:'edit',component:EditRiskComponent, data:{title: 'Edit Risk' ,breadcrumb: 'View Risk / Edit Risk'}
      },
      {
        path:'update',component:UpdateRiskComponent, data:{title: 'Update Risk' ,breadcrumb: 'View Risk / Update Risk'}
      },

      {
        path:'',redirectTo:'home',pathMatch:'full', data:{title: 'Risk Management' ,breadcrumb: 'Dashboard'}
      }

    ]
  },


  {path:'sidebar',component:SidebarComponent},

  {
    path:"forgetpassword",component:ForgetpswrdComponent
  },
  {
    path:"resetpassword",component:ResetpswrdComponent
  },
  {
    path:"changepassword",component:ChangepasswordComponent
  },
  {
    path:"sso",component:SsoComponent
  },



  {

    path:'**',component:WildComponentComponent

  },



];
