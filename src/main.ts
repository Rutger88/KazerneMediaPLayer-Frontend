import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ParentComponent } from '@app/component/player/parent.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { LogregComponent } from '@app/component/logreg.component';
import { PlayerComponent } from '@app/component/player/player.component';  // Ensure this exists
import { authInterceptorFn } from '@app/services/auth.interceptor.fn'; // Import the function-based interceptor
import { AuthGuard } from '@app/services/auth.guard';  // Import the AuthGuard

const routes: Routes = [
  { path: 'home', component: ParentComponent },
  { path: 'login', component: LogregComponent },
  { path: 'media-player', component: PlayerComponent, canActivate: [AuthGuard] },  // Protect media-player route
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect to login by default
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptorFn])),  // Provide HttpClient with the function-based AuthInterceptor
    provideRouter(routes),
  ],
}).catch(err => console.error(err));