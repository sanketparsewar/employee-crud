import { ToastService } from './../../../core/services/toast/toast.service';
import { EmployeeService } from './../../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  @Input() employeeData: any;
  @Input() isEditProfileModal: boolean = false;
  @Output() showEditProfileModal = new EventEmitter();
  @Output() getEmployeeData = new EventEmitter();
  updateForm!: FormGroup;

  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [
        this.employeeData?.name || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
      ],
      image: [''],
      department: [
        this.employeeData?.department || '',
        [Validators.required, Validators.maxLength(25)],
      ],
      email: [
        this.employeeData?.email || '',
        [Validators.required, Validators.email],
      ],
    });
  }
  

  onSubmit(updateForm: FormGroup) {
    this.employeeService.updateEmployee(updateForm.value).subscribe({
      next: () => {
        this.closeModal();
        this.getEmployeeData.emit();
        this.toastService.showSuccess('Profile updated successfully');
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      },
    });
  }

  closeModal() {
    this.showEditProfileModal.emit();
  }

  fileSelect(event: any) {
    if (event.target.files) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.employeeService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.employeeData.image = res.file.url;
        console.log(res.file.url);
        this.toastService.showSuccess('Profile picture updated successfully');
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      },
    });
  }
}
