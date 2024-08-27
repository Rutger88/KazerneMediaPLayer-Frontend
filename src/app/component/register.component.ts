import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';

  @Output() closeModal = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router) {}

  close() {
    this.closeModal.emit();
  }

  register() {
    this.http.post('http://localhost:8080/user/register', {
      username: this.username,
      password: this.password,
      email: this.email
    }).subscribe({
      next: () => {
        this.close();  // Close the modal on successful registration
        this.router.navigate(['/login']);
      },
      error: () => this.errorMessage = 'Registration failed'
    });
  }
}
