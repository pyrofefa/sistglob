import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'capturas/:ubicacion/:name/:campana',
    loadChildren: () => import('./pages/capturas/capturas.module').then( m => m.CapturasPageModule)
  },
  {
    path: 'detalle',
    loadChildren: () => import('./pages/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-detalle/:id/:name',
    loadChildren: () => import('./pages/registro-detalle/registro-detalle.module').then( m => m.RegistroDetallePageModule)
  },
  {
    path: 'registros',
    loadChildren: () => import('./pages/revisar/registros/registros.module').then( m => m.RegistrosPageModule)
  },
  {
    path: 'revisar',
    loadChildren: () => import('./pages/revisar/revisar.module').then( m => m.RevisarPageModule)
  },
  {
    path: 'subir',
    loadChildren: () => import('./pages/subir/subir.module').then( m => m.SubirPageModule)
  },
  {
    path: 'ubicaciones/:id/:name',
    loadChildren: () => import('./pages/ubicaciones/ubicaciones.module').then( m => m.UbicacionesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
