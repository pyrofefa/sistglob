import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimpicudoPageRoutingModule } from './simpicudo-routing.module';

import { SimpicudoPage } from './simpicudo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimpicudoPageRoutingModule
  ],
  declarations: [SimpicudoPage]
})
export class SimpicudoPageModule {}
