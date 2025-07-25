import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionesPage } from './acciones.page';

const routes: Routes = [
  {
    path: '',
    component: AccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccionesPageRoutingModule {}
