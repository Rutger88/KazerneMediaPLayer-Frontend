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
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  playMedia(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/play/${id}`);
  }

  stopMedia(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop`, {});
  }

  playNext(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/next/${id}`);
  }

  playPrevious(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/previous/${id}`);
  }

  streamMedia(id: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/stream/${id}`);
  }
}
