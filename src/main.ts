import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ParentComponent } from '@app/component/player/parent.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'home', component: ParentComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),  // This provides HttpClient throughout the app
    provideRouter(routes),

  ],
}).catch(err => console.error(err));
