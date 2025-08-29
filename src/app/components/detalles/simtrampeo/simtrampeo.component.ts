import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AssetsService } from 'src/app/services/assests.service';
import { SimtrampeoService } from 'src/app/services/simtrampeo.service';

@Component({
  selector: 'app-simtrampeo',
  templateUrl: './simtrampeo.component.html',
  styleUrls: ['./simtrampeo.component.scss'],
  standalone: false,
})
export class SimtrampeoComponent implements OnInit {
  id: any = null;
  devid: any;
  capturas: any = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public extras: AssetsService,
    public captura: SimtrampeoService,
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

  async presentActionSheet(id: any, status: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentAlert(id);
          },
        },
        {
          text: 'Reenviar',
          icon: 'share',
          handler: () => {
            if (status != 3) {
              this.reenviar(id);
            } else {
              this.extras.presentToast(
                'Tienes pendiente este registro. No puedes reenviarlo',
              );
            }
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentAlert(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar',
      subHeader: '¿Estás seguro que quieres eliminar?',
      message: 'Atención: Esta acción eliminará todo el registro',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('No');
          },
        },
        {
          text: 'Si',
          handler: () => {
            this.captura
              .delete(id)
              .then((res) => {
                if (res == true) {
                  this.captura.capturas$.emit(
                    'Captura eliminada correctamente',
                  );
                  this.extras.presentToast('Registro eliminado');
                  this.back.navigate(['/revisar/simtrampeo']);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
