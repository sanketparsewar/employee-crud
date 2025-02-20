import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router=inject(Router)
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
            authService.logout().subscribe({
              next: () => {
                toastService.showError('Session expired. Please login to continue');
                router.navigate(['auth', 'login']);
              },
              error: (error) => {
                toastService.showError(error.error?.message);
              },
            });
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
