import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmisionesPage } from './omisiones.page';

const routes: Routes = [
  {
    path: '',
    component: OmisionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OmisionesPageRoutingModule {}
