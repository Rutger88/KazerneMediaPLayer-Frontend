import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ParentComponent } from '@app/component/player/parent.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { LoginComponent } from '@app/component/login.component';
import { RegistrationComponent } from '@app/component/register.component';
import { PlayerComponent } from '@app/component/player/player.component';  // Ensure this exists

const routes: Routes = [
  { path: 'home', component: ParentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'media-player', component: PlayerComponent },  // Route to media player
  { path: '', redirectTo: '/media-player', pathMatch: 'full' },  // Redirect to media-player by default
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),  // This provides HttpClient throughout the app
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
