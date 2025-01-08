import {ChangeDetectionStrategy, EventEmitter, HostListener, model, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StyleButtonComponent } from "../style-button/style-button.component";


@Component({
  selector: 'app-datepicker',
  standalone: true,
  providers: [provideNativeDateAdapter(),],
  imports: [MatCardModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, StyleButtonComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})
export class DatepickerComponent {

  showDropdown = false;
  startDate: string | null = null;
  endDate: string | null = null;
  dateRange: string = '';

  @Output() dateRangeSelected = new EventEmitter<{ startDate: string; endDate: string }>();

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  updateDateRange() {
    if (this.startDate && this.endDate) {
      this.dateRange = `${this.startDate} to ${this.endDate}`;
      this.emitDateRange();
    }
  }

  parseDateRange() {
    const range = this.dateRange.split(' to ');
    if (range.length === 2) {
      this.startDate = range[0];
      this.endDate = range[1];
      this.emitDateRange();
    }
  }

  emitDateRange() {
    this.dateRangeSelected.emit({ startDate: this.startDate!, endDate: this.endDate! });
  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-by-date')) {
        this.showDropdown = false;
      }
    }
}
