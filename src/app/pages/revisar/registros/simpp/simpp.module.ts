import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimppPageRoutingModule } from './simpp-routing.module';

import { SimppPage } from './simpp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimppPageRoutingModule
  ],
  declarations: [SimppPage]
})
export class SimppPageModule {}
