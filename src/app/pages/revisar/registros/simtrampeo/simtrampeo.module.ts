import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimtrampeoPageRoutingModule } from './simtrampeo-routing.module';

import { SimtrampeoPage } from './simtrampeo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimtrampeoPageRoutingModule
  ],
  declarations: [SimtrampeoPage]
})
export class SimtrampeoPageModule {}
