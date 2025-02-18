import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private BASE_URL: string;
  constructor(private http: HttpClient) {
    this.BASE_URL = Environment.BASE_URL;
  }
  getLoggedEmployee() {
    return this.http.get(`${this.BASE_URL}/employee/logged`, {
      withCredentials: true,
    });
  }
  getAllEmployees() {
    return this.http.get(`${this.BASE_URL}/employee/allemployees`, {
      withCredentials: true,
    });
  }
  getEmployeeById(id: string) {
    return this.http.get(`${this.BASE_URL}/employee/${id}`, {
      withCredentials: true,
    });
  }
  deleteEmployee(id: string) {
    return this.http.delete(`${this.BASE_URL}/employee/${id}`, {
      withCredentials: true,
    });
  }
}
