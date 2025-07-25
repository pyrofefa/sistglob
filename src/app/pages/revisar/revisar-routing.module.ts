import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisarPage } from './revisar.page';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'registros'
  },
  {
    path: '',
    component: RevisarPage,
    children:[
      {
        path:'registros',
        loadChildren: () => import('../revisar/registros/registros.module').then( m => m.RegistrosPageModule)
      },
      {
        path: 'observaciones',
        loadChildren: () => import('../revisar/observaciones/observaciones.module').then( m => m.ObservacionesPageModule)
      },
      {
        path: 'fenologias',
        loadChildren: () => import('../revisar/fenologias/fenologias.module').then( m => m.FenologiasPageModule)
      },
      {
        path: 'trampas',
        loadChildren: () => import('../revisar/trampas/trampas.module').then( m => m.TrampasPageModule)
      },
      {
        path: 'brotes',
        loadChildren: () => import('../revisar/brotes/brotes.module').then( m => m.BrotesPageModule)
      },
      {
        path: 'acciones',
        loadChildren: () => import('../revisar/acciones/acciones.module').then( m => m.AccionesPageModule)
      },
      {
        path: 'omisiones',
        loadChildren: () => import('../revisar/omisiones/omisiones.module').then( m => m.OmisionesPageModule)
      },
      {
        path: 'recomendaciones',
        loadChildren: () => import('../revisar/recomendaciones/recomendaciones.module').then( m => m.RecomendacionesPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisarPageRoutingModule {}
