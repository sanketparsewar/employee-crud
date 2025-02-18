import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL: string;
  constructor(private http: HttpClient) {
    this.BASE_URL = Environment.BASE_URL;
  }

  login(employeeData: any) {
    return this.http.post(`${this.BASE_URL}/auth/login`, employeeData, {
      withCredentials: true,
    });
  }

  register(employeeData: any) {
    return this.http.post(`${this.BASE_URL}/auth/register`, employeeData);
  }

  logout() {
    return this.http.get(`${this.BASE_URL}/auth/logout`, {
      withCredentials: true,
    });
  }

  refreshToken() {
    return this.http.post(
      `${this.BASE_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
