import { ToastService } from './../../../core/services/toast/toast.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { EmployeeService } from './../../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  @Output() getEmployeeList = new EventEmitter();
  addEmployeeForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,private toastService:ToastService) {}
  ngOnInit() {
    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      department: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(16),Validators.maxLength(16),Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{6,}$')]],
    });
  }

  onSubmit(form: FormGroup) {
    this.authService.register(form.value).subscribe({
      next: () => {
        this.resetForm();
        this.getEmployeeList.emit();
        this.toastService.showSuccess('Employee added successfully');
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      },
    });
  }

  resetForm() { 
    this.addEmployeeForm.reset({ 
      name: '', 
      department: '', 
      role: '', 
      email: '', 
      password: '' 
    });
  }

}
