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
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    console.log('Employee data:', this.employeeData);
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      department: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  
  ngOnInit(): void {
    console.log('empldata',this.employeeData);
    
  }

  onSubmit(form: FormGroup) {
    this.employeeService.updateEmployee(form.value).subscribe({});
    this.getEmployeeData.emit(form.value);
    console.log(form.value);
  }
}
