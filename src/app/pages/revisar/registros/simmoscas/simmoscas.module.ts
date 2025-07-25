import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimmoscasPageRoutingModule } from './simmoscas-routing.module';

import { SimmoscasPage } from './simmoscas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimmoscasPageRoutingModule
  ],
  declarations: [SimmoscasPage]
})
export class SimmoscasPageModule {}
