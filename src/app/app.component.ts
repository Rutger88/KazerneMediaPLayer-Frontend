import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './component/player/player.component';
import { CommonModule } from '@angular/common';
import { MediaService } from './services/media.service'; // Ensure the correct path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PlayerComponent,
    CommonModule,
  ],
  providers: [
    MediaService,  // Provide the service here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.mediaService.getMediaData().subscribe({
      next: (data) => console.log(data),
      error: (err) => console.error('Error fetching media data:', err),
      complete: () => console.log('Media data fetching complete')
    });
  }
}
