import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';  // Ensure this path is correct
import { catchError, switchMap } from 'rxjs/operators';  // Add these imports from rxjs
import { throwError } from 'rxjs';  // Import throwError to handle errors

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // Inject AuthService using Angular's inject() function
  const authService = inject(AuthService);
  
  const token = authService.getAuthToken();

  if (token && authService.isTokenExpired(token)) {
    return authService.refreshToken().pipe(
      switchMap((newToken: string) => {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${newToken}`)
        });
        return next(cloned);
      }),
      catchError(error => {
        console.error('Token refresh failed. Logging out...', error);
        authService.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
