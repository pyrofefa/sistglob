import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FenologiasPage } from './fenologias.page';

const routes: Routes = [
  {
    path: '',
    component: FenologiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FenologiasPageRoutingModule {}
