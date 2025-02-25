import { EmployeeService } from './../../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-edit-picture',
  imports: [CommonModule],
  templateUrl: './edit-picture.component.html',
  styleUrl: './edit-picture.component.css',
})
export class EditPictureComponent {
  @Input() isEditPictureModal: boolean = false;
  @Output() showEditPictureModal = new EventEmitter();
  @Output() getEmployeeData = new EventEmitter();

  updatedImage: string = '';
  selectedFile: File | null = null;
isLoading: boolean = false;
 
  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  fileSelected(event: any) {
    if (event.target.files) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.isLoading=true
    this.employeeService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.updatedImage = res.url;
        this.updatePicture();
      },
      error: (error) => {
        this.isLoading=false
        this.toastService.showError(error.error.message);
      },
    });
  }

  updatePicture() {
    this.employeeService
      .updateEmployee({ image: this.updatedImage })
      .subscribe({
        next: () => {
          this.isLoading=false
          this.closeModal();
          this.cutSelectedFile();
          this.getEmployeeData.emit();
          this.toastService.showSuccess('Profile picture updated successfully');
        },
        error: (error) => {
          this.isLoading=false
          this.toastService.showError(error.error.message);
        },
      });
  }

  cutSelectedFile() {
    this.selectedFile = null;
  }

  closeModal() {
    this.showEditPictureModal.emit();
  }
}
