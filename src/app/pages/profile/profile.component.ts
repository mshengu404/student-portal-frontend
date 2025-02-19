import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../interface/user.interface';
import { UserService } from '../../service/user/user.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService],
})
export class ProfileComponent implements OnInit {
  id!: number;
  user?: User;
  isLoaderVisible: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoaderVisible = true;
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.id = +params['id'];
        if (this.id) {
          this.getUserProfileById(this.id);
        } else {
          console.error('Invalid user ID');
        }
      },
      error: (error) => (this.isLoaderVisible = false),
    });
  }

  getUserProfileById(id: number) {
    this.userService.getProfile(id).subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoaderVisible = false;
      },
      error: (err) => (this.isLoaderVisible = false),
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
