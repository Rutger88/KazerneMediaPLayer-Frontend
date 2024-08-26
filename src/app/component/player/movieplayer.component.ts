import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movieplayer.component.html',
  styleUrls: ['./movieplayer.component.scss'],
})
export class MoviePlayerComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentMovieId?: number;
  errorMessage?: string;
  videoBlobUrl?: string;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    // Optionally load a movie initially without playing it.
  }

  playMovie(id: number) {
    if (this.videoBlobUrl) {
      // Play the loaded movie
      this.videoElement.nativeElement.play();
    } else {
      // Load and then play the movie
      this.loadMovie(id, true);
    }
  }

  stopMovie() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0; // Optionally reset to start
      this.videoElement.nativeElement.src = ''; // Clear the source
      this.videoBlobUrl = undefined; // Clear the stored blob URL
    }
  }

  playPreviousMovie() {
    if (this.currentMovieId !== undefined) {
      this.loadMovie(this.currentMovieId - 1, false);
    } else {
      this.errorMessage = 'No previous movie available.';
    }
  }

  playNextMovie() {
    if (this.currentMovieId !== undefined) {
      this.loadMovie(this.currentMovieId + 1, false);
    } else {
      this.errorMessage = 'No next movie available.';
    }
  }

  private loadMovie(id: number, autoPlay: boolean) {
    this.movieService.streamMovie(id).subscribe({
      next: (blob: Blob) => {
        this.currentMovieId = id;
        this.setVideoSource(blob, autoPlay);
        this.errorMessage = undefined;
      },
      error: (err) => {
        console.error('Error streaming movie:', err);
        this.errorMessage = `Failed to stream movie. ${err.message || 'Unknown error'}`;
      },
    });
  }

  private setVideoSource(blob: Blob, autoPlay: boolean) {
    this.videoBlobUrl = URL.createObjectURL(blob);
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.src = this.videoBlobUrl;
      this.videoElement.nativeElement.load();
      if (autoPlay) {
        this.videoElement.nativeElement.play();
      }
    } else {
      this.errorMessage = 'Failed to set movie source. Video element not available.';
      console.error(this.errorMessage);
    }
  }
}
