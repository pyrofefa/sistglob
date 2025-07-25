import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OmisionesPageRoutingModule } from './omisiones-routing.module';

import { OmisionesPage } from './omisiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OmisionesPageRoutingModule
  ],
  declarations: [OmisionesPage]
})
export class OmisionesPageModule {}
