import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from '../../shared/reusableComponents/add-employee/add-employee.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ToastService } from '../../core/services/toast/toast.service';
import { EditProfileComponent } from '../../shared/reusableComponents/edit-profile/edit-profile.component';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    AddEmployeeComponent,
    EditProfileComponent,
  ],
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
  searchSubject = new Subject<string>();
  totalPages: number = 1;
  totalPagesArray: number[] = [];
  totalEmployees: number = 0;
  currentPage: number = 1;
  // itemsPerPage: number = 10; // Adjust this as needed

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

  ngOnInit() {
    this.getLoggedEmployee();
  }
  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }
  onChangeFilter(event: any) {
    this.queryParameters[event.target.name] = event.target.value;
    this.getEmployeeList();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.queryParameters.page = page;
      this.currentPage = page;
      this.getEmployeeList();
    }
  }

  getLoggedEmployee() {
    this.employeeService.getLoggedEmployee().subscribe({
      next: (res) => {
        this.employeeData = res;
        this.getEmployeeList();
      },
      error: (error) => {
        if (error.status !== 401) {
          this.toastService.showError(error.error?.message);
        }
      },
    });
  }

  getEmployeeList() {
    this.employeeService.getAllEmployees(this.queryParameters).subscribe({
      next: (res: any) => {
        this.employeeList = res.employees;
        this.totalPages = res.totalPages;
        this.getTotalPagesArray();
        console.log(res);
      },
      error: (error) => {
        if (error.status !== 401)
          this.toastService.showWarning(error.error?.message);
      },
    });
  }

  getTotalPagesArray() {
    this.totalPagesArray = [];
    for (let i = 1; i < this.totalPages + 1; i++) {
      this.totalPagesArray.push(i);
    }
  }

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
