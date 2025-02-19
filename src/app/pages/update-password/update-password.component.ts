import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { passwordMatchValidator } from '../../validator/password.validator';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-update-password',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalComponent,
    LoaderComponent,
  ],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  providers: [UserService],
})
export class UpdatePasswordComponent {
  email!: string;
  modalMessage = '';
  isPasswordUpdated: boolean = false;
  isModalVisible: boolean = false;
  updatePasswordForm!: FormGroup;
  isLoaderVisible: boolean = false;

  constructor(
    private router: Router,
    private _userService: UserService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.redirectIfLoggedIn();

    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.email = params['email'];
      },
    });

    this.updatePasswordForm = new FormGroup(
      {
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl(null, Validators.required),
      },
      { validators: passwordMatchValidator() }
    );
  }

  updatePassword() {
    if (this.updatePasswordForm.valid) {
      this.isLoaderVisible = true;
      this._userService
        .updatePassword(this.email, {
          password: this.updatePasswordForm.value.password,
        })
        .subscribe({
          next: (user) => {
            if (user?.success) {
              this.modalMessage = 'Password updated successfully';
              this.isModalVisible = true;
              this.isPasswordUpdated = true;
              this.isLoaderVisible = false;
            } else {
              this.modalMessage = 'Password update failed';
              this.isModalVisible = true;
              this.isPasswordUpdated = false;
              this.isLoaderVisible = false;
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoaderVisible = false;
          },
        });
    } else {
      this.isLoaderVisible = false;
    }
  }

  closeModal() {
    if (this.isPasswordUpdated) {
      this.router.navigate(['/']);
    } else {
      this.isModalVisible = false;
    }
  }
}
