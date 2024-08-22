import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '@app/interfaces/media.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'http://localhost:8080/movies'; // Adjust the URL if necessary

  constructor(private http: HttpClient) {}

  playMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/${id}/play`);
  }

  getCurrentlyPlayingMovie(): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/currently-playing`);
  }

  stopMovie(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop`, {});
  }

  playNextMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/${id}/next`);
  }

  playPreviousMovie(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/${id}/previous`);
  }
}
