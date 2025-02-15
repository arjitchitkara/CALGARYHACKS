import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss'
})
export class TrackComponent {

    testId : any = "";
    dlNumber : any = "";
    firstName : string = "";
    lastName : string = "";
    dateOfBirth : Date | undefined;
}
