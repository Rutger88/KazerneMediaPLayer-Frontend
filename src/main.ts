import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      // Your routes here
    ]),
    provideHttpClient(withInterceptorsFromDi()), // HttpClient provided at the root level
  ]
}).catch(err => console.error(err));
