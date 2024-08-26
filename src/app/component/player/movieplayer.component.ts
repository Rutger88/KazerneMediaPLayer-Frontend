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

  constructor(private movieService: MovieService) {}
  
  ngOnInit() {
    this.playMovie(5);  // Automatically try to play movie with ID 5 on init
  }

  playMovie(id: number) {
    console.log('Attempting to play movie with ID:', id);  
    this.movieService.streamMovie(id).subscribe({
      next: (blob: Blob) => {
        this.currentMovieId = id;
        this.setVideoSource(blob);
        this.errorMessage = undefined;
      },
      error: (err) => {
        console.error('Error streaming movie:', err);
        this.errorMessage = `Failed to stream movie. ${err.message || 'Unknown error'}`;
      },
    });
  }

  stopMovie() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0; // Optionally reset to start
      this.videoElement.nativeElement.src = ''; // Clear the source
    }
  }

  playPreviousMovie() {
    if (this.currentMovieId !== undefined) {
      this.movieService.playPreviousMovie(this.currentMovieId).subscribe({
        next: (blob: Blob) => {
          this.setVideoSource(blob);
          this.errorMessage = undefined;
        },
        error: (err) => {
          console.error('Error streaming previous movie:', err);
          this.errorMessage = `Failed to stream previous movie. ${err.message || 'Unknown error'}`;
        },
      });
    } else {
      this.errorMessage = 'No previous movie available.';
    }
  }

  playNextMovie() {
    if (this.currentMovieId !== undefined) {
      this.movieService.playNextMovie(this.currentMovieId).subscribe({
        next: (blob: Blob) => {
          this.setVideoSource(blob);
          this.errorMessage = undefined;
        },
        error: (err) => {
          console.error('Error streaming next movie:', err);
          this.errorMessage = `Failed to stream next movie. ${err.message || 'Unknown error'}`;
        },
      });
    } else {
      this.errorMessage = 'No next movie available.';
    }
  }

  private setVideoSource(blob: Blob) {
    const url = URL.createObjectURL(blob);
    console.log('Setting video source URL:', url);  // Add this line
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.src = url;
      this.videoElement.nativeElement.load();
      this.videoElement.nativeElement.play();  // This will automatically start playback
    } else {
      this.errorMessage = 'Failed to set movie source. Video element not available.';
      console.error(this.errorMessage);
    }
  }
}
