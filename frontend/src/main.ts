import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  // In production override noisy console methods to avoid leaking data to the browser console.
  // Keep console.error/console.warn for real errors/warnings.
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));