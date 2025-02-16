import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { GoogleFitService } from 'src/app/services/google-fit.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    rememberMe: boolean = false;
    user: any = null;
    fitnessData: any[] = [];

    constructor(private googleFitService: GoogleFitService, private layoutService: LayoutService, private router : Router) {}

    ngOnInit(): void {
        // this.getUserData();
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    login() {
        this.googleFitService.getAuthUrl().subscribe((response) => {
        window.location.href = response.authUrl;
    });
    }

    getUserData() {
        this.googleFitService.fetchUserData()
        this.router.navigateByUrl('/home')
    }

    logout() {
        this.googleFitService.logout().subscribe(() => {
        this.user = null;
        this.fitnessData = [];
    });
    }
}


