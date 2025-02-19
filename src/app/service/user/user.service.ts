import { Injectable } from '@angular/core';
import { Login, UpdatePassword, User } from '../../interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  login(user: Login) {
    return this.httpClient.post<{
      success: boolean;
      token: string;
      user: User;
    }>(`${environment.apiUrl}/login`, user);
  }

  register(user: User) {
    return this.httpClient.post<{
      success: boolean;
      token: string;
      user: User;
    }>(`${environment.apiUrl}/signup`, user);
  }

  updatePassword(email: string, updatePassword: UpdatePassword) {
    return this.httpClient.patch<{
      success: boolean;
      token: string;
      user: User;
    }>(`${environment.apiUrl}/update-password/${email}`, updatePassword);
  }

  getProfile(id: number) {
    return this.httpClient.get<User>(`${environment.apiUrl}/users/${id}`);
  }
}
