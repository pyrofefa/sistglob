import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimmoscasPage } from './simmoscas.page';

const routes: Routes = [
  {
    path: '',
    component: SimmoscasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimmoscasPageRoutingModule {}
