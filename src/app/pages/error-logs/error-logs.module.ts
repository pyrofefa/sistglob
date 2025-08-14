import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorLogsPageRoutingModule } from './error-logs-routing.module';

import { ErrorLogsPage } from './error-logs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorLogsPageRoutingModule
  ],
  declarations: [ErrorLogsPage]
})
export class ErrorLogsPageModule {}
