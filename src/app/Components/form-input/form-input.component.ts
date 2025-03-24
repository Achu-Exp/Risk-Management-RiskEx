import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label:string=''
  @Input() required:string=''
  @Input() placeholder:string='Enter risk category'


  value: string = '';
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelectionChanges(event: any): void {
    setTimeout(() => {
      this.onChange(this.value);
    }, 0);
  }

  @Output() infoClicked = new EventEmitter<void>();

  onInfoClick() {
    this.infoClicked.emit();
  }


}


