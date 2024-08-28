import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  @Output() closeModal = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router) {}

  close() {
    this.closeModal.emit();
  }

  onLogin() {
    this.http.post<any>('http://localhost:8080/user/login', { username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.user.id.toString());
        
        // Store the library ID in localStorage
        if (response.user.libraries && response.user.libraries.length > 0) {
          const libraryId = response.user.libraries[0].id;
          localStorage.setItem('libraryId', libraryId.toString());
        }

        this.close(); // Close the modal after login
        this.router.navigate(['/home']); // Redirect to home
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
