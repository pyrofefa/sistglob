import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AssetsService } from 'src/app/services/assests.service';
import { SimtoService } from 'src/app/services/simto.service';

@Component({
  selector: 'app-simto',
  templateUrl: './simto.component.html',
  styleUrls: ['./simto.component.scss'],
  standalone: false,
})
export class SimtoComponent implements OnInit {
  id: any = null;
  devid: any;
  capturas: any = [];

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    public extras: AssetsService,
    public captura: SimtoService,
    public back: Router,
  ) {}

  ngOnInit() {
    this.id = this.route.paramMap.subscribe((id) => {
      this.devid = id.get('id');
      this.captura
        .getCapturaId(this.devid)
        .then((res) => {
          this.capturas = res;
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    });
  }

  reenviar(id: any) {
    this.extras.cargandoMessage('Guardando');
    this.captura
      .reenviar(id)
      .then((res) => {
        let result: any = res;
        setTimeout(() => {
          this.extras.loading.dismiss();
          if (result['status'] == 'success') {
            this.captura.capturas$.emit('Captura actualizadas correctamente');
            this.extras.presentToast('✅ ' + result['message']);
          } else if (result['status'] == 'warning') {
            this.captura.capturas$.emit(
              'Captura el registro ya existe en el servidor',
            );
            this.extras.presentToast('⚠️ ' + result['message']);
          } else {
            this.extras.presentToast(
              '❌ Problemas de conexión con el servidor ',
            );
          }
        }, 1500);
      })
      .catch((error) => {
        setTimeout(() => {
          this.extras.loading.dismiss();
          this.extras.presentToast('❌ Problemas de conexión con el servidor ');
        }, 1500);
      });
  }
}
