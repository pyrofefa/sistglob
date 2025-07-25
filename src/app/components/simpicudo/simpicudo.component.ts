import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { AccionesService } from 'src/app/services/acciones.service';
import { AssetsService } from 'src/app/services/assests.service';
import { FenologiasService } from 'src/app/services/fenologias.service';
import { SimpicudoService } from 'src/app/services/simpicudo.service';
import { TrampasService } from 'src/app/services/trampas.service';
import { registerPlugin } from '@capacitor/core';
import { GPSSiafesonPlugin } from 'src/app/interfaces/gpssiafeson-plugin';

import { buildCapturaSimpicudo } from '../../helpers/buildCapturaSimpicudo';
import { CalculateDistancePipe } from 'src/app/pipes/calculate-distance.pipe';

const GPSSiafeson = registerPlugin<GPSSiafesonPlugin>('GPSSiafeson');

@Component({
  selector: 'app-simpicudo',
  templateUrl: './simpicudo.component.html',
  styleUrls: ['./simpicudo.component.scss'],
  standalone: false,
})
export class SimpicudoComponent implements OnInit {
  @Input() name: any;
  @Input() id: any;
  @Input() campana: any;

  /**Dias */
  fecha = moment().format('YYYY-MM-DD');
  fechaHora = moment().format('YYYY-MM-DD H:mm:ss');
  ano = moment().format('YYYY');
  semana = moment(this.fecha).week();
  today = Date.now();

  /**Posicion */
  latitud?: number;
  longitud?: number;
  presicion?: number;
  campo: any = [];

  captura: any = {
    id: null,
    captura: 0,
    fenologia: null,
    infestacion: 0,
    trampa_id: null,
    accion: 1,
    feromona: null,
  };
  status: any;

  fenologias: any;
  acciones: any;

  latitud_campo: number = 0;
  longitud_campo: number = 0;
  distancia_qr: number = 0;
  orientacion: string = '';
  id_bd_cel: number = 0;
  siembra_id: number = 0;

  user_id: any;
  personal_id: any;
  junta_id: any;

  compareWith: any;
  compareWithAccion: any;
  interval: any;
  version: any;

  private listener: { remove: () => Promise<void> } | null = null;

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private back: Router,
    public trampa: TrampasService,
    public extras: AssetsService,
    public capturas: SimpicudoService,
    public fenologia: FenologiasService,
    public accion: AccionesService,
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
          this.fechaHora = sistemaMoment.format('YYYY-MM-DD HH:mm:ss');
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
            'No se encontró la ubicación intente nuevamente.',
          );
        } else {
          this.capturas.capturaId(this.id, this.fecha).then((res) => {
            console.log('capturas: ', res);
            if (res[0].id != null) {
              for (let result of res) {
                this.captura.id = result.id;
                this.captura.captura = result.captura;
                this.captura.fenologia = result.fenologia;
                this.captura.feromona = result.feromona;
                this.captura.accion = result.accion;
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
          this.getAcciones();
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

  compareWithFnAcciones(a: any, b: any): boolean {
    return a === b;
  }
  getAcciones() {
    this.accion
      .getAcciones(5)
      .then((res) => {
        this.acciones = res;
        this.compareWithAccion = this.compareWithFnAcciones;
      })
      .catch((error) => {
        alert(error);
      });
  }
  async save() {
    if (
      !this.presicion ||
      this.presicion > 16 ||
      !this.latitud ||
      !this.longitud
    ) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('No se encontró una posición válida');
      }, 1500);
      return;
    }

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
      const capturaData = buildCapturaSimpicudo(
        this.captura,
        this.junta_id,
        this.personal_id,
        this.user_id,
        this.longitud ?? 0.0,
        this.latitud ?? 0.0,
        this.presicion ?? 0.0,
        this.fecha,
        this.fechaHora,
        this.ano,
        this.semana,
        this.distancia_qr,
        this.id_bd_cel,
        this.version,
        this.siembra_id,
      );

      const result = isUpdate
        ? await this.capturas.update(capturaData)
        : await this.capturas.insert(capturaData);

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
