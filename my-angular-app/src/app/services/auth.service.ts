import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Backend URL
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn()); // Initialize with current login status

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Register User
  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // ✅ Login User
  login(user: any) {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  // ✅ Store Token after Login
  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      this.loggedIn.next(true); // Notify components that the user is logged in
    }
  }

  // ✅ Get Token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // ✅ Check if User is Logged In
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // ✅ Logout
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      this.loggedIn.next(false); // Notify components that the user is logged out
      this.router.navigate(['/']); // Redirect to Home Page
    }
  }

  // ✅ Expose the login status as an Observable
  getLoginStatus() {
    return this.loggedIn.asObservable(); // Expose as Observable
  }
}