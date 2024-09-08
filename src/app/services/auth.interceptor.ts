import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';  // Ensure correct path

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}  // AuthService is injected here

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getAuthToken();

    if (token && this.authService.isTokenExpired(token)) {
      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${newToken}`)
          });
          return next.handle(cloned);
        }),
        catchError(error => {
          console.error('Token refresh failed. Logging out...', error);
          this.authService.logout();
          return throwError(() => new Error('Token refresh failed'));
        })
      );
    }

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
