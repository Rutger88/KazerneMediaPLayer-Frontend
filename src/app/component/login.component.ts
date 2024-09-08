import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '@app/services/user-service.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
libId: string ='';

  @Output() closeModal = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router, 
     private userService: UserServiceService,
     private authService: AuthService,
  
  ) {}

  close() {
    this.closeModal.emit();
  }

  onLogin() {
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Username and password are required';
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('libraryId', response.libraryId.toString());
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error, please try again';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      }
    });
  }
}