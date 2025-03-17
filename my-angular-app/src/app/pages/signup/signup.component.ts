import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule] // No need for providers
})
export class SignupComponent {
  user = { name: '', email: '', password: '' };
  message = '';

  private authService = inject(AuthService); // Using inject()

  onSignup() {
    this.authService.register(this.user).subscribe(
      () => {
        this.message = 'Registration Successful! Please log in.';
      },
      () => {
        this.message = 'Registration failed. Try again!';
      }
    );
  }
}
