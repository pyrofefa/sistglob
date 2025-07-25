import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimtoPageRoutingModule } from './simto-routing.module';

import { SimtoPage } from './simto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimtoPageRoutingModule
  ],
  declarations: [SimtoPage]
})
export class SimtoPageModule {}
