import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null; // Return null if controls are not found
    }

    // Check if the passwords match
    const isMatching = password.value === confirmPassword.value;

    // Return error if not matching
    return isMatching ? null : { passwordMismatch: true };
  };
}
