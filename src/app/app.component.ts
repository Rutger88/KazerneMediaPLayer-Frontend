import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
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
  isLoginModalOpen = false;
  isRegisterModalOpen = false;
  mediaData: any;

  constructor(private mediaService: MediaService, private router: Router) {}

  ngOnInit() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // If token exists, fetch media data
      this.mediaService.getMediaData().subscribe({
        next: (data) => {
          this.mediaData = data;
          console.log(data);
        },
        error: (err) => console.error('Error fetching media data:', err),
        complete: () => console.log('Media data fetching complete')
      });
    } else {
      // No token found, redirect to login
      console.error('No auth token found, redirecting to login.');
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.clear();  
    this.router.navigate(['/login']);  
  }

  openModal(modalType: string) {
    if (modalType === 'loginModal') {
      this.isLoginModalOpen = true;
    } else if (modalType === 'registerModal') {
      this.isRegisterModalOpen = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'loginModal') {
      this.isLoginModalOpen = false;
      this.router.navigate(['/home']);  
    } else if (modalType === 'registerModal') {
      this.isRegisterModalOpen = false;
      this.router.navigate(['/home']);  
    }
  }
}
