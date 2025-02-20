import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const employeeGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = cookieService.get('accessToken');
  if (token) {
    return true; // Allow access if token exists
  } else {
    router.navigate(['/auth/login']); // Redirect to login if token is missing
    return false;
  }
};
