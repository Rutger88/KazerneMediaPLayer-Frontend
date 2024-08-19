import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { PlayerComponent } from './component/player/player.component'; 
import { CommonModule } from '@angular/common';
import { MediaService } from '@services/media.service';
import { Media } from '@app/interfaces/media.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule, // Correctly add HttpClientModule
    PlayerComponent, 
    CommonModule,
  ],
  providers: [
    MediaService // Only include this if MediaService is not providedIn: 'root'
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.mediaService.getMediaData().subscribe({
      next: (data: Media[]) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching media data:', error);
      },
      complete: () => {
        console.log('Media data fetching complete');
      }
    });
  }
}
