import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
export class EditProfileComponent {
  @Input() employeeData: any;
  updateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    console.log('Employee data:', this.employeeData);
    this.updateForm = this.fb.group({
      name: [
        this.employeeData?.name,
        [Validators.required, Validators.minLength(3)],
      ],
      department: [
        this.employeeData?.department,
        [Validators.required, Validators.minLength(3)],
      ],
      // role: [''],
      email: [this.employeeData?.email, [Validators.required, Validators.email]],
    });
  }

  onSubmit(form: FormGroup) {
    console.log(form.value);
  }
}
