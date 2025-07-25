import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimdiaPageRoutingModule } from './simdia-routing.module';

import { SimdiaPage } from './simdia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimdiaPageRoutingModule
  ],
  declarations: [SimdiaPage]
})
export class SimdiaPageModule {}
