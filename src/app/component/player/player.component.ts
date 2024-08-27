import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class PlayerComponent implements AfterViewInit {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentMediaUrl: string | undefined;
  isAudio: boolean = false;
  currentId: number = 1;
  errorMessage: string | undefined;

  constructor(
    private mediaService: MediaService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Any additional setup for the player can go here
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
            if (this.isAudio) {
              this.audioElement.nativeElement.src = this.currentMediaUrl;
              this.audioElement.nativeElement.play();
            } else {
              this.videoElement.nativeElement.src = this.currentMediaUrl;
              this.videoElement.nativeElement.play();
            }
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

    if (this.isAudio) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    } else {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0;
    }
    if (this.currentMediaUrl) {
      window.URL.revokeObjectURL(this.currentMediaUrl);
    }
    this.currentMediaUrl = undefined;
  }

  playNext(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaService.playNext(id).subscribe({
      next: (media: Media) => {
        if (media) {
          this.playMedia(media.id);
        } else {
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
        this.playMedia(media.id);
      },
      error: (err) => {
        console.error('Error playing previous media:', err);
        this.errorMessage = 'Failed to play previous media. Please try again later.';
      }
    });
  }
}
