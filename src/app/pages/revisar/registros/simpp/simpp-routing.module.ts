import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimppPage } from './simpp.page';

const routes: Routes = [
  {
    path: '',
    component: SimppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimppPageRoutingModule {}
