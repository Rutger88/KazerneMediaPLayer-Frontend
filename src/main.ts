import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { PlayerComponent } from './app/component/player/player.component';
import { PageNotFoundComponent } from './app/page-not-found/page-not-found.component';
import { MediaService } from '@services/media.service';

const routes: Routes = [
  { path: 'home', component: PlayerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    MediaService,
  ],
}).catch(err => console.error(err));
