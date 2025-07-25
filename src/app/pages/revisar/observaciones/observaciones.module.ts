import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObservacionesPageRoutingModule } from './observaciones-routing.module';

import { ObservacionesPage } from './observaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObservacionesPageRoutingModule
  ],
  declarations: [ObservacionesPage]
})
export class ObservacionesPageModule {}
