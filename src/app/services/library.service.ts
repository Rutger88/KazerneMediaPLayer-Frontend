import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Library } from '@app/interfaces/library.interface';

@Injectable({ providedIn: 'root' })
export class LibraryService {

  
  private baseUrl = 'http://localhost:8080/libraries';  // Adjust the URL to match your backend

  constructor(private http: HttpClient) {}
  
  addLibrary(userId: number, library: Library): Observable<Library> {
    const url = `${this.baseUrl}/add/${userId}`;
    return this.http.post<Library>(url, library);
  }

  getOtherUsersLibraries(currentUserId: string): Observable<Library[]> {
    const url = `${this.baseUrl}/others/${currentUserId}`;
    return this.http.get<Library[]>(url);
  }

  shareLibrary(libraryId: number, targetUserId: number): Observable<void> {
    const url = `${this.baseUrl}/share?libraryId=${libraryId}&targetUserId=${targetUserId}`;
    return this.http.post<void>(url, {});
  }
}