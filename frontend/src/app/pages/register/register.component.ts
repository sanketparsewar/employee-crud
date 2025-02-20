import { AuthService } from './../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  router = inject(Router);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      department: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(16)]],
    });
  }
  onSubmit(form: FormGroup) {
    console.log(form.value);
    this.authService.register(form.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.toastService.showSuccess('Registration successful. Please login.');
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      },
    });
  }
}
