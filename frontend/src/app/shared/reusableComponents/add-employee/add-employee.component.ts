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
  updateForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', [Validators.required, Validators.minLength(3)]],
      role: ['Employee', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(form: FormGroup) {
    this.authService.register(form.value).subscribe({
      next: () => {
        this.getEmployeeList.emit();
      },
      error: (error) => {
        console.error('Failed to add employee', error.error?.message);
      },
    });
  }
}
