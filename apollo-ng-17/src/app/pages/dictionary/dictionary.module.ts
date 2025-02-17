import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryRoutingModule } from './dictionary-routing.module';
import { DictionaryComponent } from './dictionary.component';

@NgModule({
  declarations: [DictionaryComponent],
  imports: [
    CommonModule,
    DictionaryRoutingModule
  ]
})
export class DictionaryModule { }
