import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/user/login';
  private refreshUrl = 'http://localhost:8080/user/refresh';
  private logoutUrl = 'http://localhost:8080/user/logout';

  constructor(private http: HttpClient) {}

  // User login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap((response) => {
        this.storeTokens(response.token, response.refreshToken, response.user.username, response.user.id);
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError(() => new Error('Failed to log in.'));
      })
    );
  }

  // Refresh the access token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    return this.http.post<any>(this.refreshUrl, {}, { headers }).pipe(
      tap((response) => {
        this.storeTokens(response.token, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Token refresh error', error);
        this.logout();
        return throwError(() => new Error('Failed to refresh token.'));
      })
    );
  }

  // User logout
  logout(): Observable<any> {
    const token = this.getAuthToken();
    if (!token) {
      console.warn('No auth token found during logout');
      return new Observable((observer) => {
        observer.error('No token found');
        observer.complete();
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.logoutUrl, {}, { headers }).pipe(
      tap({
        next: () => {
          this.clearLocalStorage();
          window.location.href = '/login';  // Redirect after logout
        },
        error: (err) => {
          console.error('Logout request failed:', err);
          localStorage.clear();
          window.location.href = '/login'; // Redirect regardless of failure
        },
      })
    );
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;

      if (expiration > Date.now()) {
        return true;
      } else {
        // Try refreshing the token if it has expired
        this.refreshToken().subscribe({
          next: (response) => {
            this.storeTokens(response.token, response.refreshToken);
          },
          error: () => {
            this.logout();
          },
        });
        return false;
      }
    }
    return false;
  }

  // Get stored auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Store tokens in localStorage
  private storeTokens(authToken: string, refreshToken: string, username?: string, userId?: number): void {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (username) {
      localStorage.setItem('username', username);
    }
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
  }

  // Clear localStorage upon logout
  private clearLocalStorage(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }
}
