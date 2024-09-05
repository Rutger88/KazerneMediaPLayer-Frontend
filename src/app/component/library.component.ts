import { Component, OnInit } from '@angular/core';
import { LibraryService } from '@app/services/library.service';  // Adjust the path to your LibraryService
import { Library } from 'app/interfaces/library.interface';  // Adjust the path to your Library model
import { Observable } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  otherLibraries: Library[] = [];
  errorMessage: string | undefined;
  currentUserId: string | null = localStorage.getItem('userId');

  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.loadOtherUsersLibraries();
  }

  // Load libraries from other users
  loadOtherUsersLibraries(): void {
    if (this.currentUserId) {
      this.libraryService.getOtherUsersLibraries(this.currentUserId).subscribe({
        next: (libraries) => {
          this.otherLibraries = libraries;
        },
        error: (err) => {
          console.error('Error loading other users\' libraries:', err);
          this.errorMessage = 'Could not load other users\' libraries.';
        }
      });
    }
  }

  // Share a library with another user (e.g., by entering their ID or using a UI element)
  shareLibrary(library: Library): void {
    const targetUserId = prompt('Enter the user ID to share this library with:');  // You can replace this with a UI element
    if (targetUserId) {
      this.libraryService.shareLibrary(library.id, +targetUserId).subscribe({
        next: () => {
          console.log(`Library ${library.id} shared successfully with user ${targetUserId}`);
          alert('Library shared successfully.');
        },
        error: (err) => {
          console.error('Error sharing library:', err);
          this.errorMessage = 'Failed to share the library. Please try again later.';
        }
      });
    }
  }
}
