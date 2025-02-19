import { HttpClient, HttpParams } from '@angular/common/http';
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
  
  getAllEmployees(queryParameters:any) {
    let params = new HttpParams();
  
    // Append each query parameter dynamically
    Object.keys(queryParameters).forEach((key) => {
      if (queryParameters[key]) {
        params = params.set(key, queryParameters[key]);
      }
    });
  
    return this.http.get(`${this.BASE_URL}/employee/allemployees`, {
      params: params, // Attach params here
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
