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
  @Output() getEmployeeData = new EventEmitter();
  updateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [
        this.employeeData.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      department: [
        this.employeeData.department,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      email: [this.employeeData.email, [Validators.required, Validators.email]],
    });
    console.log('empldata', this.employeeData);
  }

  onSubmit(updateForm: FormGroup) {
    this.employeeService.updateEmployee(updateForm.value).subscribe({
      next: () => {
        this.getEmployeeData.emit();
      },
    });
    console.log(updateForm.value);
  }
}
