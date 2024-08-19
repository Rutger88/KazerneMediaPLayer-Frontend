import { Component } from '@angular/core';
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

  constructor(private mediaService: MediaService) {}

  playMedia(id: number) {
    this.mediaService.playMedia(id).subscribe({
      next: (media: Media) => {
        this.isAudio = media.type === 'audio/mpeg';
        this.mediaService.streamMedia(media.id).subscribe({
          next: (url: string) => {
            this.currentMediaUrl = url;
          },
          error: (err) => {
            console.error('Error streaming media:', err);
            this.currentMediaUrl = undefined;  // Reset if streaming fails
          }
        });
      },
      error: (err) => {
        console.error('Error playing media:', err);
      }
    });
  }

  stopMedia() {
    this.mediaService.stopMedia().subscribe({
      next: () => {
        this.currentMediaUrl = undefined;
      },
      error: (err) => {
        console.error('Error stopping media:', err);
      }
    });
  }

  playNext(id: number) {
    this.mediaService.playNext(id).subscribe({
      next: (media: Media) => {
        this.playMedia(media.id);
      },
      error: (err) => {
        console.error('Error playing next media:', err);
      }
    });
  }

  playPrevious(id: number) {
    this.mediaService.playPrevious(id).subscribe({
      next: (media: Media) => {
        this.playMedia(media.id);
      },
      error: (err) => {
        console.error('Error playing previous media:', err);
      }
    });
  }
}
