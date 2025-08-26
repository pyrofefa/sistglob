import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { buildCapturaSimep } from '../../helpers/buildCapturaSimep';
import { AssetsService } from 'src/app/services/assests.service';
import { RecomendacionesService } from 'src/app/services/recomendaciones.service';
import { SimepService } from 'src/app/services/simep.service';
import { TrampasService } from 'src/app/services/trampas.service';
import { App } from '@capacitor/app';
import { CalculateDistancePipe } from 'src/app/pipes/calculate-distance.pipe';
import { GPSSiafeson } from 'src/app/plugins/gpssiafeson';
import * as Sentry from '@sentry/capacitor';

@Component({
  selector: 'app-simep',
  templateUrl: './simep.component.html',
  styleUrls: ['./simep.component.scss'],
  standalone: false,
})
export class SimepComponent implements OnInit, OnDestroy {
  @Input() name: any;
  @Input() id: any;
  @Input() campana: any;

  /**Dias */
  fecha = moment().format('YYYY-MM-DD');
  fechaHora = moment().format('YYYY-MM-DD H:mm:ss');
  fechaHoraSatelite: any;
  ano = moment().format('YYYY');
  semana = moment(this.fecha).week();
  today = Date.now();
  fechaGPS: any;

  /**Posicion */
  latitud?: number;
  longitud?: number;
  presicion?: number;
  orientacion: string = '';
  campo: any = [];

  captura: any = {
    id: null,
    captura: 0,
    recomendacion: 1,
    trampa_id: null,
    instalada: null,
  };
  recomendaciones: any;
  status: any;

  latitud_campo: number = 0;
  longitud_campo: number = 0;
  distancia_qr: number = 0;
  id_bd_cel: number = 0;
  siembra_id: number = 0;

  user_id: any;
  personal_id: any;
  junta_id: any;

  compareWith: any;
  interval: any;
  version: any;

  horaValida: boolean = true;
  bloquearCaptura: boolean = true;
  message: string = '';

  private listener: { remove: () => Promise<void> } | null = null;

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private back: Router,
    public extras: AssetsService,
    public trampa: TrampasService,
    public recomendacion: RecomendacionesService,
    public capturas: SimepService,
    private zone: NgZone,
    private distance: CalculateDistancePipe,
  ) {}

  async ngOnInit() {
    await this.loadUserPreferences();
    this.getRouteParams();
    this.startGPSWatch();
    this.startTimeUpdater();
    this.getVersion();
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  async loadUserPreferences() {
    const userRes = await Preferences.get({ key: 'auth-token-sistglob' });
    this.user_id = userRes.value;

    const juntaRes = await Preferences.get({ key: 'junta-token-sistglob' });
    this.junta_id = juntaRes.value;

    const personalRes = await Preferences.get({
      key: 'personal-token-sistglob',
    });
    this.personal_id = personalRes.value;
  }
  getRouteParams() {
    this.route.paramMap.subscribe((res) => {
      this.name = res.get('name');
      this.id = res.get('ubicacion');
      this.campana = res.get('campana');
      this.captura.trampa_id = this.id;
      this.cargar();
    });
  }
  startTimeUpdater() {
    this.interval = setInterval(() => {
      this.fechaHora = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  }
  cargar() {
    this.trampa
      .getTrampaid(this.campana, this.id)
      .then((res) => {
        if (res == null) {
          this.extras.loading.dismiss();
          this.back.navigate(['/ubicaciones/1']);
          this.extras.presentToast(
            '❌  No se encontró la ubicación intente nuevamente.',
          );
        } else {
          this.capturas.capturaId(this.id, this.fecha).then((res) => {
            if (Array.isArray(res) && res.length > 0 && res[0] && res[0].id != null) {
              for (let result of res) {
                this.captura.id = result.id;
                this.captura.captura = result.captura;
                this.captura.instalada = result.instalada;
                this.captura.recomendacion = result.recomendacion;
                this.status = result.status;
              }
            }
          });
          this.campo = res;
          for (let result of this.campo) {
            this.siembra_id = result.id_sicafi;
            this.latitud_campo = result.latitud;
            this.longitud_campo = result.longitud;
          }
          this.getRecomendaciones();
          this.idBdCel();
        }
      })
      .catch((error) => {
        setTimeout(() => {
          this.extras.presentToast(JSON.stringify(error));
        }, 1500);
      });
  }
  compareWithFn(a: any, b: any): boolean {
    return a === b;
  }
  getRecomendaciones() {
    this.recomendacion
      .getRecomendaciones(this.campana)
      .then((res) => {
        this.recomendaciones = res;
        this.compareWith = this.compareWithFn;
      })
      .catch((error) => {
        alert(error);
      });
  }
  async idBdCel() {
    try {
      const lastSeq = await this.capturas.sqliteSequence();
      this.id_bd_cel = lastSeq + 1;
    } catch (error) {
      console.error('Error obteniendo id_bd_cel:', error);
      this.id_bd_cel = Date.now(); // fallback único si falla
    }
  }
  private async startGPSWatch() {
    try {
      await GPSSiafeson.startWatch();

      this.listener = await GPSSiafeson.addListener('gpsData', (data) => {
        this.zone.run(() => {
          this.latitud = data.latitude;
          this.longitud = data.longitude;
          this.presicion = data.accuracy;

          const gpsMoment = moment(data.timestamp);
          const sistemaMoment = moment();

          const diferenciaSegundos = Math.abs(
            sistemaMoment.diff(gpsMoment, 'seconds'),
          );

          const mismoDia = gpsMoment.isSame(sistemaMoment, 'day');

          if (data.isMock) {
            this.message = '❗ Ubicación simulada detectada.';
            this.bloquearCaptura = true;
            Sentry.captureMessage(
              `Usuario ${this.user_id} detectó ubicación simulada (mock location). Lat: ${this.latitud}, Lng: ${this.longitud}`,
              'warning'
            );
          } else if (data.isJumpDetected || data.isSpeedUnrealistic) {
            this.message = '⚠️ Ubicación sospechosa: salto o velocidad irreal.'
            this.bloquearCaptura = true;
            Sentry.captureMessage(
              `Usuario ${this.user_id} detectó ubicación sospechosa (salto o velocidad irreal). Lat: ${this.latitud}, Lng: ${this.longitud}`,
              'warning'
            );
          }

          this.fechaGPS = gpsMoment.format('YYYY-MM-DD');
          this.fecha = sistemaMoment.format('YYYY-MM-DD');
          this.fechaHoraSatelite = gpsMoment.format('YYYY-MM-DD HH:mm:ss');

          if (!mismoDia) {
            this.horaValida = false;
            this.bloquearCaptura = true;
            this.message = '⚠️ La fecha del sistema no coincide con la del GPS. Verifica la configuración del dispositivo.'
            Sentry.captureMessage(
              `Usuario ${this.user_id} cambió la fecha del dispositivo. Fecha GPS: ${this.fechaGPS}, Fecha sistema: ${this.fecha}`,
              'warning'
            );
          } else if (diferenciaSegundos > 5) {
            this.horaValida = false;
            this.bloquearCaptura = true;
            this.message = '⚠️ La hora del sistema no coincide con la del GPS. Verifica la configuración del dispositivo.'
            Sentry.captureMessage(
              `Usuario ${this.user_id} cambió la hora del dispositivo. Fecha GPS: ${this.fechaGPS}, Fecha sistema: ${this.fecha}`,
              'warning'
            );
          } else {
            this.bloquearCaptura = false;
            this.horaValida = true;
          }
        });
      });
    } catch (error) {
      console.error('Error al iniciar GPS:', error);
    }
  }
  actualizar() {
    this.startGPSWatch();
  }
  async getVersion() {
    try {
      const info = await App.getInfo();
      this.version = info.version;
    } catch (error) {
      console.error('Error obteniendo versión', error);
      this.version = 'Desconocida';
    }
  }
  async save() {
    if (this.presicion == null || this.presicion > 16) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast(
          'La precisión debe de ser menor a 16 para poder guardar el registro',
        );
      }, 1500);
    } else if (this.latitud == null || this.longitud == null) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('No se encontró una posición válida');
      }, 1500);
    } else {
      if (this.status === 2) {
        const alert = await this.alertController.create({
          header: 'Ya has hecho este registro anteriormente',
          message: '¿Estás seguro que deseas sobrescribir?',
          buttons: [
            { text: 'No', role: 'cancel', cssClass: 'secondary' },
            {
              text: 'Sí',
              handler: async () => {
                await alert.dismiss();
                this.guardarRegistro(true);
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.guardarRegistro(false);
      }
    }
  }
  async guardarRegistro(isUpdate: boolean) {
    this.extras.cargandoMessage('Guardando');

    const result = this.distance.transform(
      null,
      this.latitud ?? 0.0,
      this.longitud ?? 0.0,
      this.latitud_campo,
      this.longitud_campo,
    );
    this.distancia_qr = result.distancia;
    this.orientacion = result.orientacion;

    try {
      const capturaData = buildCapturaSimep(
        this.captura,
        this.siembra_id,
        this.junta_id,
        this.personal_id,
        this.user_id,
        this.longitud ?? 0.0,
        this.latitud ?? 0.0,
        this.presicion ?? 0.0,
        this.fecha,
        this.fechaHoraSatelite,
        this.ano,
        this.semana,
        this.distancia_qr,
        this.id_bd_cel,
        this.version,
      );

      const result = isUpdate
        ? await this.capturas.update(capturaData)
        : await this.capturas.insert(capturaData);

      let mensaje = '';
      if (result && typeof result === 'object' && result.status === 'success') {
        mensaje = '✅ '+ result.message;
      } else if (result.status === 'warning') {
        mensaje = '⚠️ ' + result.message;
      } else if (result.status === 'error') {
        mensaje = '⚠️ Registro guardado localmente';
      }
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast(mensaje);
        this.back.navigate(['/ubicaciones', this.campana, this.name]);
      }, 500);
    } catch (error) {
      this.extras.presentToast('❌ Error guardando el registro');
    } finally {
      this.extras.loading.dismiss();
    }
  }
}
