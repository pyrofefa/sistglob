import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimtoPage } from './simto.page';

const routes: Routes = [
  {
    path: '',
    component: SimtoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimtoPageRoutingModule {}
