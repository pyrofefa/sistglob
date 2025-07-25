import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrosPage } from './registros.page';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'simep'
  },
  {
    path: '',
    component: RegistrosPage,
    children :[
      {
        path: 'simep',
        loadChildren: () => import('../registros/simep/simep.module').then( m => m.SimepPageModule)
      },
      {
        path: 'simgbn',
        loadChildren: () => import('../registros/simgbn/simgbn.module').then(m => m.SimgbnPageModule)
      },
      {
        path: 'simdia',
        loadChildren: () => import('../registros/simdia/simdia.module').then(m => m.SimdiaPageModule)
      },
      {
        path: 'simpp',
        loadChildren: () => import('../registros/simpp/simpp.module').then( m => m.SimppPageModule)
      },
      {
        path: 'simmosca',
        loadChildren: () => import('../registros/simmoscas/simmoscas.module').then( m => m.SimmoscasPageModule)
      },
      {
        path: 'simtrampeo',
        loadChildren: () => import('../registros/simtrampeo/simtrampeo.module').then( m => m.SimtrampeoPageModule)
      },
      {
        path: 'simto',
        loadChildren: () => import('../registros/simto/simto.module').then( m => m.SimtoPageModule)
      },
      {
        path: 'simpicudo',
        loadChildren: () => import('../registros/simpicudo/simpicudo.module').then( m => m.SimpicudoPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrosPageRoutingModule {}
