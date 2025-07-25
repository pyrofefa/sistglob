import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrotesPageRoutingModule } from './brotes-routing.module';

import { BrotesPage } from './brotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrotesPageRoutingModule
  ],
  declarations: [BrotesPage]

})
export class BrotesPageModule {}
