import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  redirectIfLoggedIn(): void {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const user: User = JSON.parse(userStorage);
      this.router.navigate(['/profile', user.id]);
    }
  }
}
