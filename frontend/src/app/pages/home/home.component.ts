import { ConfirmService } from './../../core/services/confirm/confirm.service';
import { Component, inject, OnInit } from '@angular/core';
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
  isDropdownOpen: boolean = false;
  isAddEmployeeModal: boolean = false;
  isFilterOptions: boolean = false;
  savedTheme: string = '';
  isDarkMode: boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.savedTheme = localStorage.getItem('isDarkMode') || '';
    this.isDarkMode = (this.savedTheme=="true") ? false : true;

    this.toggleDarkMode();
    this.getLoggedEmployeeData();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  showFilter() {
    this.isFilterOptions = !this.isFilterOptions;
  }

  showAddEmployeeModal() {
    this.isAddEmployeeModal = !this.isAddEmployeeModal;
  }

  onChangeFilter(event: any) {
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

}
