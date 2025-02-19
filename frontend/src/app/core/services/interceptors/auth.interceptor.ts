import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inject Router dynamically
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('401 Unauthorized - Refreshing Token');

        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(req);
          }),
          catchError((refreshError) => {
            toastService.showError('Session expired. Please login to continue');
            authService.logout(); // Clear session if needed
            router.navigate(['/login']); // Redirect to login
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
