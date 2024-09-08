import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaService } from '@services/media.service';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { Media } from '@app/interfaces/media.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AudioVisualizerComponent } from '@app/audio-visualizer/audio-visualizer.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [CommonModule, FormsModule, AudioVisualizerComponent],
  standalone: true,
})
export class PlayerComponent implements AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioElement', { static: true }) audioElement!: ElementRef<HTMLAudioElement>;  // Use ElementRef for audioElement

  currentMediaUrl: string | undefined;
  isAudio: boolean = false;
  currentId: number = 1;
  errorMessage: string | undefined;
  isLoggedIn: boolean = false;
  currentlyPlayingFileName: string | undefined;
  progress: number = 0;
  isLibraryModalOpen: boolean = false;
  newLibrary: any = { name: '' };

  constructor(
    private mediaService: MediaService,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.addEventListener('timeupdate', this.updateProgress.bind(this));
    }
  }

  updateProgress(): void {
    const audio = this.audioElement.nativeElement;
    if (audio && audio.duration) {
      this.progress = (audio.currentTime / audio.duration) * 100;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
      this.cdr.detectChanges();
    }
  }

  playMedia(id: number): void {
    this.mediaService.playMedia(id).subscribe({
      next: (media: Media) => {
        this.currentId = media.id;
        this.currentlyPlayingFileName = media.name;
        this.setupMediaPlayback(media);
      },
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
      this.audioElement.nativeElement.load();
      this.audioElement.nativeElement.play().catch(error => console.error('Error playing audio:', error));
    } else if (this.videoElement) {
      this.videoElement.nativeElement.src = this.currentMediaUrl;
      this.videoElement.nativeElement.play().catch(error => console.error('Error playing video:', error));
    }
  }

  stopMedia() {
    if (this.isAudio && this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    } else if (this.videoElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0;
    }
  }

  playNext(): void {
    this.mediaService.playNext(this.currentId).subscribe({
      next: (media: Media) => {
        if (media?.id) {
          this.playMedia(media.id);
        } else {
          this.errorMessage = 'No more media available.';
        }
      },
      error: (err) => {
        console.error('Error playing next media:', err);
        this.errorMessage = 'Failed to play next media.';
      }
    });
  }

  playPrevious(): void {
    this.mediaService.playPrevious(this.currentId).subscribe({
      next: (media: Media) => {
        if (media?.id) {
          this.playMedia(media.id);
        } else {
          this.errorMessage = 'No previous media available.';
        }
      },
      error: (err) => {
        console.error('Error playing previous media:', err);
        this.errorMessage = 'Failed to play previous media.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.currentlyPlayingFileName = file.name;
      const audio = this.audioElement.nativeElement;
      audio.src = URL.createObjectURL(file);
      audio.load();
      audio.play();
    }
  }

  uploadMedia(file: File): void {
    const libraryId = localStorage.getItem('libraryId');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !libraryId) {
      this.errorMessage = 'You must be logged in to upload files.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`http://localhost:8080/media/upload?libraryId=${libraryId}`, formData, { headers }).subscribe({
      next: () => console.log('File uploaded successfully'),
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'You do not have permission to upload to this library.';
        } else if (err.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
          this.authService.logout();
        } else {
          this.errorMessage = 'Failed to upload file.';
        }
      }
    });
  }
  fetchCurrentlyPlayingFileName(): void {
    this.mediaService.getCurrentlyPlayingMedia().subscribe({
      next: (mediaName: string) => {
        this.currentlyPlayingFileName = mediaName || 'No media is currently playing';
      },
      error: (error) => {
        console.error('Error fetching currently playing media:', error);
        this.errorMessage = 'Failed to fetch currently playing media.';
      }
    });
  }

    // New Methods for Library functionality
    openLibraryModal(): void {
      this.isLibraryModalOpen = true;
    }
  
    closeLibraryModal(): void {
      this.isLibraryModalOpen = false;
    }
  
    submitLibrary(): void {
      const userId = localStorage.getItem('userId');  // Replace this with the correct way to get the userId
      if (!userId) {
        this.errorMessage = 'You must be logged in to add a library.';
        return;
      }
  
      this.http.post(`/user/${userId}`, this.newLibrary).subscribe({
        next: (response) => {
          console.log('Library added successfully:', response);
          this.closeLibraryModal();
        },
        error: (err) => {
          console.error('Error adding library:', err);
          this.errorMessage = 'Failed to add library. Please try again later.';
        }
      });
    }

  private handleTokenRefresh(retryCallback: () => void): void {
    this.authService.refreshToken().subscribe({
      next: () => retryCallback(),
      error: (refreshError) => {
        this.authService.logout();
      }
    });
  }
}
