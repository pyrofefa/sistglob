import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimepPageRoutingModule } from './simep-routing.module';

import { SimepPage } from './simep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimepPageRoutingModule
  ],
  declarations: [SimepPage]
})
export class SimepPageModule {}
