import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroDetallePageRoutingModule } from './registro-detalle-routing.module';

import { RegistroDetallePage } from './registro-detalle.page';
import { SimpicudoComponent } from 'src/app/components/detalles/simpicudo/simpicudo.component';
import { SimppComponent } from 'src/app/components/detalles/simpp/simpp.component';
import { SimepComponent } from 'src/app/components/detalles/simep/simep.component';
import { SimgbnComponent } from 'src/app/components/detalles/simgbn/simgbn.component';
import { SimdiaComponent } from 'src/app/components/detalles/simdia/simdia.component';
import { FenologiaBrotesPipe } from 'src/app/pipes/fenologia-brote.pipe';
import { SimmoscasComponent } from 'src/app/components/detalles/simmoscas/simmoscas.component';
import { SimtoComponent } from 'src/app/components/detalles/simto/simto.component';
import { SimtrampeoComponent } from 'src/app/components/detalles/simtrampeo/simtrampeo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroDetallePageRoutingModule,
  ],
  declarations: [
    RegistroDetallePage,
    FenologiaBrotesPipe,
    SimpicudoComponent,
    SimppComponent,
    SimepComponent,
    SimgbnComponent,
    SimdiaComponent,
    SimmoscasComponent,
    SimtoComponent,
    SimtrampeoComponent
  ],
})
export class RegistroDetallePageModule {}
