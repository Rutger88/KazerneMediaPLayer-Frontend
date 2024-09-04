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
      catchError(this.handleError)  // Handling errors
    );
  }

  // Stop the currently playing movie
  stopMovie(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop`, {}).pipe(
      catchError(this.handleError)  // Handling errors
    );
  }

  // Play the next movie
  playNextMovie(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/next/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)  // Handling errors
    );
  }

  // Play the previous movie
  playPreviousMovie(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/previous/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)  // Handling errors
    );
  }

  // New method to get a list of movies
  getMovies(): Observable<any[]> {  // Return type can be more specific if you have a Movie interface
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)  // Handle error appropriately
    );
  }
  
  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(`Server-side error: Status ${error.status}, Message: ${error.message}`);
    }
    return throwError(() => new Error(errorMessage));
  }
}
