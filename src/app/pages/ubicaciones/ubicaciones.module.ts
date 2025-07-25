import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UbicacionesPageRoutingModule } from './ubicaciones-routing.module';
import { UbicacionesPage } from './ubicaciones.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicacionesPageRoutingModule,
    PipesModule,
  ],
  declarations: [UbicacionesPage],
})
export class UbicacionesPageModule {}
