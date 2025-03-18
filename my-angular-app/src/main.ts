import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { AboutComponent } from './app/pages/about/about.component';
import { LoginComponent } from './app/pages/login/login.component';
import { SignupComponent } from './app/pages/signup/signup.component';
import { CoursesComponent } from './app/pages/courses/courses.component';
import { authGuard } from './app/guards/auth.guard'; // Import the guard function
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { PostsComponent } from './app/pages/dashboard/posts/posts.component';
import { MediaComponent } from './app/pages/dashboard/media/media.component';
import { SettingsComponent } from './app/pages/dashboard/settings/settings.component';
import { AnalyticsComponent } from './app/pages/dashboard/analytics/analytics.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' }, // Default tab
      { path: 'posts', component: PostsComponent },
      { path: 'media', component: MediaComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'analytics', component: AnalyticsComponent },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},  // 🔒 Protected route
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard] },  // 🔒 Protected route
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Attach routing
    provideHttpClient()    // Attach HttpClient
  ]
}).catch(err => console.error(err));
