import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/user/login';  // Your login endpoint
  private refreshUrl = 'http://localhost:8080/user/refresh';  // Refresh token endpoint
  private logoutUrl = 'http://localhost:8080/user/logout';  // Logout endpoint

  constructor(private http: HttpClient) {}

  // User login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap(response => {
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
      tap(response => {
        this.storeTokens(response.token, response.refreshToken);  // Store new tokens
      }),
      catchError((error) => {
        console.error('Token refresh error', error);
        this.logout();  // Log out if refresh fails
        return throwError(() => new Error('Failed to refresh token.'));
      })
    );
  }

  // Logout method
  logout(): void {
    localStorage.clear();  // Clear all tokens
    window.location.href = '/login';  // Redirect to login
  }

  // Check if the token is expired
  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;  // Convert expiration to milliseconds
    return expiration < Date.now();  // Check if token is expired
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
    console.log('Storing auth token:', authToken);  // Add this log
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (username) {
      localStorage.setItem('username', username);
    }
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
  }
}
