import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PlayerComponent } from './component/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    // other components
  ],
  imports: [
    BrowserModule,
    // other modules
  ],
  providers: [
    provideHttpClient(withFetch()),  // Use this modern configuration
  ],
  bootstrap: [AppComponent]  // Bootstrap the app through AppModule
})
export class AppModule { }
