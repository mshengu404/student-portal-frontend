import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoaderComponent,
    ModalComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  modalMessage = '';
  isModalVisible = false;
  loginForm!: FormGroup;
  isLoaderVisible: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.redirectIfLoggedIn();

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  closeModal() {
    this.isModalVisible = false;
  }

  private showErrorModal(message: string) {
    this.modalMessage = message;
    this.isModalVisible = true;
  }

  login() {
    if (this.loginForm.invalid) {
      this.showErrorModal('Please fill out the form correctly.');
      return;
    }

    this.isLoaderVisible = true;

    this.userService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response?.success) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/verify', response.user.id, 'login']);
        } else {
          this.showErrorModal(`User with email ${this.loginForm.value.email} not found.`);
        }
      },
      error: (err) => {
        const errorMessage = err.status === 404 
          ? `User with email ${this.loginForm.value.email} not found.` 
          : 'An error occurred. Please try again later.';
        this.showErrorModal(errorMessage);
      },
      complete: () => {
        this.isLoaderVisible = false;
      }
    });
  }
}