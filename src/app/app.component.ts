import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MediaService } from './services/media.service';
import { ParentComponent } from './component/player/parent.component';
import { LoginComponent } from './component/login.component';
import { RegistrationComponent } from './component/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ParentComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  providers: [
    MediaService,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoginModalOpen = false; // Added properties
  isRegisterModalOpen = false; // Added properties
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

  // Added the openModal method
  openModal(modalType: string) {
    if (modalType === 'loginModal') {
      this.isLoginModalOpen = true;
    } else if (modalType === 'registerModal') {
      this.isRegisterModalOpen = true;
    }
  }

  // Added the closeModal method
  closeModal(modalType: string) {
    if (modalType === 'loginModal') {
      this.isLoginModalOpen = false;
    } else if (modalType === 'registerModal') {
      this.isRegisterModalOpen = false;
    }
  }
}
