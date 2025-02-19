import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Login, User } from '../../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private httpClient: HttpClient) {}

  verify(verify: { email: string; otp: string }) {
    return this.httpClient.post<{
      success: boolean;
      token: string;
      user: User;
    }>(`${environment.apiUrl}/otp/validate`, verify);
  }

  sendOtp(email: string) {
    return this.httpClient.post<{
      success: boolean;
      message: string;
      user: User;
    }>(`${environment.apiUrl}/otp/send`, { email });
  }
}
