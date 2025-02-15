import { AppConfig, LayoutService } from './layout/service/app.layout.service';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) {}

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        //optional configuration with the default configuration
        const config: AppConfig = {
            ripple: true,                      //toggles ripple on and off
            inputStyle: 'outlined',             //default style for input elements
            menuMode: 'drawer',                 //layout mode of the menu, valid values are "static", "overlay", "slim", "horizontal", "reveal" and "drawer"
            colorScheme: 'dim',               //color scheme of the template, valid values are "light", "dim" and "dark"
            theme: 'green',                    //default component theme for PrimeNG
            menuTheme: "primaryColor",           //theme of the menu, valid values are "colorScheme", "primaryColor" and "transparent"
            scale: 14                           //size of the body font size to scale the whole application
        };
        this.layoutService.config.set(config);
    }
}
