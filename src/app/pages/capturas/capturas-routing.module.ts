import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapturasPage } from './capturas.page';

const routes: Routes = [
  {
    path: '',
    component: CapturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapturasPageRoutingModule {}
