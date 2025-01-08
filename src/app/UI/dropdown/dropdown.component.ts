
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]

})
export class DropdownComponent implements ControlValueAccessor {

  // @Input() options: any[] = [];
  // @Input() displayField: string = '';
  // @Input() valueField: string = '';
  // selectedValue: string = '';
  // @Input() width:string='100'
  // @Input() bottom:string=''
  // @Input() selectValue:string=''
  // filteredOptions: any[] = [];
  // searchQuery: string = '';

  // @Input() ngModel: any;


  // isDropdownOpen = false;
  // selectedItem: any = null;

  // ngOnInit() {
  //   this.filteredOptions = [...this.options]; // Initialize dropdown options
  // }

  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  //   this.filteredOptions = [...this.options]; // Reset filtered options when opening dropdown
  // }

  // onSearch() {
  //   this.filteredOptions = this.options.filter(item =>
  //     item[this.displayField].toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  // selectItem(item: any) {
  //   this.selectedItem = item;
  //   this.ngModel = item[this.valueField];
  //   this.isDropdownOpen = false; // Close dropdown after selection
  //   this.searchQuery = ''; // Clear search input
  // }






  // value: any = '';
  // onChange = (value: any) => {};
  // onTouched = () => {};


  // // Write value to the component
  // writeValue(value: any): void {
  //   this.value = value;
  // }

  // // Register change callback
  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // // Register touched callback
  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // // Handle selection change
  // onSelectionChange(value: any): void {
  //   this.value = value;
  //   this.onChange(value);
  //   this.onTouched();


  // }

  // @Input() options: any[] = [];
  // @Input() displayField: string = '';
  // @Input() valueField: string = '';
  // @Input() selectValue: string = 'Select an option';
  // @Input() width: string = '100%';

  // value: any = '';
  // isDropdownOpen = false;
  // searchQuery: string = '';

  // onChange = (value: any) => {};
  // onTouched = () => {};

  // // Write value for ControlValueAccessor
  // writeValue(value: any): void {
  //   this.value = value;
  // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // // Toggle dropdown visibility
  // toggleDropdown(): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  // // Getter for dynamically filtering options
  // get filteredOptions(): any[] {
  //   return this.options.filter(opt =>
  //     opt[this.displayField].toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  // // Handle selection change
  // selectOption(option: any): void {
  //   this.value = option[this.valueField];
  //   this.onChange(this.value);
  //   this.onTouched();
  //   this.isDropdownOpen = false;
  //   this.searchQuery = ''; // Clear search input
  // }

  // getSelectedText(): string {
  //   const selectedOption = this.options.find(opt => opt[this.valueField] === this.value);
  //   return selectedOption ? selectedOption[this.displayField] : this.selectValue;
  // }




  // @Input() options: any[] = [];
  // @Input() displayField: string = '';
  // @Input() valueField: string = '';
  // @Input() selectValue: string = 'Select an option';
  // @Input() width: string = '100%';

  // @Output() change: EventEmitter<any> = new EventEmitter(); // Emit selected value on change

  // value: any = '';
  // isDropdownOpen = false;
  // searchQuery: string = '';

  // onChange = (value: any) => {};
  // onTouched = () => {};

  // // Write value to the component
  // writeValue(value: any): void {
  //   if (value !== undefined) {
  //     this.value = value;
  //   }
  // }

  // // Register change callback
  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // // Register touched callback
  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // // Toggle dropdown visibility
  // toggleDropdown(): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  // // Getter for dynamically filtering options
  // get filteredOptions(): any[] {
  //   return this.options.filter(opt =>
  //     opt[this.displayField].toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  // // Handle selection change
  // selectOption(option: any): void {
  //   this.value = option[this.valueField];
  //   this.onChange(this.value);  // Notify parent form control of the change
  //   this.onTouched();           // Mark the input as touched
  //   this.change.emit(this.value);  // Emit the selected value to parent
  //   this.isDropdownOpen = false; // Close the dropdown
  //   this.searchQuery = '';      // Clear the search input
  // }

  // // Get the selected option's display text
  // getSelectedText(): string {
  //   const selectedOption = this.options.find(opt => opt[this.valueField] === this.value);
  //   return selectedOption ? selectedOption[this.displayField] : this.selectValue;
  // }











  @Input() options: any[] = [];
  @Input() displayField: string = '';
  @Input() valueField: string = '';
  @Input() selectValue: string = 'Select an option';
  @Input() width: string = '100%';
  @Output() valueChange = new EventEmitter<any>();
  @Input() selectedValue: any = null;
  @Input() openDropdownId: string | undefined = undefined;
  @Input() dropdownId: string='';
  @Output() openDropdown = new EventEmitter<string>();

  // dropdownId = Math.random().toString(36).substring(2, 9); // Unique ID

  get isGlobalDropdownOpen() {
    return this.openDropdownId === this.dropdownId;
  }

  // toggleDropdownOpen() {
  //   this.openDropdown.emit(this.dropdownId); // Notify wrapper
  // }

  value: any = '';
  isDropdownOpen = false;
  searchQuery: string = '';
  ngOnInit(){
    console.log("get value of likelihhod is ",this.selectedValue);

    if (this.selectedValue !== null) {
      this.value = this.selectedValue;
      console.log("get value of this.value is ",this.value);

    }
  }



  // Functions for ControlValueAccessor (this enables ngModel support)
  onChange = (value: any) => {};
  onTouched = () => {};

  // Write value to the component
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Register change callback (ngModel binding)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register touched callback (ngModel binding)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Toggle dropdown visibility
  toggleDropdown(event: MouseEvent): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();  // Prevent click propagation
    this.openDropdown.emit(this.isDropdownOpen ? this.dropdownId : undefined); // Notify parent
  }

  // Getter for filtered options
  get filteredOptions(): any[] {
    return this.options.filter(opt =>
      opt[this.displayField].toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Handle selection change
  selectOption(item: any): void {
    this.value = item[this.valueField];
    console.log("the value is selected is",this.value);

    this.onChange(this.value);  // Notify parent of the change
    this.onTouched();  // Mark as touched
    this.isDropdownOpen = false;  // Close the dropdown
    this.searchQuery = '';  // Optionally clear the search input

    this.valueChange.emit(this.value);
  }

  // Get selected option's display text
  getSelectedText(): string {
    const selectedOption = this.options.find(opt => opt[this.valueField] === this.value);
    const selectedpreoption=this.options.find(opt=>opt[this.valueField]===this.selectedValue)
    return selectedOption ? selectedOption[this.displayField] : selectedpreoption? selectedpreoption[this.displayField]:this.selectValue ;
  }






  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown-container');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }















}
