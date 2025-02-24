import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { employeeGuard } from './core/guards/employee/employee.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full', 
        },
        {
          path: 'home',
          component: HomeComponent,
          canActivate: [employeeGuard],
        },
        {
          path: 'profile',
          component: ProfileComponent,
          canActivate: [employeeGuard],
        },
      ],
    },
    
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [authGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
