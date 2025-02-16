import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';

/* PrimeNG & PrimeFlex Modules */
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';

/* 
  Optionally import primeflex in angular.json:
  "styles": [
    "node_modules/primeflex/primeflex.css",
    ...
  ]
*/

@NgModule({
  declarations: [BrowseComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowseRoutingModule,
    ButtonModule,
    DropdownModule,
    RatingModule,
    InputTextModule
  ]
})
export class BrowseModule { }
