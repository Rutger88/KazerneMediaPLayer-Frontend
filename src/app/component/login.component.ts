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
        
        // Check if the user has any libraries
        if (response.user.libraries && response.user.libraries.length > 0) {
          localStorage.setItem('libraryId', response.user.libraries[0].id.toString());
          this.router.navigate(['/home']); // Redirect to home
        } else {
          console.warn('No library found for the user.');
          this.router.navigate(['/create-library']); // Redirect to a page where they can create a library
        }
  
        this.close(); // Close the modal after login
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
