import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TablasService } from 'src/app/services/tablas.service';
import { AssetsService } from 'src/app/services/assests.service';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent implements OnInit {
  version = 'desconocida'; // O tu variable dinámica

  constructor(
    public alertController: AlertController,
    public tabla: TablasService,
    public extras: AssetsService,
  ) {}
  ngOnInit() {
    this.checkUpdates();
  }
  async tablas() {
    this.extras.cargandoMessage('Actualizando tablas');

    try {
      const tablas = await this.tabla.getServicesTablas();
      if (tablas.status !== 'success') throw new Error('fenologías');

      const observaciones = await this.tabla.getServicesObservaciones();
      if (observaciones.status !== 'success') throw new Error('observaciones');

      const brotes = await this.tabla.getServicesBrotes();
      if (brotes.status !== 'success') throw new Error('brotes');

      const recomendaciones = await this.tabla.getServicesRecomendaciones();
      if (recomendaciones.status !== 'success')
        throw new Error('recomendaciones');

      const acciones = await this.tabla.getServicesAcciones();
      if (acciones.status !== 'success') throw new Error('acciones');

      const omisiones = await this.tabla.getServicesOmisiones();
      if (omisiones.status !== 'success') throw new Error('omisiones');

      this.tabla.nombre$.emit('Tablas actualizadas correctamente');
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('Tablas actualizadas correctamente.');
      }, 1500);
    } catch (err: any) {
      console.error('Error al sincronizar tablas:', err);
      setTimeout(() => {
        this.extras.dismiss();
        this.extras.presentToast(
          `Error al sincronizar ${err?.message || 'las tablas'}. Verifica tu conexión.`,
        );
      }, 1500);
    }
  }

  async ubicacionesUpdate() {
    this.extras.cargandoMessage('Actualizando ubicaciones');
    try {
      const personalRes = await Preferences.get({
        key: 'personal-token-sistglob',
      });
      const juntaRes = await Preferences.get({ key: 'junta-token-sistglob' });

      const personalToken = personalRes.value;
      const juntaToken = juntaRes.value;

      if (!personalToken || !juntaToken) {
        throw new Error('Tokens no encontrados');
      }

      const res = await this.tabla.getServiceUbicaciones(
        personalToken,
        juntaToken,
      );
      if (res.status !== 'success') throw new Error('ubicaciones');

      this.tabla.nombre$.emit('Ubicaciones actualizadas correctamente');
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast(res.message);
      }, 1500);
    } catch (err: any) {
      console.error('Error al actualizar ubicaciones:', err);
      setTimeout(() => {
        this.extras.dismiss();
        this.extras.presentToast(
          `Error al actualizar las ubicaciones. ${err?.message || 'Verifica tu conexión.'}`,
        );
      }, 1500);
    }
  }

  salir() {
    App.exitApp();
  }

  private errorUpdateMessage() {
    setTimeout(() => {
      this.extras.dismiss();
      this.extras.presentToast(
        'Ocurrió un error al actualizar. Por favor revise su conexión a internet.',
      );
    }, 1500);
  }
  async checkUpdates() {
    try {
      const info = await App.getInfo();
      this.version = info.version;
      console.log(this.version);
    } catch (error) {
      console.error('Error obteniendo versión', error);
      this.version = 'Desconocida';
    }
  }
}
