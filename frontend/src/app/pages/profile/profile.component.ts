import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ConfirmService } from '../../core/services/confirm/confirm.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../../shared/reusableComponents/edit-profile/edit-profile.component';
import Swal from 'sweetalert2';
import { EditPictureComponent } from '../../shared/reusableComponents/edit-picture/edit-picture.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, EditProfileComponent,EditPictureComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  loggedEmployeeData: any;
  isEditProfileModal: boolean = false;
  isEditPictureModal: boolean = false;
  isDropdownOpen: boolean = false;
  router = inject(Router);
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

  showEditProfileModal() {
    this.isEditProfileModal = !this.isEditProfileModal;
  }
  showEditPictureModal() {
    this.isEditPictureModal = !this.isEditPictureModal;
  }


  getLoggedEmployeeData() {
    this.employeeService.getLoggedEmployee().subscribe({
      next: (res) => {
        this.loggedEmployeeData = res;
        console.log(res);
      },
      error: (error) => {
        if (error.status !== 401) {
          this.toastService.showError(error.error?.message);
        }
      },
    });
  }

  deleteEmployee() {
    this.confirmService
      .showConfirm('Are you sure you want to delete your account?')
      .then((isConfirmed) => {
        if (isConfirmed) {
          this.employeeService
            .deleteEmployee(this.loggedEmployeeData._id)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: 'Deleted!',
                  text: 'Your Account has been deleted.',
                  icon: 'success',
                });
                this.logout();
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
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['auth', 'login']);
      },
      error: (error) => {
        if (error.status !== 401)
          this.toastService.showError(error.error?.message);
      },
    });
  }
}
