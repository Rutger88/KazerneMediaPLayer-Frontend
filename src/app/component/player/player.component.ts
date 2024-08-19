import { Component } from '@angular/core';
import { MediaService } from '@services/media.service';
import { CommonModule } from '@angular/common';
import { Media } from '@app/interfaces/media.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class PlayerComponent {
  currentMediaUrl: string | undefined;
  isAudio: boolean = false;
  currentId: number = 1;

  constructor(private mediaService: MediaService) {}

  playMedia(id: number) {
    this.mediaService.playMedia(id).subscribe((media: Media) => {
      this.isAudio = media.type === 'audio/mpeg';
      this.mediaService.streamMedia(media.id).subscribe((url: string) => {
        this.currentMediaUrl = url;
      });
    });
  }

  stopMedia() {
    this.mediaService.stopMedia().subscribe(() => {
      this.currentMediaUrl = undefined;
    });
  }

  playNext(id: number) {
    this.mediaService.playNext(id).subscribe((media: Media) => {
      this.playMedia(media.id);
    });
  }

  playPrevious(id: number) {
    this.mediaService.playPrevious(id).subscribe((media: Media) => {
      this.playMedia(media.id);
    });
  }
}
