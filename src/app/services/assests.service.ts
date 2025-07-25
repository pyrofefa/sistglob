import { Injectable } from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  toast: any;
  loading: any;

  constructor(
    public toastCtr: ToastController,
    public loadingController: LoadingController,
    public alert: AlertController,
  ) {}

  /**Mensajes de guardado  */
  async presentToast(text: string) {
    this.toast = await this.toastCtr.create({
      message: text,
      duration: 2000,
      position: 'middle',
      cssClass: 'customToastClass',
    });
    return this.toast.present();
  }
  /**Mensajes de cargando */
  async cargandoMessage(text: string) {
    this.loading = await this.loadingController.create({
      message: text,
      duration: 120000,
    });
    return this.loading.present();
  }
  async dismiss() {
    return this.loading.dismiss();
  }

  async presentAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }
}
