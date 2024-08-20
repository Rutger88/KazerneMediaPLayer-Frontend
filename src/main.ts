import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { PlayerComponent } from '@app/component/player/player.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'home', component: PlayerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // This provides HttpClient throughout the app
    provideRouter(routes),

  ],
}).catch(err => console.error(err));
