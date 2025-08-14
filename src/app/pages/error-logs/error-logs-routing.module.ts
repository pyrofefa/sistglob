import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorLogsPage } from './error-logs.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorLogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorLogsPageRoutingModule {}
