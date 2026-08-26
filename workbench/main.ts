import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { WbApp } from './app';
import { routes } from './routes';

bootstrapApplication(WbApp, {
  providers: [
    provideZonelessChangeDetection(),
    // Hash routing keeps deep links working on GitHub Pages without a
    // server-side rewrite or a 404.html fallback.
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
  ],
}).catch((error: unknown) => {
  console.error(error);
});
