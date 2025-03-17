import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule], // ✅ Add FormsModule here
})
export class LoginComponent {
  user = { email: '', password: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.user).subscribe(
      (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/courses']); // Redirect to Courses after login
      },
      (err) => {
        this.message = 'Invalid credentials! Try again.';
      }
    );
  }
}
