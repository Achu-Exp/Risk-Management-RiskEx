import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../Services/email.service';

@Component({
  selector: 'app-review-confirmation',
  standalone: true,
  imports: [NgIf],
  templateUrl: './review-confirmation.component.html',
  styleUrl: './review-confirmation.component.scss'
})
export class ReviewConfirmationComponent {
  status: string = '';

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
    });
  }
}
