import { ConfirmService } from './../../core/services/confirm/confirm.service';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from '../../shared/reusableComponents/add-employee/add-employee.component';
import { ToastService } from '../../core/services/toast/toast.service';
import { EditProfileComponent } from '../../shared/reusableComponents/edit-profile/edit-profile.component';
import { PaginationComponent } from '../../shared/reusableComponents/pagination/pagination.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    AddEmployeeComponent,
    EditProfileComponent,
    PaginationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  loggedEmployeeData: any;
  employeeList: any[] = [];
  queryParameters: any = {
    search: '',
    role: '',
    limit: 10,
    page: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  };
  totalPages: number = 1;
  totalEmployees: number = 0;
  totalPagesArray: number[] = [];
  currentPage: number = 1;

  isMenuOpen: boolean = false;
  isDropdownOpen = false;


  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  
  ngOnInit() {
    this.getLoggedEmployeeData();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  openAddEmployeeModal() {
    console.log('Open Add Employee Modal');
  }

  openEditProfileModal() {
    console.log('Open Edit Profile Modal');
  }

  onChangeFilter(event: any) {
    this.queryParameters[event.target.name] = event.target.value;
    this.queryParameters.page = 1;
    this.getEmployeeList();
  }

  onChangeLimit(event: any) {
    this.queryParameters[event.target.name] = event.target.value;
    this.queryParameters.page = 1;
    this.getEmployeeList();
  }

  getLoggedEmployeeData() {
    this.employeeService.getLoggedEmployee().subscribe({
      next: (res) => {
        this.loggedEmployeeData = res;
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
        this.totalEmployees = res.totalEmployees;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.getTotalPagesArray();
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
    this.confirmService
      .showConfirm('Are you sure you want to Delete?')
      .then((isConfirmed) => {
        if (isConfirmed) {
          this.employeeService.deleteEmployee(employee._id).subscribe({
            next: () => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
              });
              this.getEmployeeList();
            },
            error: (error) => {
              if (error.status !== 401)
                this.toastService.showError(error.error?.message);
            },
          });
        }
      });
  }

  logout() {
    this.confirmService
      .showConfirm('Are you sure you want to Logout?')
      .then((isConfirmed) => {
        if (isConfirmed) {
          this.authService.logout().subscribe({
            next: () => {
              Swal.fire({
                title: 'Logged out!',
                icon: 'success',
              });
              this.router.navigate(['auth', 'login']);
            },
            error: (error) => {
              if (error.status !== 401)
                this.toastService.showError(error.error?.message);
            },
          });
        }
      });
  }
}
