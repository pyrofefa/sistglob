import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimgbnPage } from './simgbn.page';

const routes: Routes = [
  {
    path: '',
    component: SimgbnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimgbnPageRoutingModule {}
