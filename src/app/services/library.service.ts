import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';





@Injectable({ providedIn: 'root' })
export class LibraryService {
  constructor(private http: HttpClient) {}

  getOtherUsersLibraries(currentUserId: string): Observable<Library[]> {
    return this.http.get<Library[]>(`/api/libraries/others/${currentUserId}`);
  }

  shareLibrary(libraryId: number, targetUserId: number): Observable<void> {
    return this.http.post<void>(`/api/libraries/share?libraryId=${libraryId}&targetUserId=${targetUserId}`, {});
  }
}