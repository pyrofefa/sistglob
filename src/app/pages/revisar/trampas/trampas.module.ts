import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrampasPageRoutingModule } from './trampas-routing.module';

import { TrampasPage } from './trampas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrampasPageRoutingModule,
    PipesModule
  ],
  declarations: [TrampasPage]
})
export class TrampasPageModule {}
