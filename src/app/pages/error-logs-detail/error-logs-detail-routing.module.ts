import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorLogsDetailPage } from './error-logs-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorLogsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorLogsDetailPageRoutingModule {}
