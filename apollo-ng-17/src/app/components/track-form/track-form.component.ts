import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, DividerModule, CalendarModule, ButtonModule],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.scss'
})
export class TrackFormComponent {

    testId : any | null = null;
    dlNumber : any | null = null;
    firstName : string | null = null;
    lastName : string | null = null;
    dateOfBirth : Date | null = null;
    disabled: boolean = true;

    constructor(private router : Router) {}

    verifyDisabled() {
        this.disabled = !(this.testId && this.dlNumber && this.firstName && this.lastName && this.dateOfBirth);
    }

    submit() {
        this.router.navigate(['/track', this.testId], {
            queryParams: {
                dlNumber: this.dlNumber,
                name: this.firstName,
                surname: this.lastName,
                dob: this.dateOfBirth?.toISOString()
            }
        });
    }

    clear() {
        this.testId = null;
        this.dlNumber = null;
        this.firstName = null;
        this.lastName = null;
        this.dateOfBirth = null;
    }
}
