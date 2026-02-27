import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';

// Custom validator: alphanumeric, starts with a letter, min 8 chars
function alphanumericStartsWithLetter(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const pattern = /^[a-zA-Z][a-zA-Z0-9]{7,}$/;
  if (!pattern.test(value)) {
    return { invalidPassword: true };
  }
  return null;
}

// Custom validator: born in 2006 or before
function maxBirthYearValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const date = new Date(control.value);
  if (date.getFullYear() > 2006) {
    return { yearTooLate: true };
  }
  return null;
}

@Component({
  selector: 'app-summit',
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTimepickerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './summit.html',
  styleUrl: './summit.css',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class SummitComponent {
  private _snackBar = inject(MatSnackBar);

  // Dark mode
  isDarkMode = false;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  // Max birth date: Dec 31, 2006
  maxBirthDate = new Date(2006, 11, 31);

  // Autocomplete - city options
  cityOptions: string[] = ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati', 'Pasig', 'Taguig'];
  filteredCities: string[] = this.cityOptions;

  filterCities(value: string): void {
    const filter = value.toLowerCase();
    this.filteredCities = this.cityOptions.filter(c => c.toLowerCase().includes(filter));
  }

  // Chips - interest tags
  interests: string[] = ['Web Dev', 'AI & ML', 'Mobile', 'Cloud', 'Cybersecurity', 'IoT', 'Blockchain'];
  selectedInterests: string[] = [];

  toggleInterest(interest: string): void {
    const idx = this.selectedInterests.indexOf(interest);
    if (idx >= 0) {
      this.selectedInterests.splice(idx, 1);
    } else {
      this.selectedInterests.push(interest);
    }
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  // Form data
  submitted = false;
  submittedData: any = null;

  formdata: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, alphanumericStartsWithLetter]),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl(null, [Validators.required, maxBirthYearValidator]),
    city: new FormControl(''),
    sessionTime: new FormControl(null, [Validators.required]),
    bio: new FormControl(''),
    experienceLevel: new FormControl(1)
  });

  minLevel = 1;
  maxLevel = 5;

  onClickSubmit(data: any): void {
    this.submitted = true;
    if (this.formdata.valid) {
      this.submittedData = { ...data, interests: this.selectedInterests };
      this._snackBar.open('🎉 Registration successful! See you at the Summit!', 'Close', {
        duration: 5000,
        panelClass: this.isDarkMode ? ['snack-dark'] : ['snack-light']
      });
    } else {
      this._snackBar.open('⚠️ Please fix the errors before submitting.', 'Dismiss', {
        duration: 4000
      });
    }
  }
}
