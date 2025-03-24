import { project } from './../Interfaces/projects.interface';
import { department } from './../Interfaces/deparments.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { UserResponse } from '../Interfaces/Userdata.interface.';
import { AuthService } from './auth/auth.service';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  // private readonly baseUrl2 = 'https://risk-management-riskex-backend-2.onrender.com/api';

  private departmentUpdateSubject = new Subject<void>();
  private projectUpdateSubject = new Subject<void>();
  departmentUpdate$ = this.departmentUpdateSubject.asObservable();
  projectUpdate$ = this.projectUpdateSubject.asObservable();

  constructor(private http: HttpClient, public auth: AuthService) {}

  getRiskById(id: number) {
    return this.http.get(`${this.baseUrl}/Risk/id?id=${id}`);
  }

  getMitigationSatus(id: string) {
    return this.http.get(
      `${this.baseUrl}/Risk/GetMitigationStatusOfARisk/${id}`
    );
  }

  getReviewSatus(id: string, isPreReview: boolean) {
    return this.http.get(
      `${this.baseUrl}/Review/GetReviewStatusOfARisk/${id}/${isPreReview}`
    );
  }

  getDepartment() {
    return this.http.get<department[]>(
      `${this.baseUrl}/Department/Departments`
    );
  }

  addNewDepartment(department: any): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/Department/Department`,
        department
      )
      .pipe(tap(() => this.departmentUpdateSubject.next()));
  }

  notifyDepartmentUpdate() {
    this.departmentUpdateSubject.next();
  }

  getProjects(departmentName: string) {
    return this.http.get<project[]>(
      `${this.baseUrl}/Project/ProjectsBy/${departmentName}`
    );
  }

  //get projects by id
  getProtectsByDepartmentId(id: number) {
    return this.http.get<project[]>(`${this.baseUrl}/Project/projects/${id}`);
  }

  gettabledata() {
    return this.http.get(`${this.baseUrl}/Report`);
  }

  gethistorytabledata() {
    return this.http.get(`${this.baseUrl}/Report?riskStatus=close`);
  }

  getDepartmentTable(department: any) {
    return this.http.get(
      `${this.baseUrl}/Report/DepartmentwiseRisk/${department}`
    );
  }

  getDepartmentHistoryTable(department: any) {
    return this.http.get(
      `${this.baseUrl}/Report/DepartmentwiseRisk/${department}?riskStatus=close`
    );
  }
  getProjectHistroyTable(projectList: any) {
    const queryParams = projectList
      .map((id: number) => `projectIds=${id}`)
      .join('&');
    return this.http.get(
      `${this.baseUrl}/Report/projectrisks?${queryParams}&riskStatus=close`
    );
  }
  getProjectTable(projectList: any) {
    const queryParams = projectList
      .map((id: number) => `projectIds=${id}`)
      .join('&');
    return this.http.get(`${this.baseUrl}/Report/projectrisks?${queryParams}`);
  }

  addNewProject(project: any) {
    return this.http
      .post(`${this.baseUrl}/Project/Project`, project)
      .pipe(tap(() => this.projectUpdateSubject.next()));
  }
  notifyProjectUpdate() {
    this.projectUpdateSubject.next();
  }

  addNewUser(user: any) {
    return this.http.post<UserResponse>(`${this.baseUrl}/User/register`, user, {
      responseType: 'text' as 'json',
    });
  }

  getRisk() {
    console.log('hai');
    return this.http.get(`data/getRisk.json`);
  }

  getRiskResponses() {
    return this.http.get(`${this.baseUrl}/RiskResponseData`);
  }

  getLikelyHoodDefinition() {
    return this.http.get(`${this.baseUrl}/AssessmentMatrixLikelihood`);
  }

  getImpactDefinition() {
    return this.http.get(`${this.baseUrl}/AssessmentMatrixImpact`);
  }

  addnewQualityRisk(qualityRisk: any) {
    console.log('quality risk payload', qualityRisk);
    return this.http.post(`${this.baseUrl}/Risk/add/quality`, qualityRisk);
  }

  addnewSecurityOrPrivacyRisk(SecurityOrPrivacyRisk: any) {
    return this.http.post(
      `${this.baseUrl}/Risk/add/securityOrPrivacy`,
      SecurityOrPrivacyRisk
    );
  }

  addExternalReviewer(reviewer: any) {
    return this.http.post(`${this.baseUrl}/Reviewer/add-reviewer`, reviewer);
  }

  addResponsiblePerson(assignee: any) {
    return this.http.post(`${this.baseUrl}/User/register`, assignee);
  }

  getAllReviewer() {
    return this.http.get(`${this.baseUrl}/Reviewer/getAllReviewers`);
  }

  editQualityRisk(id: number, risk: any) {
    return this.http.put(`${this.baseUrl}/Risk/edit/quality/${id}`, risk);
  }

  editSecurityOrPrivacyRisk(id: number, risk: any) {
    return this.http.put(
      `${this.baseUrl}/Risk/edit/SecurityOrPrivacy/${id}`,
      risk
    );
  }

  getRisksAssignedToUser(id: any = '') {
    return this.http.get(`${this.baseUrl}/Risk/GetRiskByAssigne?id=${id}`);
  }

  getAllRisksAssigned() {
    return this.http.get(`${this.baseUrl}/Risk/GetAllRisksAssigned`);
  }

  getRisksByReviewerId(id: any = '') {
    // const userId = this.auth.getCurrentUserId();
    return this.http.get(`${this.baseUrl}/Approval/Approval${id}`);
  }

  getAllRisksTobeReviewed() {
    return this.http.get(`${this.baseUrl}/Approval/RisksToBeReviewed`);
  }

  updateRiskReviewStatus(riskId: number, approvalStatus: string) {
    return this.http.put(
      `${this.baseUrl}/Approval/update-review-status?riskId=${riskId}&approvalStatus=${approvalStatus}`,
      {}
    );
  }

  updateExternalReivewStatus(updates: any) {
    return this.http.post(
      `${this.baseUrl}/Approval/api/external-review/status/update`,
      updates
    );
  }

  updateReviewStatusAndComments(id: number, updates: any): Observable<any> {
    console.log('updatesssss', updates);
    console.log('Id:', id);

    return this.http.put(
      `${this.baseUrl}/Approval/update-review/${id}`,
      updates
    );
  }

  sendEmailToAssignee(id: number) {
    this.http
      .post(`${this.baseUrl}/emails/send-assignment-email/${id}`, {})
      .subscribe((e) => console.log(e));
  }

  getRisksWithHeigestOverallRating(
    departmentList: number[],
    projectList: number[]
  ) {
    let params = new HttpParams();
    departmentList.forEach((departmentId) => {
      params = params.append('departmentIds', departmentId.toString());
    });

    projectList.forEach((projectId) => {
      params = params.append('projectIds', projectId.toString());
    });
    console.log('params', params);
    return this.http.get(
      `${this.baseUrl}/Risk/GetRiskWithHeighestOverallRationg`,
      {
        params,
      }
    );
  }

  getRiskApproachingDeadline(departmentList: number[], projectList: number[]) {
    let params = new HttpParams();
    departmentList.forEach((departmentId) => {
      params = params.append('departmentIds', departmentId.toString());
    });
    projectList.forEach((projectId) => {
      params = params.append('projectIds', projectId.toString());
    });
    console.log('params', params);
    return this.http.get(`${this.baseUrl}/Risk/GetRiskApproachingDeadline`, {
      params,
    });
  }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/User/GetAllUsers`);
  }
  //needed some cases
  getAllUsersByDepartmentName(department: string) {
    return this.http.get(
      `${this.baseUrl}/User/GetUsersByDepartment/${department}`
    );
  }

  getAllUsersForAssignee() {
    return this.http.get(`${this.baseUrl}/Users`);
  }

  getRiskCategoryCountsByDepartment(
    departmentList: number[],
    projectList: number[]
  ) {
    let params = new HttpParams();
    departmentList.forEach((departmentId) => {
      params = params.append('departmentIds', departmentId.toString());
    });
    projectList.forEach((projectId) => {
      params = params.append('projectIds', projectId.toString());
    });
    console.log('params', params);
    return this.http.get(`${this.baseUrl}/Risk/RiskCategoryCountByDepartment`, {
      params,
    });
  }

  changeUserStatus(userId: any, status: any) {
    return this.http
      .patch(
        `${this.baseUrl}/User/IsActive/${userId}/${status}`,
        {},
        { responseType: 'text' }
      )
      .subscribe((response) => {
        console.log('UserId and status:', userId, status);
        console.log('API Response:', response);
      });
  }

  getUsersByProjects(): Observable<any> {
    const projects = this.auth.getProjects() || [];
    if (!projects || projects.length === 0) {
      console.log('No projects found in auth');
      return of([]);
    }
    let params = new HttpParams();
    projects.forEach((project) => {
      if (project && project.Id) {
        params = params.append('projectIds', project.Id.toString());
      }
    });

    return this.http
      .get<any>(`${this.baseUrl}/User/users-by-projects`, { params })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            console.log('API Response:', error);
            return of([]);
          }
          return throwError(() => error);
        })
      );
  }

  sendMail(email: string, subject: string, body: string) {
    const params = new HttpParams()
      .set('receptor', email)
      .set('subject', subject)
      .set('body', body)
      .set('isBodyHtml', 'true');
    return this.http.post(`${this.baseUrl}/emails`, null, { params });
  }

  sendReviewMail(
    email: string,
    subject: string,
    body: string
  ): Observable<any> {
    const payload = {
      receptor: email,
      subject: subject,
      body: body,
      isBodyHtml: true,
    };
    console.log('Sending payload:', payload);
    return this.http.post(`${this.baseUrl}/emails`, payload);
  }

  getAssigneeByRiskId(riskId: number) {
    return this.http.get(
      `${this.baseUrl}/User/GetInfoOfAssigneeByRiskId/${riskId}`
    );
  }

  getRevieverDetails(riskId: number, reviewStatus: string) {
    console.log(
      'api url:',
      `${this.baseUrl}/Reviewer/gettheReviewer/${riskId}?reviewStatus=${reviewStatus}`
    );

    return this.http.get(
      `${this.baseUrl}/Reviewer/gettheReviewer/${riskId}?reviewStatus=${reviewStatus}`
    );
  }

  updateQualityRisk(updated: any, riskId: number) {
    return this.http.put(
      `${this.baseUrl}/Risk/update/quality/${riskId}`,
      updated
    );
  }

  updateSecurityOrPrivacyRisk(updated: any, riskId: number) {
    return this.http.put(
      `${this.baseUrl}/Risk/update/securityOrPrivacy/${riskId}`,
      updated
    );
  }
  getOpenRiskCountByType(list: number[], projectList: number[]) {
    let params = new HttpParams();
    list.forEach((departmentId) => {
      params = params.append('departmentIds', departmentId.toString());
    });
    projectList.forEach((projectId) => {
      params = params.append('projectIds', projectId.toString());
    });
    console.log('params', params);
    return this.http.get(`${this.baseUrl}/Risk/CountOfRiskType(Open)`, {
      params,
    });
  }

  getRiskCategoryCounts(id: any = '') {
    return this.http.get(`${this.baseUrl}/Risk/RiskCategory-Counts?id=${id}`);
  }

  getriskOwnerEmailandName(id: any) {
    return this.http.get(
      `${this.baseUrl}/User/GetEmailAndNameOfAUserbyRiskId/${id}`
    );
  }

  getNewRiskId(departmentId: any, projectId: any | null = null) {

    if (departmentId !== null && projectId !== null) {
      console.error('❌ Error: Provide either departmentId or projectId, not both.');
      return throwError(() => new Error('Please provide either departmentId or projectId, not both.'));
    }


    const params: any = {};

    if (departmentId !== null) {
      params.departmentId = departmentId;
    } else if (projectId !== null) {
      params.projectId = projectId;
    } else {
      console.error('❌ Error: Either departmentId or projectId is required.');
      return throwError(() => new Error('Either departmentId or projectId is required.'));
    }

   
    return this.http.get(`${this.baseUrl}/Risk/riskid/new/Id`, { params });
  }


  updateDepartment(updateData: any) {
    return this.http
      .put(`${this.baseUrl}/Department`, updateData)
      .pipe(tap(() => this.departmentUpdateSubject.next()));
  }

  updateProject(updateData: any, id: number) {
    return this.http
      .put<{ message: string }>(`${this.baseUrl}/Project/${id}`, updateData)
      .pipe(tap(() => this.projectUpdateSubject.next()));
  }

  getUsersByDepartmentId(departmentId: number) {
    return this.http.get(`${this.baseUrl}/User/${departmentId}`);
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const userId = this.auth.getCurrentUserId();
    const url = `${this.baseUrl}/Account/ChangePassword/${userId}`;
    const payload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    return this.http.post(url, payload);
  }

  saveResetToken(email: string, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResetPass/save-reset-token`, {
      token,
      email,
    });
  }

  resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResetPass/reset-password`, payload);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/User/${id}`, userData).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }


  getCreatedByUserName(riskId: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/User/${riskId}/createdBy`, { responseType: 'text' });
  }

}






