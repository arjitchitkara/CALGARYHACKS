import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GooglemapComponent } from './GoogleMapsModule/googlemap.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GooglemapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GoogleMA';
}