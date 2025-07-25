import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FenologiasPageRoutingModule } from './fenologias-routing.module';

import { FenologiasPage } from './fenologias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FenologiasPageRoutingModule
  ],
  declarations: [FenologiasPage]
})
export class FenologiasPageModule {}
