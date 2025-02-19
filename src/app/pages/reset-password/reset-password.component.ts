import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { OtpService } from '../../service/otp/otp.service';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent, ModalComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  providers: [UserService],
})
export class ResetPasswordComponent {
  modalMessage = '';
  isModalVisible = false;
  resetPasswordForm!: FormGroup;
  isLoaderVisible: boolean = false;
  

  constructor(
    private router: Router,
    private otpService: OtpService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.redirectIfLoggedIn();

    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  closeModal() {
    this.isModalVisible = false;
  }

  sendOtp() {
    if (this.resetPasswordForm.valid) {
      this.isLoaderVisible = true;
      this.otpService.sendOtp(this.resetPasswordForm.value.email).subscribe({
        next: (response) => {
          if (response?.success) {
            this.router.navigate([
              '/verify',
              response.user.id,
              'reset-password',
            ]);
          }
          else {
            this.isLoaderVisible = false;
            this.isModalVisible = true;
            this.modalMessage = 'Email address not found';
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoaderVisible = false;
        },
      });
    }
  }
}
