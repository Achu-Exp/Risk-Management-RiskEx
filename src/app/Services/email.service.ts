import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  emailTemplate: string = '';
  reviewerEmailTemplate: string = '';
  assigneeEmailTemplate: string = '';
  ownerEmailTemplate: string = '';
  userRegisterTemplate:string='';

  constructor(private api: ApiService,private notificationService: NotificationService) {
    this.loadReviewTemplate();
    this.loadAssigneeTemplate();
    this.loadOwnerTemplate();
    this.loadUserRegisterTemplate();
  }

  private async loadUserRegisterTemplate(){
    try{
      this.userRegisterTemplate = await fetch(
        'Templates/RegisterUserTemplate.html'
      ).then((response) => response.text());
    }catch (error){
      console.error('Failed to load email template:', error);
    }
  }
  sendUserRegistrationEmail(email: string, context: any): Observable<boolean> {
    // console.log('Sending registration email:', {
    //   email,
    //   context,
    //   templateLoaded: !!this.userRegisterTemplate
    // });

    const subject = 'Your Risk Management System Account Credentials';
    const body = this.prepareUserRegistrationEmailBody(
      this.userRegisterTemplate,
      context
    );

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        // console.log('Registration email sent successfully', response);
        return true;
      }),
      catchError((error) => {
        console.error('Detailed error sending registration email:', {
          error,
        });
        return of(false);
      })
    );
  }
  private prepareUserRegistrationEmailBody(template: string, context: any): string {
    return template
      .replace('{{userEmail}}', context.email)
      .replace('{{defaultPassword}}', context.defaultPassword)
      .replace('{{fullName}}', context.fullName);
  }

  private async loadReviewTemplate() {
    try {
      this.reviewerEmailTemplate = await fetch(
        'Templates/ApprovalEmailTemplate.html'
      ).then((response) => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  private AddRiskDetailsForReview(template: string, context: any): string {
    return template
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      // .replace('{{reason}}', context.reason)
      .replace('{{id}}', context.id)
      .replace('{{rid}}', context.rid);
  }
  sendReviewerEmail(email: string, context: any): Observable<boolean> {
    const subject = `Review Risk - ${context.riskName}`;
    const body = this.AddRiskDetailsForReview(
      this.reviewerEmailTemplate,
      context
    );
    // console.log("body:",body);


    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        console.log('Email sent successfully', response);
        this.notificationService.success('The risk has been submitted to the reviewer for approval.');
        return true; // Return success
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to reviewer');
        return of(false); // Return failure
      })
    );
  }

  private async loadAssigneeTemplate() {
    try {
      this.assigneeEmailTemplate = await fetch(
        'Templates/AssigneeEmailTemplate.html'
      ).then((response) => response.text());
      // console.log('Loaded Template:', this.assigneeEmailTemplate); // Debug log
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }

  private AddRiskDetailstoAssignee(template: string, context: any): string {
    return template
      .replace('{{assigneeName}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{riskStatus}}', context.riskStatus);
  }

  sendAssigneeEmail(email: string, context: any): Observable<boolean> {
    const subject = `Review Risk - ${context.riskName}`;
    const body = this.AddRiskDetailstoAssignee(
      this.assigneeEmailTemplate,
      context
    );

    console.log('Email Subject:', subject); // Debug log
    // console.log('Email Body:', body); // Debug log

    return this.api.sendMail(email, subject, body).pipe(
      map((response: any) => {
        console.log('Email sent successfully', response);
        this.notificationService.success('Email sent to the responsible user successfully');
        return true;
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to assignee');
        return of(false);
      })
    );
  }

  private async loadOwnerTemplate() {
    try {

      this.ownerEmailTemplate = await fetch('Templates/RiskOwnerEmailTemplate.html')
        .then(response => response.text());
    } catch (error) {
      console.error('Failed to load email template:', error);
    }
  }
  private AddRiskDetailsForOwner(template:string,context:any):string{
    return template
      .replace('{{responsibleUser}}', context.responsibleUser)
      .replace('{{riskId}}', context.riskId)
      .replace('{{riskName}}', context.riskName)
      .replace('{{description}}', context.description)
      .replace('{{riskType}}', context.riskType)
      .replace('{{impact}}', context.impact)
      .replace('{{mitigation}}', context.mitigation)
      .replace('{{plannedActionDate}}', context.plannedActionDate)
      .replace('{{overallRiskRating}}', context.overallRiskRating)
      .replace('{{reason}}', context.reason)



  }
  sendOwnerEmail(email: string, context:any): Observable<boolean> {
    const subject = `Review Risk - ${context.riskName}`;
    const body = this.AddRiskDetailsForOwner(this.ownerEmailTemplate, context);

    return this.api.sendMail(email, subject, body).pipe(
      map((response:any) => {
        console.log('Email sent successfully', response);
        this.notificationService.success('Notify the risk owner that the risk has been rejected.');
        return true; // Return success
      }),
      catchError((error) => {
        console.error('Error sending email:', error);
        this.notificationService.error('Failed to send email to risk owner');
        return of(false); // Return failure
      })
    );
  }

}
