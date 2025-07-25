import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturasPageRoutingModule } from './capturas-routing.module';

import { CapturasPage } from './capturas.page';
import { SimdiaComponent } from 'src/app/components/simdia/simdia.component';
import { SimepComponent } from 'src/app/components/simep/simep.component';
import { SimgbnComponent } from 'src/app/components/simgbn/simgbn.component';
import { SimppComponent } from 'src/app/components/simpp/simpp.component';
import { SimtrampeoComponent } from 'src/app/components/simtrampeo/simtrampeo.component';
import { SimmoscasComponent } from 'src/app/components/simmoscas/simmoscas.component';
import { SimtoComponent } from 'src/app/components/simto/simto.component';
import { SimpicudoComponent } from 'src/app/components/simpicudo/simpicudo.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturasPageRoutingModule,
    PipesModule,
  ],
  declarations: [
    CapturasPage,
    SimdiaComponent,
    SimepComponent,
    SimgbnComponent,
    SimppComponent,
    SimtrampeoComponent,
    SimmoscasComponent,
    SimtoComponent,
    SimpicudoComponent,
  ],
})
export class CapturasPageModule {}
