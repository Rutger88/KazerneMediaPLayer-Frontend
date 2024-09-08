import { Component } from '@angular/core';
import { PlayerComponent } from '@app/component/player/player.component';
import { MoviePlayerComponent } from '@app/component/player/movieplayer.component';
import { CommonModule } from '@angular/common';  // Import CommonModule


@Component({
  selector: 'app-media-and-movie-player',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MoviePlayerComponent], // Ensure CommonModule is included here
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  isMoviePlayerVisible: boolean = false; // Default to showing PlayerComponent

  constructor() {
    console.log('ParentComponent initialized');
  }

  showMoviePlayer() {
    this.isMoviePlayerVisible = true;
  }

  showPlayer() {
    this.isMoviePlayerVisible = false;
  }
}
