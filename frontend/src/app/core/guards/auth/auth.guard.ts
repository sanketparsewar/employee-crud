import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = cookieService.get('accessToken');
  if (!token) {
    return true; // Allow access if no token exists
  } else {
    router.navigate(['/home']); // Redirect to home if token is present
    return false;
  }
};
