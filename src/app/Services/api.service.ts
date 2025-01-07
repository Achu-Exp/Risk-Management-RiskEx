import { project } from './../Interfaces/projects.interface';
import { department } from './../Interfaces/deparments.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { UserResponse } from '../Interfaces/Userdata.interface.';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'https://localhost:7216/api';
  private departmentUpdateSubject = new Subject<void>();
  departmentUpdate$ = this.departmentUpdateSubject.asObservable();

  constructor(private http: HttpClient, public auth: AuthService) {}

  //Just for now to test can be removed later
  getAllRisk() {
    return this.http.get('/data/getAllRisk.json');
  }

  getRiskType() {
    return this.http.get(`data/type-dropdown.json`);
  }

  getRiskCurrentAssessment() {
    return this.http.get(`data/assessment-dropdown.json`);
  }

  getRiskById(id: number) {
    return this.http.get(`${this.baseUrl}/Risk/id?id=${id}`);
  }

  getMitigationSatus(id: string) {
    return this.http.get(`${this.baseUrl}/Risk/GetMitigationStatusOfARisk/${id}`);
  }

  getReviewSatus(id: string, isPreReview: boolean) {
    return this.http.get(`${this.baseUrl}/Review/GetReviewStatusOfARisk/${id}/${isPreReview}`);
  }

  getDepartment() {
    return this.http.get<department[]>(`${this.baseUrl}/Department/Departments`);
  }

  addNewDepartment(department: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/Department/Department`, department)
      .pipe(tap(() => this.departmentUpdateSubject.next()));
  }

  notifyDepartmentUpdate() {
    this.departmentUpdateSubject.next();
  }

  getProjects(departmentName: string) {
    return this.http.get<project[]>(`${this.baseUrl}/Project/ProjectsBy/${departmentName}`);
  }

  gettabledata() {
    return this.http.get(`${this.baseUrl}/Report`);
  }

  gethistorytabledata() {
    return this.http.get(`${this.baseUrl}/Report?riskStatus=close`);
  }

  getDepartmentTable(department: any) {
    return this.http.get(`${this.baseUrl}/Report/DepartmentwiseRisk/${department}`);
  }

  getDepartmentHistoryTable(department: any) {
    return this.http.get(`${this.baseUrl}/Report/DepartmentwiseRisk/${department}?riskStatus=close`);
  }
  getProjectHistroyTable(projectList:any) {
    const queryParams = projectList.map((id: number) => `projectIds=${id}`).join('&');
    return this.http.get(`${this.baseUrl}/Report/projectrisks?${queryParams}&riskStatus=close`,)
  }
  getProjectTable(projectList:any) {
    const queryParams = projectList.map((id: number) => `projectIds=${id}`).join('&');
    return this.http.get(`${this.baseUrl}/Report/projectrisks?${queryParams}`,)
  }


  addNewProject(project: any) {
    return this.http.post(`${this.baseUrl}/Project/Project`, project);
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

  getRiskCategoryCounts() {
    return this.http.get(`${this.baseUrl}/Risk/RiskCategory-Counts`);
  }

  getOpenRiskCountByType() {
    return this.http.get(`${this.baseUrl}/Risk/OpenRisk-Counts`);
  }

  addnewQualityRisk(qualityRisk: any) {
    console.log('quality risk payload', qualityRisk);
    return this.http.post(`${this.baseUrl}/Risk/Quality`, qualityRisk);
  }

  addnewSecurityOrPrivacyRisk(SecurityOrPrivacyRisk: any) {
    return this.http.post(`${this.baseUrl}/Risk/security`, SecurityOrPrivacyRisk);
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
    return this.http.put(`${this.baseUrl}/Risk/quality/${id}`, risk);
  }

  editSecurityOrPrivacyRisk(id: number, risk: any) {
    return this.http.put(`${this.baseUrl}/Risk/SecurityOrPrivacy/${id}`, risk);
  }

  getRisksAssignedToUser(id: any = '') {
    return this.http.get(`${this.baseUrl}/Risk/GetRiskByAssigne?id=${id}`);
  }

  getRisksByReviewerId() {
    const userId = this.auth.getCurrentUserId();
    return this.http.get(`${this.baseUrl}/Approval/Approval${userId}`);
  }

  getAllRisksTobeReviewed() {
    return this.http.get(`${this.baseUrl}/Approval/RisksToBeReviewed`);
  }

  updateRiskReviewStatus(riskId: number, approvalStatus: string) {
    return this.http.put(`${this.baseUrl}/Approval/update-review-status?riskId=${riskId}&approvalStatus=${approvalStatus}`, {});
  }

  updateExternalReivewStatus(updates: any) {
    return this.http.post(`${this.baseUrl}/Approval/api/external-review/status/update`, updates);
  }

  updateReviewStatusAndComments(id: number, updates: any) {
    console.log('updates', updates);
    this.http.put(`${this.baseUrl}/Approval/update-review/${id}`, updates)
      .subscribe((e) => console.log(e));
  }

  sendEmailToAssignee(id: number) {
    this.http.post(`${this.baseUrl}/emails/send-assignment-email/${id}`, {})
      .subscribe((e) => console.log(e));
  }

  getRisksWithHeigestOverallRating(id: any = '') {
    return this.http.get(`${this.baseUrl}/Risk/GetRiskWithHeighestOverallRationg?id=${id}`);
  }

  getRiskApproachingDeadline(id: any = '') {
    return this.http.get(`${this.baseUrl}/Risk/GetRiskApproachingDeadline?id=${id}`);
  }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/User/GetAllUsers`);
  }

  getAllUsersByDepartmentName(department: string) {
    return this.http.get(`${this.baseUrl}/User/GetUsersByDepartment/${department}`);
  }

  getAllUsersForAssignee() {
    return this.http.get(`${this.baseUrl}/Users`);
  }

  getAllUsersByDepartmentId(id: number) {
    return this.http.get(`${this.baseUrl}/department/${id}`);
  }

  getRiskCategoryCountsByDepartment(departmentList: number[]) {
    let params = new HttpParams();
    departmentList.forEach((departmentId) => {
      params = params.append('departmentList', departmentId.toString());
    });
    return this.http.get(`${this.baseUrl}/Risk/RiskCategoryCountByDepartment`, { params });
  }

  changeUserStatus(userId: any, status: any) {
    return this.http.patch(`${this.baseUrl}/User/IsActive/${userId}/${status}`, {})
      .subscribe((e) => console.log('UserId and status:', userId, status));
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

    return this.http.get<any>(`${this.baseUrl}/User/users-by-projects`, { params })
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


  getAssigneeByRiskId(riskId: number) {
    return this.http.get(`${this.baseUrl}/User/GetInfoOfAssigneeByRiskId/${riskId}`);
  }

  getRevieverDetails(riskId: number) {
    return this.http.get(`${this.baseUrl}/Reviewer/gettheReviewer/${riskId}`);
  }

  updateQualityRisk(updated: any, riskId: number) {
    return this.http.put(`${this.baseUrl}/Risk/update/Quality/${riskId}`, updated);
  }

  updateSecurityOrPrivacyRisk(updated: any, riskId: number) {
    return this.http.put(`${this.baseUrl}/Risk/update/${riskId}`, updated);
  }
}
