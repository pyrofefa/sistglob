import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimdiaPage } from './simdia.page';

const routes: Routes = [
  {
    path: '',
    component: SimdiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimdiaPageRoutingModule {}
