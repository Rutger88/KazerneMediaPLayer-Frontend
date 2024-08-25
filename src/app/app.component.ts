import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MediaService } from './services/media.service';
import { ParentComponent } from './component/player/parent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,         // Angular router outlet
    CommonModule,         // Common Angular directives
    ParentComponent       // ParentComponent should be imported here
  ],
  providers: [
    MediaService,         // Provide the MediaService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mediaData: any;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.mediaService.getMediaData().subscribe({
      next: (data) => {
        this.mediaData = data;
        console.log(data);
      },
      error: (err) => console.error('Error fetching media data:', err),
      complete: () => console.log('Media data fetching complete')
    });
  }
}
