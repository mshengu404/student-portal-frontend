import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../service/user/user.service';
import { passwordMatchValidator } from '../../validator/password.validator';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { User } from '../../interface/user.interface';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoaderComponent,
    ModalComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService],
})
export class SignupComponent implements OnInit {
  user!: User;
  modalMessage = '';
  signUpForm!: FormGroup;
  isModalVisible: boolean = false;
  isLoaderVisible: boolean = false;
  isUserCreated: boolean = false;

  constructor(
    private router: Router,
    private _userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.redirectIfLoggedIn();

    this.signUpForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl(null, Validators.required),
      },
      { validators: passwordMatchValidator() }
    );
  }

  signUp() {
    if (this.signUpForm.valid) {
      this.isLoaderVisible = true;
      this._userService.register(this.signUpForm.value).subscribe({
        next: (user) => {
          if (user?.success) {
            this.isLoaderVisible = false;
            this.modalMessage = 'User created successfully';
            this.isModalVisible = true;
            this.isUserCreated = true;
            this.user = user.user;
            localStorage.setItem('token', user.token);
          } else {
            this.isLoaderVisible = false;
            this.isUserCreated = false;
            this.modalMessage = 'User not created successfully';
            this.isModalVisible = true;
          }
        },
        error: (err) => {
          this.isUserCreated = false;
          this.isLoaderVisible = false;
          this.modalMessage = 'User not created successfully';
          this.isModalVisible = true;
        },
      });
    } else {
      this.isLoaderVisible = false;
    }
  }

  closeModal() {
    if (this.isUserCreated) {
      this.router.navigate(['/verify', this.user.id, 'login']);
    }
  }
}
