import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
//here ApplicationConfig is a type available in core package
//This registers global error handlers for the browser.

//provideBrowserGlobalErrorListeners-> It helps Angular catch errors such as:

// JavaScript runtime errors
// Unhandled promise rejections
// Angular application errors

// Instead of your application failing silently, Angular can detect and report them.
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(), // enables HttpClient so ApiService can call the backend
  ],

//   Providers tell Angular:

// "What services or features should be available application-wide?
};



// When the application starts, enable global error handling, enable routing using the routes defined in app.routes.ts, and enable HTTP requests so the application can communicate with backend APIs