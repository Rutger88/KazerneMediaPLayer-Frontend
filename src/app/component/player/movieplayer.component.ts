import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movie-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movieplayer.component.html',
  styleUrls: ['./movie-player.component.scss'],
})
export class MoviePlayerComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentMovieUrl: string | undefined;
  errorMessage: string | undefined;

  constructor(private movieService: MovieService) {}

  playMovie(id: number) {
    this.movieService.playMovie(id).subscribe({
      next: (media) => {
        this.currentMovieUrl = media.url;
        this.errorMessage = undefined;
        this.videoElement.nativeElement.play();
      },
      error: (err) => {
        console.error('Error playing movie:', err);
        this.errorMessage = 'Failed to play movie. Please try again later.';
      },
    });
  }

  stopMovie() {
    this.movieService.stopMovie().subscribe({
      next: () => {
        this.currentMovieUrl = undefined;
        this.videoElement.nativeElement.pause();
      },
      error: (err) => {
        console.error('Error stopping movie:', err);
        this.errorMessage = 'Failed to stop movie. Please try again later.';
      },
    });
  }

  playNextMovie(id: number) {
    this.movieService.playNextMovie(id).subscribe({
      next: (media) => {
        this.playMovie(media.id);
      },
      error: (err) => {
        console.error('Error playing next movie:', err);
        this.errorMessage = 'Failed to play next movie. Please try again later.';
      },
    });
  }

  playPreviousMovie(id: number) {
    this.movieService.playPreviousMovie(id).subscribe({
      next: (media) => {
        this.playMovie(media.id);
      },
      error: (err) => {
        console.error('Error playing previous movie:', err);
        this.errorMessage = 'Failed to play previous movie. Please try again later.';
      },
    });
  }
}
