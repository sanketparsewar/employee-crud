import { AuthService } from './../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  router = inject(Router);
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(form: FormGroup) {
    console.log(form.value);
    this.authService.login(form.value).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl('home');
    });
  }
  logout(){
    this.authService.logout().subscribe((res)=>{
      console.log('logout');
      
    })
  }
}
