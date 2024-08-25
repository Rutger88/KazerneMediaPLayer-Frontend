import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Media } from '@app/interfaces/media.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'http://localhost:8080/movies';

  constructor(private http: HttpClient) {}

  // Fetch currently playing movie
  getCurrentlyPlayingMovie(): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/currently-playing`).pipe(
      catchError(this.handleError)
    );
  }

  // Play a specific movie
  playMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/play/${id}`).pipe(
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
  playNextMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/next/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Play the previous movie
  playPreviousMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/previous/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message); // Log error message
    // Return a user-friendly error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
