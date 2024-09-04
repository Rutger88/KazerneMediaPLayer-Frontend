import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaService } from '@services/media.service';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { Media } from '@app/interfaces/media.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentMediaUrl: string | undefined;
  isAudio: boolean = false;
  currentId: number = 1;
  errorMessage: string | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private mediaService: MediaService,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
      this.cdr.detectChanges();
    }
  }

  playMedia(id: number): void {
    this.mediaService.playMedia(id).subscribe({
      next: (media) => this.setupMediaPlayback(media),
      error: (error) => {
        if (error.status === 401) {
          this.handleTokenRefresh(() => this.playMedia(id));
        } else {
          console.error('Error playing media:', error);
          this.errorMessage = 'Failed to play media. Please try again later.';
        }
      }
    });
  }

  setupMediaPlayback(media: Media) {
    if (media.type?.startsWith('audio')) {
      this.isAudio = true;
    } else if (media.type?.startsWith('video')) {
      this.isAudio = false;
    }

    this.currentMediaUrl = `http://localhost:8080/media/stream/${media.id}`;

    if (this.isAudio && this.audioElement) {
      this.audioElement.nativeElement.src = this.currentMediaUrl;
      this.audioElement.nativeElement.play().catch(error => console.error('Error playing audio:', error));
    } else if (this.videoElement) {
      this.videoElement.nativeElement.src = this.currentMediaUrl;
      this.videoElement.nativeElement.play().catch(error => console.error('Error playing video:', error));
    }
  }

  stopMedia() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isAudio && this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    } else if (this.videoElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0;
    }

    // No need to revokeObjectURL for HTTP URLs
    this.currentMediaUrl = undefined;
  }

  playNext(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.playNext(id).subscribe({
      next: (media: Media) => {
        if (media?.id) {
          console.log(`Playing next media with ID: ${media.id}`);
          this.playMedia(media.id);
        } else {
          console.warn('No next media found, or media data is invalid.');
          this.errorMessage = 'No more media available.';
        }
      },
      error: (err) => {
        console.error('Error playing next media:', err);
        this.errorMessage = 'Failed to play next media. Please try again later.';
      }
    });
  }

  playPrevious(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.playPrevious(id).subscribe({
      next: (media: Media) => {
        if (media?.id) {
          console.log(`Playing previous media with ID: ${media.id}`);
          this.playMedia(media.id);
        } else {
          console.warn('No previous media found, or media data is invalid.');
          this.errorMessage = 'No previous media available.';
        }
      },
      error: (err) => {
        console.error('Error playing previous media:', err);
        this.errorMessage = 'Failed to play previous media. Please try again later.';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadMedia(input.files[0]);
    }
  }

  uploadMedia(file: File) {
    const libraryId = localStorage.getItem('libraryId');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !libraryId) {
      this.errorMessage = 'You must be logged in to upload files.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`http://localhost:8080/media/upload?libraryId=${libraryId}`, formData, { headers })
      .subscribe({
        next: () => console.log('File uploaded successfully'),
        error: (err) => {
          if (err.status === 403) {
            this.errorMessage = 'You do not have permission to upload to this library.';
          } else if (err.status === 401) {
            this.errorMessage = 'Unauthorized. Please log in again.';
            this.authService.logout();
          } else {
            this.errorMessage = 'Failed to upload file. Please try again later.';
          }
        }
      });
  }

  private handleTokenRefresh(retryCallback: () => void) {
    this.authService.refreshToken().subscribe({
      next: () => retryCallback(),
      error: (refreshError) => {
        console.error('Failed to refresh token:', refreshError);
        this.authService.logout();
      }
    });
  }
}
