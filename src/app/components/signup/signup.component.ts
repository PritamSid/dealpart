import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  passwordError: string = '';

  constructor(private authService: AuthService) { }

  onSignup(): void {
    this.message = '';
    this.passwordError = '';

    // Validate email
    if (!this.email) {
      this.message = 'Please enter both email and password.';
      return;
    }

    // Validate password
    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    const result = this.authService.signup(this.email, this.password);

    if (result.success) {
      this.message = result.message;
      this.email = '';
      this.password = '';
      this.passwordError = '';
    } else {
      this.message = result.message;
    }
  }
}