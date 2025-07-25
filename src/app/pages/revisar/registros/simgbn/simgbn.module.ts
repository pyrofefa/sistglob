import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimgbnPageRoutingModule } from './simgbn-routing.module';

import { SimgbnPage } from './simgbn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimgbnPageRoutingModule
  ],
  declarations: [SimgbnPage]
})
export class SimgbnPageModule {}
