import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrampasPage } from './trampas.page';

const routes: Routes = [
  {
    path: '',
    component: TrampasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrampasPageRoutingModule {}
