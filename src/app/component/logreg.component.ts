import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '@app/services/user-service.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-logreg',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logreg.component.html',
  styleUrls: ['./logreg.component.scss']
})
export class LogregComponent {
  // Common properties for login and registration
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';
  isLoginActive: boolean = true;  // Controls whether login or registration is shown

  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router, 
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  // Toggle between Login and Registration forms
  toggleForm(formType: string) {
    this.isLoginActive = formType === 'login';
    this.errorMessage = '';  // Clear error messages when toggling forms
  }

  // Close the modal
  close() {
    this.closeModal.emit();
  }

  // Handle login
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
        this.close();
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.handleError(err);
      }
    });
  }

  // Handle registration
  register() {
    if (this.username === '' || this.password === '' || this.email === '') {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.http.post('http://localhost:8080/user/register', {
      username: this.username,
      password: this.password,
      email: this.email
    }).subscribe({
      next: () => {
        this.close();  // Close modal on successful registration
        this.router.navigate(['/login']);  // Redirect to login page
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  // Handle errors for both login and registration
  handleError(err: any) {
    if (err.status === 401) {
      this.errorMessage = 'Invalid username or password';
    } else if (err.status === 400) {
      this.errorMessage = 'Invalid registration data';
    } else if (err.status === 0) {
      this.errorMessage = 'Network error, please try again';
    } else {
      this.errorMessage = 'An error occurred, please try again';
    }
  }
}
