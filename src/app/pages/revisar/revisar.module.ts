import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisarPageRoutingModule } from './revisar-routing.module';

import { RevisarPage } from './revisar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisarPageRoutingModule
  ],
  declarations: [RevisarPage]
})
export class RevisarPageModule {}
