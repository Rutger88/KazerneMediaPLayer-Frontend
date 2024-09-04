import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Media } from '@app/interfaces/media.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private baseUrl = 'http://localhost:8080/media';
  private mediaCache: Media[] = [];

  constructor(private http: HttpClient) {}

  // Fetch media data, either from cache or the backend
  getMediaData(): Observable<Media[]> {
    if (this.mediaCache.length > 0) {
      return of(this.mediaCache);  // Return cached media data
    } else {
      return this.http.get<Media[]>(this.baseUrl, { headers: this.getAuthHeaders() }).pipe(
        tap(data => this.mediaCache = data),  // Cache the result
        catchError(this.handleError<Media[]>('getMediaData', []))
      );
    }
  }

  // Play a specific media file by ID
  playMedia(id: number): Observable<Media> {
    const media = this.mediaCache.find(m => m.id === id);
    if (media) {
      return of(media);  // Return from cache if available
    } else {
      return this.http.get<Media>(`${this.baseUrl}/play/${id}`, { headers: this.getAuthHeaders() }).pipe(
        tap(media => this.updateCache(media)),  // Update cache with fetched media
        catchError(this.handleError<Media>('playMedia'))
      );
    }
  }

  // Play the next media file by ID
  playNext(currentId: number): Observable<Media> {
    const currentIndex = this.mediaCache.findIndex(m => m.id === currentId);
    if (currentIndex !== -1 && currentIndex < this.mediaCache.length - 1) {
      return of(this.mediaCache[currentIndex + 1]);  // Return next media from cache if available
    } else {
      return this.http.get<Media>(`${this.baseUrl}/next/${currentId}`, { headers: this.getAuthHeaders() }).pipe(
        tap(media => this.updateCache(media)),  // Ensure the cache is updated with the next media
        catchError(this.handleError<Media>('playNext'))
      );
    }
  }

  // Play the previous media file by ID
  playPrevious(currentId: number): Observable<Media> {
    const currentIndex = this.mediaCache.findIndex(m => m.id === currentId);
    if (currentIndex > 0) {
      return of(this.mediaCache[currentIndex - 1]);  // Return previous media from cache if available
    } else {
      return this.http.get<Media>(`${this.baseUrl}/previous/${currentId}`, { headers: this.getAuthHeaders() }).pipe(
        tap(media => this.updateCache(media)),  // Ensure the cache is updated with the previous media
        catchError(this.handleError<Media>('playPrevious'))
      );
    }
  }

  // Upload a media file to the backend
  uploadMedia(file: File): Observable<any> {
    const libraryId = localStorage.getItem('libraryId');
    if (!libraryId) {
      return throwError(() => new Error('Library ID is missing'));
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload?libraryId=${libraryId}`, formData, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log('File uploaded successfully')),
      catchError(this.handleError('uploadMedia'))
    );
  }

  // Private method to get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No auth token found');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  // Private method to handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Handle unauthorized errors globally
      if (error.status === 401) {
        console.error('User is unauthorized, consider redirecting to login.');
        // Optionally, redirect to login page or refresh token here
      }

      return throwError(() => new Error('Something went wrong; please try again later.'));
    };
  }

  // Private method to update cache with new or updated media
  private updateCache(media: Media) {
    const existingIndex = this.mediaCache.findIndex(m => m.id === media.id);
    if (existingIndex === -1) {
      this.mediaCache.push(media);  // Add new media to the cache if it's not already there
    } else {
      this.mediaCache[existingIndex] = media;  // Update existing media in the cache
    }
  }
}
