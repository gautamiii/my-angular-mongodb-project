import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Zone.js change detection
    provideRouter(routes), // Router configuration
    provideClientHydration(withEventReplay()), // Client hydration for SSR
    provideHttpClient(), // Add provideHttpClient here
  ],
};