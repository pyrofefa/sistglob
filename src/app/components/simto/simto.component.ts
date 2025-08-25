import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CalculateDistancePipe } from 'src/app/pipes/calculate-distance.pipe';
import { AssetsService } from 'src/app/services/assests.service';
import { FenologiasService } from 'src/app/services/fenologias.service';
import { SimtoService } from 'src/app/services/simto.service';
import { TrampasService } from 'src/app/services/trampas.service';
import { registerPlugin } from '@capacitor/core';
import { GPSSiafesonPlugin } from 'src/app/interfaces/gpssiafeson-plugin';
import { buildCapturaSimto } from 'src/app/helpers/buildCapturaSimto';
import { SimtoDetalleService } from 'src/app/services/simto-detalle.service';
import { DetallePage } from 'src/app/pages/detalle/detalle.page';

const GPSSiafeson = registerPlugin<GPSSiafesonPlugin>('GPSSiafeson');
import * as Sentry from '@sentry/capacitor';

@Component({
  selector: 'app-simto',
  templateUrl: './simto.component.html',
  styleUrls: ['./simto.component.scss'],
  standalone: false,
})
export class SimtoComponent implements OnInit {
  @Input() name: any;
  @Input() id: any;
  @Input() campana: any;

  /**Dias */
  fecha = moment().format('YYYY-MM-DD');
  fechaHora = moment().format('YYYY-MM-DD H:mm:ss');
  ano = moment().format('YYYY');
  semana = moment(this.fecha).week();
  today = Date.now();
  fechaHoraSatelite: any;
  fechaGPS: any;

  /**Posicion */
  latitud?: number;
  longitud?: number;
  presicion?: number;
  campo: any = [];

  captura: any = {
    id: null,
    trampa_id: null,
    fenologia: null,
    captura: 0,
    totalTrampas: 0,
    totalInsectos: 0,
  };
  status: any;

  fenologias: any;

  latitud_campo: number = 0;
  longitud_campo: number = 0;
  distancia_qr: number = 0;
  orientacion: string = '';
  id_bd_cel: number = 0;
  id_bd_cel_detalle: number = 0;
  siembra_id: number = 0;

  user_id: any;
  personal_id: any;
  junta_id: any;

  id_bd_cel_simto: number = 0;
  totalInsectos: number = 0;
  totalTrampas: number = 0;
  compareWith: any;
  interval: any;
  version: any;
  horaValida: boolean = true;
  bloquearCaptura: boolean = true;
  message: string = '';

  private listener: { remove: () => Promise<void> } | null = null;

  constructor(
    public alertController: AlertController,
    private modal: ModalController,
    private route: ActivatedRoute,
    private back: Router,
    public trampa: TrampasService,
    public extras: AssetsService,
    public capturas: SimtoService,
    public detalle: SimtoDetalleService,
    public fenologia: FenologiasService,
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

  async getVersion() {
    try {
      const info = await App.getInfo();
      this.version = info.version;
    } catch (error) {
      console.error('Error obteniendo versión', error);
      this.version = 'Desconocida';
    }
  }

  startTimeUpdater() {
    this.interval = setInterval(() => {
      this.fechaHora = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
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

  async idBdCelDetalle() {
    try {
      const lastSeq = await this.detalle.sqliteSequence();
      this.id_bd_cel_detalle = lastSeq + 1;
    } catch (error) {
      console.error('Error obteniendo id_bd_cel_detalle:', error);
      this.id_bd_cel_detalle = Date.now(); // fallback único si falla
    }
  }
  actualizar() {
    this.startGPSWatch();
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
            console.log('capturas: ', res);
            if (res[0].id != null) {
              for (let result of res) {
                this.captura.fenologia = result.fenologia;
                this.captura.totalTrampas = result.punto;
                this.captura.totalInsectos = result.total;
                this.captura.id = result.id;
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
          this.getFenologias();
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
  getFenologias() {
    this.fenologia
      .getFenologias(this.campana)
      .then((res) => {
        this.fenologias = res;
        this.compareWith = this.compareWithFn;
      })
      .catch((error) => {
        alert(error);
      });
  }

  async ver() {
    const modal = await this.modal.create({
      component: DetallePage,
      componentProps: {
        id: this.captura.id,
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((res) => {
      this.capturas
        .capturaId(this.id, this.fecha)
        .then((res) => {
          if (res != null) {
            for (let result of res) {
              this.captura.fenologia = result.fenologia;
              this.captura.totalTrampas = result.punto;
              this.captura.totalInsectos = result.total;
              this.captura.id = result.id;
              this.status = result.status;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  agregar() {
    if (this.presicion === undefined) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('No se encontró posición');
      }, 1500);
    } else if (this.presicion > 16) {
      setTimeout(() => {
        this.extras.presentToast(
          'La precisión debe de ser menor a 16 para poder guardar el registro',
        );
      }, 1500);
    } else if (this.latitud == null) {
      setTimeout(() => {
        this.extras.presentToast('No se encontró posición');
      }, 1500);
    } else if (this.longitud == null) {
      setTimeout(() => {
        this.extras.presentToast('No se encontró posición');
      }, 1500);
    } else if (this.presicion == null) {
      setTimeout(() => {
        this.extras.presentToast('No se encontró posición');
      }, 1500);
    } else if (this.captura.id == null) {
      this.idBdCel();
      this.captura.totalTrampas = this.captura.totalTrampas + 1;
      this.captura.totalInsectos =
        this.captura.totalInsectos + this.captura.captura;

      const capturaData = buildCapturaSimto(
        this.captura,
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
        this.siembra_id,
      );

      this.capturas
        .insert(capturaData)
        .then((res) => {
          if (res == 0) {
            setTimeout(() => {
              this.extras.presentToast('No se pudo guardar');
            }, 1500);
          } else {
            this.captura.id = res;
            this.idBdCelDetalle();
            this.detalle
              .agregar(
                this.captura.id,
                this.captura.totalTrampas,
                this.captura.captura,
                this.longitud,
                this.latitud,
                this.presicion,
                this.distancia_qr,
                this.id_bd_cel_detalle,
              )
              .then((res) => {
                if (res == true) {
                  this.captura.captura = 0;
                }
              });
          }
        })
        .catch((error) => {});
    } else {
      this.captura.totalTrampas = this.captura.totalTrampas + 1;
      this.captura.totalInsectos =
        this.captura.totalInsectos + this.captura.captura;
      this.idBdCelDetalle();
      this.detalle
        .agregar(
          this.captura.id,
          this.captura.totalTrampas,
          this.captura.captura,
          this.longitud,
          this.latitud,
          this.presicion,
          this.distancia_qr,
          this.id_bd_cel_detalle,
        )
        .then((res) => {
          if (res == true) {
            this.captura.captura = 0;
          }
        });
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
    }else {
      this.guardarRegistro()
    }
  }

  async guardarRegistro() {
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
      const capturaData = buildCapturaSimto(
        this.captura,
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
        this.siembra_id,
      );
      const result = await this.capturas.update(capturaData);

      let mensaje = '⚠️ Registro guardado localmente';
      if (result && typeof result === 'object' && result.status === 'success') {
        mensaje = '✅ Registro guardado localmente y en línea';
      } else if (result.status === 'warning') {
        mensaje = '⚠️ ' + result.message + '. Registro guardado localmente';
      } else if (result.status === 'error') {
        mensaje = '⚠️ Registro guardado localmente';
      }
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast(mensaje);
        this.back.navigate(['/ubicaciones', this.campana, this.name]);
      }, 500);
    } catch (error) {
      console.error('Error en guardarRegistro:', error);
      this.extras.presentToast('❌ Error guardando el registro');
    } finally {
      this.extras.loading.dismiss();
    }
  }
}
