import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditProfileComponent } from '../../shared/reusableComponents/edit-profile/edit-profile.component';
import { AddEmployeeComponent } from '../../shared/reusableComponents/add-employee/add-employee.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    AddEmployeeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  employeeData: any;
  employeeList: any[] = [];
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.getLoggedEmployee();
    this.getEmployeeList();
  }

  getLoggedEmployee() {
    this.employeeService.getLoggedEmployee().subscribe({
      next: (res) => {
        this.employeeData = res;
        console.log('Employee data fetched successfully:', res);
      },
      error: (error) => {
        console.error('Error:', error.error.message);
        console.log('Failed to fetch employee data.');
        this.refreshToken();
      },
    });
  }

  getEmployeeList() {
    this.employeeService.getAllEmployees().subscribe((res: any) => {
      this.employeeList = res;
    });
  }

  editEmployee(id: string) {}
  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe((res) => {
      this.getEmployeeList();
    });
  }

  refreshToken() {
    this.authService.refreshToken().subscribe((res) => {
      console.log('Token refreshed', res);
    });
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      this.router.navigate(['/auth/login']);
    });
  }
}
