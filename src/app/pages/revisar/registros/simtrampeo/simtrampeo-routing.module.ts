import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimtrampeoPage } from './simtrampeo.page';

const routes: Routes = [
  {
    path: '',
    component: SimtrampeoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimtrampeoPageRoutingModule {}
