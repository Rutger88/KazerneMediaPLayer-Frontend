import { Routes } from '@angular/router';
import { LoginComponent } from '@app/component/login.component';
import { PlayerComponent } from '@app/component/player/player.component';
import { AuthGuard } from '@app/services/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'media-player', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];