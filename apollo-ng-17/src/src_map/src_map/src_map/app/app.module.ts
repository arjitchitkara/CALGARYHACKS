import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { GooglemapComponent } from './GoogleMapsModule/googlemap.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    GooglemapComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }