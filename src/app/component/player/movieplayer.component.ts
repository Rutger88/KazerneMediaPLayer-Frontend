import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '@services/movie.service';
import { Media } from '@app/interfaces/media.interface';

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
  currentMovieUrl?: string;
  errorMessage?: string;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getCurrentlyPlayingMovie().subscribe({
      next: (media: Media) => {
        this.currentMovieId = media.id;
        this.currentMovieUrl = media.url;
      },
      error: (err) => {
        console.error('Error fetching currently playing movie:', err);
        this.errorMessage = `Error fetching currently playing movie: ${err.message || 'Unknown error'}`;
      },
    });
  }

  playMovie(id: number) {
    this.movieService.playMovie(id).subscribe({
      next: (media: Media) => {
        this.currentMovieUrl = media.url;
        this.errorMessage = undefined;
        this.playVideo();
      },
      error: (err) => {
        console.error('Error playing movie:', err);
        this.errorMessage = `Failed to play movie. ${err.message || 'Unknown error'}`;
      },
    });
  }

  stopMovie() {
    this.currentMovieUrl = undefined;
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.currentTime = 0; // Optionally reset to start
    }
  }

  playPreviousMovie() {
    if (this.currentMovieId !== undefined) {
      this.playMovie(this.currentMovieId - 1);
    } else {
      console.error('No previous movie available');
      this.errorMessage = 'No previous movie available.';
    }
  }

  playNextMovie() {
    if (this.currentMovieId !== undefined) {
      this.playMovie(this.currentMovieId + 1);
    } else {
      console.error('No next movie available');
      this.errorMessage = 'No next movie available.';
    }
  }

  private playVideo() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play();
    } else {
      console.error('Video element not found');
      this.errorMessage = 'Failed to play movie. Video element not available.';
    }
  }
}
