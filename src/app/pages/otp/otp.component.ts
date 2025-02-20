import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OtpService } from '../../service/otp/otp.service';
import { UserService } from '../../service/user/user.service';
import { User } from '../../interface/user.interface';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
@Component({
  standalone: true,
  selector: 'app-otp',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  providers: [OtpService, UserService],
})
export class OtpComponent {
  otpForm!: FormGroup;
  userId!: number;
  user!: User;
  invalidOtp = false;
  type!: string;
  isLoaderVisible: boolean = false;
  modalMessage = '';
  isModalVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otpService: OtpService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoaderVisible = true;
    this.authService.redirectIfLoggedIn();
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.type = params['type'];
        this.userId = params['id'];
        this.getUserProfileById(this.userId);
      },
    });
  }

  getUserProfileById(id: number) {
    this.userService.getProfile(id).subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoaderVisible = false;
      },
      error: () => {
        this.isLoaderVisible = false;
        this.showErrorModal('Failed to load user profile. Please try again.');
      },
    });
  }

  moveToNext(
    event: KeyboardEvent,
    currentField: string,
    nextField: string | null
  ): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextField) {
      document
        .querySelector<HTMLInputElement>(
          `input[formControlName="${nextField}"]`
        )
        ?.focus();
    }
    if (event.key === 'Backspace' && !input.value) {
      const previousField = this.getPreviousField(currentField);
      if (previousField) {
        const previousInput = document.querySelector<HTMLInputElement>(
          `input[formControlName="${previousField}"]`
        );
        previousInput?.focus();
        previousInput?.setSelectionRange(1, 1);
      }
    }
  }

  private getPreviousField(currentField: string): string | null {
    const fields = ['digit1', 'digit2', 'digit3', 'digit4'];
    const currentIndex = fields.indexOf(currentField);
    return currentIndex > 0 ? fields[currentIndex - 1] : null;
  }

  hideEmail(email: string) {
    const [username, domain] = email.split('@');
    const hiddenUsername = username[0] + '*'.repeat(username.length - 1);
    return `${hiddenUsername}@${domain}`;
  }

  verifyOtp(): void {
    this.invalidOtp = false;
    if (this.otpForm.valid) {
      this.isLoaderVisible = true;
      const otp = Object.values(this.otpForm.value).join('');
      this.otpService.verify({ email: this.user.email, otp }).subscribe({
        next: (verification) => {
          this.isLoaderVisible = false;
          if (verification.success) {
            if (this.type === 'reset-password') {
              this.router.navigate(['/update-password', this.user.email]);
            } else {
              localStorage.setItem('user', JSON.stringify(this.user));
              this.router.navigate(['/profile', this.userId]);
            }
          } else {
            this.invalidOtp = true;
            this.showErrorModal('Invalid OTP. Please try again.');
          }
        },
        error: (err) => {
          this.isLoaderVisible = false;
          this.showErrorModal('An error occurred. Please try again.');
        },
      });
    }
  }

  resendOtp(): void {
    this.isLoaderVisible = true;
    this.otpService.sendOtp(this.user.email).subscribe({
      next: () => {
        this.isLoaderVisible = false;
        this.showErrorModal('OTP resent successfully.');
      },
      error: (err) => {
        this.isLoaderVisible = false;
        this.showErrorModal('Failed to resend OTP. Please try again.');
      },
    });
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text')?.trim();
    if (clipboardData && /^[0-9]{4}$/.test(clipboardData)) {
      const otpValues = clipboardData.split('');
      this.otpForm.patchValue({
        digit1: otpValues[0],
        digit2: otpValues[1],
        digit3: otpValues[2],
        digit4: otpValues[3],
      });
    }
  }

  private showErrorModal(message: string) {
    this.modalMessage = message;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}