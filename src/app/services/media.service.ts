import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Media } from '@app/interfaces/media.interface';


@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private baseUrl = 'http://localhost:8080/media'; 

  constructor(private http: HttpClient) {}

  getMediaData(): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  playMedia(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/play/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  stopMedia(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop`, {}).pipe(
      catchError(this.handleError)
    );
  }

  playNext(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/next/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  playPrevious(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/previous/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  streamMedia(id: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/stream/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
