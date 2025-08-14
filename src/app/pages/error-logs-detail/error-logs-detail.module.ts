import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorLogsDetailPageRoutingModule } from './error-logs-detail-routing.module';

import { ErrorLogsDetailPage } from './error-logs-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorLogsDetailPageRoutingModule
  ],
  declarations: [ErrorLogsDetailPage]
})
export class ErrorLogsDetailPageModule {}
