import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ConfirmService } from '../../core/services/confirm/confirm.service';
import Swal from 'sweetalert2';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  savedTheme: string = '';
  isDarkMode: boolean = false;
  loggedEmployeeData:any;
  isDropdownOpen: boolean = false;
  router=inject(Router)
    constructor(
      private authService: AuthService,
      private employeeService: EmployeeService,
      private toastService: ToastService,
      private confirmService: ConfirmService
    ) {}

  ngOnInit() {
    this.savedTheme = localStorage.getItem('isDarkMode') || '';
    this.isDarkMode = (this.savedTheme=="true") ? false : true;

    this.toggleDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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
