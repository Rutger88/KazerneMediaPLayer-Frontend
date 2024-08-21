import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaService } from '@services/media.service';
import { CommonModule } from '@angular/common';
import { Media } from '@app/interfaces/media.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class PlayerComponent {
  currentMediaUrl: string | undefined;
  isAudio: boolean = false;
  currentId: number = 1;
  errorMessage: string | undefined;

  constructor(
    private mediaService: MediaService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.playMedia(this.currentId);
    }
  }

  playMedia(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.playMedia(id).subscribe({
      next: (media: Media) => {
        this.isAudio = media.type?.startsWith('audio/') || false;
        this.mediaService.streamMedia(media.id).subscribe({
          next: (blob: Blob) => {
            if (this.currentMediaUrl) {
              window.URL.revokeObjectURL(this.currentMediaUrl);
            }
            this.currentMediaUrl = window.URL.createObjectURL(blob);
            this.errorMessage = undefined;
          },
          error: (err) => {
            console.error('Error streaming media:', err);
            this.currentMediaUrl = undefined;
            this.errorMessage = 'Failed to stream media. Please try again later.';
          }
        });
      },
      error: (err) => {
        console.error('Error playing media:', err);
        this.errorMessage = 'Failed to play media. Please try again later.';
      }
    });
  }

  stopMedia() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.stopMedia().subscribe({
      next: () => {
        if (this.currentMediaUrl) {
          window.URL.revokeObjectURL(this.currentMediaUrl);
        }
        this.currentMediaUrl = undefined;
      },
      error: (err) => {
        console.error('Error stopping media:', err);
        this.errorMessage = 'Failed to stop media. Please try again later.';
      }
    });
  }

  playNext(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.playNext(id).subscribe({
      next: (media: Media) => {
        this.playMedia(media.id);
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
        this.playMedia(media.id);
      },
      error: (err) => {
        console.error('Error playing previous media:', err);
        this.errorMessage = 'Failed to play previous media. Please try again later.';
      }
    });
  }
}
