import { EmployeeService } from './../../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-picture',
  imports: [CommonModule],
  templateUrl: './edit-picture.component.html',
  styleUrl: './edit-picture.component.css',
})
export class EditPictureComponent {
  @Input() isEditPictureModal: boolean = false;
  @Output() showEditPictureModal = new EventEmitter();

  selectedFile: File | null = null;

  constructor(private employeeService: EmployeeService) {}

  fileSelected(event: any) {
    if (event.target.files) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    
    this.employeeService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        console.log(res);
        this.closeModal();
        this.selectedFile = null;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cutSelectedFile(){
    this.selectedFile = null;
  }

  closeModal() {
    this.showEditPictureModal.emit();
  }
}
