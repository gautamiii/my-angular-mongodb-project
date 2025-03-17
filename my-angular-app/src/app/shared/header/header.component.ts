import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule], // Add CommonModule for *ngIf
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false; // Store login status
  private loginStatusSubscription!: Subscription; // Use definite assignment assertion

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.loginStatusSubscription = this.authService.getLoginStatus().subscribe((status) => {
      this.isLoggedIn = status; // Update isLoggedIn dynamically
      console.log('Login status changed:', this.isLoggedIn); // Debugging
    });

    // Initialize isLoggedIn with the current status
    if (typeof window !== 'undefined') {
      this.isLoggedIn = this.authService.isLoggedIn();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.loginStatusSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}