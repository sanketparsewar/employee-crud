import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

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
  updateEmployee(employee: any) {
    return this.http.put(`${this.BASE_URL}/employee/`, employee, {
      withCredentials: true,
    });
  }


  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.BASE_URL}/upload`, formData, {
      withCredentials: true,
    });
  }

}
