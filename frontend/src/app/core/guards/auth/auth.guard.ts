import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = cookieService.get('accessToken');
  if (!token) {
    // console.log('Token not exists',token);
    return true; // Allow access if token exists
  } else {
    router.navigate(['/home']); // Redirect to login if token is missing
    return false;
  }
};
