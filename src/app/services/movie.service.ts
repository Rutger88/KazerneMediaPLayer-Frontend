import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'http://localhost:8080/movies';

  constructor(private http: HttpClient) {}

  // Stream a specific movie by ID
  streamMovie(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/stream/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Stop the currently playing movie
  stopMovie(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Play the next movie
  playNextMovie(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/next/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Play the previous movie
  playPreviousMovie(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/previous/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message); // Log error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
