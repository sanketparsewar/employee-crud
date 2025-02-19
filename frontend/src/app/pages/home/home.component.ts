import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from '../../shared/reusableComponents/add-employee/add-employee.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ToastService } from '../../core/services/toast/toast.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, AddEmployeeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  employeeData: any;
  employeeList: any[] = [];
  queryParameters: any = {
    search: '',
    role: '',
    limit: 10,
    page: 1,
  };
  errorMessage: string = '';
  searchSubject = new Subject<string>();
  totalPages: number = 0;
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.queryParameters['search'] = value;
      this.getEmployeeList();
    });
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }
  onChangeFilter(event: any) {
    this.queryParameters[event.target.name] = event.target.value;
    console.log(this.queryParameters);
    this.getEmployeeList();
  }

  ngOnInit() {
    this.getLoggedEmployee();
  }

  getLoggedEmployee() {
    this.employeeService.getLoggedEmployee().subscribe({
      next: (res) => {
        this.employeeData = res;
        this.getEmployeeList();
      },
      error: (error) => {
        if (error.status !== 401)
          this.toastService.showError(error.error?.message);
      },
    });
  }

  getEmployeeList() {
    this.employeeService.getAllEmployees(this.queryParameters).subscribe({
      next: (res: any) => {
        this.employeeList = res.employees;
        this.totalPages = res.totalPages;
        this.errorMessage = '';
      },
      error: (error) => {
        if (error.status !== 401)
          this.toastService.showError(error.error?.message);
      },
    });
  }

  editEmployee(id: string) {}
  deleteEmployee(employee: any) {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.employeeService.deleteEmployee(employee._id).subscribe({
        next: () => {
          this.toastService.showSuccess('Employee deleted successfully');
          this.getEmployeeList();
        },
        error: (error) => {
          if (error.status !== 401)
            this.toastService.showError(error.error?.message);
        },
      });
    }
  }

  // refreshToken() {
  //   this.authService.refreshToken().subscribe({
  //     next: () => {
  //       this.getLoggedEmployee();
  //       this.getEmployeeList();
  //     },
  //     error: (error) => {
  //       this.toastService.showError(
  //         'Session expired. Please login to continue...'
  //       );
  //       setTimeout(() => {
  //         this.logout();
  //       }, 3000);
  //     },
  //   });
  // }

  logout() {
    if (confirm(`Are you sure you want to Logout?`)) {
      this.authService.logout().subscribe({
        next: () => {
          this.toastService.showSuccess('Logged out successfully');
          this.router.navigate(['auth', 'login']);
        },
        error: (error) => {
          if (error.status !== 401)
            this.toastService.showError(error.error?.message);
        },
      });
    }
  }
}
