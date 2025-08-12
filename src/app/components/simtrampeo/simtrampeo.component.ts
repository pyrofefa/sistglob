import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { registerPlugin } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { GPSSiafesonPlugin } from 'src/app/interfaces/gpssiafeson-plugin';
import * as moment from 'moment';
import { CalculateDistancePipe } from 'src/app/pipes/calculate-distance.pipe';
import { AssetsService } from 'src/app/services/assests.service';
import { SimtrampeoService } from 'src/app/services/simtrampeo.service';
import { TrampasService } from 'src/app/services/trampas.service';
import { buildCapturaSimtrampeo } from 'src/app/helpers/buildCapturaSimtrampeo';
import { AccionesService } from 'src/app/services/acciones.service';

const GPSSiafeson = registerPlugin<GPSSiafesonPlugin>('GPSSiafeson');

@Component({
  selector: 'app-simtrampeo',
  templateUrl: './simtrampeo.component.html',
  styleUrls: ['./simtrampeo.component.scss'],
  standalone: false,
})
export class SimtrampeoComponent implements OnInit {
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

  /**Posicion */
  latitud?: number;
  longitud?: number;
  presicion?: number;
  campo: any = [];

  /**Capturas */
  captura: any = {
    id: null,
    trampa_id: null,
    captura: 0,
    latitud_ins: null,
    longitud_ins: null,
    latitud_rev: 1,
    longitud_rev: null,
    fecha_instalacion: null,
    feromona: null,
    accion: 1,
  };
  status: any;

  latitud_campo: number = 0;
  longitud_campo: number = 0;
  distancia_qr: number = 0;
  orientacion: string = '';
  id_bd_cel: number = 0;
  siembra_id: number = 0;

  user_id: any;
  personal_id: any;
  junta_id: any;

  fecha_instalacion: any;

  dias: any = 0;
  interval: any;
  version: any;

  acciones: any;

  plaga: any;
  plagaId?: number;
  instalacion: any;
  nombre: any;
  titulo: any;

  compareWithAccion: any;

  private listener: { remove: () => Promise<void> } | null = null;
  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private back: Router,
    public trampa: TrampasService,
    public extras: AssetsService,
    public capturas: SimtrampeoService,
    private zone: NgZone,
    private distance: CalculateDistancePipe,
    private accion: AccionesService,
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
          this.fechaHoraSatelite = gpsMoment.format('YYYY-MM-DD HH:mm:ss');
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
          this.capturas
            .capturaId(this.id)
            .then((res) => {
              if (res.length > 0 && res[0].id != null) {
                for (let result of res) {
                  this.captura.id = result.id;
                  this.status = result.status;
                  this.captura.fecha_instalacion = result.fecha_instalacion;
                  this.dias = moment(this.fecha).diff(
                    moment(result.fecha_instalacion),
                    'days',
                  );
                }
                if (this.dias > 10) {
                  this.status = 4;
                }
              } else {
                this.capturas
                  .capturaIdFinal(this.id, this.fecha)
                  .then((res) => {
                    if (res != null && res.length > 0) {
                      for (let result of res) {
                        if(result.status == 5){
                          this.status = 4
                        } else {
                          this.status = result.status;
                        }
                        this.captura.id = result.id;
                        this.captura.fecha_instalacion = result.fecha_instalacion;
                        this.captura.captura = result.captura;
                      }
                    } else {
                      this.status = 4;
                    }
                  })
                  .catch((error: any) => {
                    alert(error);
                  });
              }
            })
            .catch((error: any) => {
              console.log('error: ', error);
            });
          this.campo = res;
          for (let result of this.campo) {
            this.siembra_id = result.id_sicafi;
            this.longitud_campo = result.longitud;
            this.latitud_campo = result.latitud;
            this.plaga = result.campo;
            this.plagaId = result.productor;
            this.nombre = result.name;
            this.instalacion = result.variedad_id;

            switch (result.productor) {
              case '1':
                this.titulo = 'Capturas'; //Palomilla dorso diamante
                break;
              case '2':
                this.titulo = 'Adultos/Pulg2'; //Mosquita Blanca
                break;
              case '3':
                this.titulo = 'Capturas'; //Paratrioza
                break;
              case '4':
                this.titulo = 'Capturas/Trampa/Noche'; //Palomilla de la papa
                break;
              case '5':
                this.titulo = 'Adultos/Pulg2'; //Picudo Chile
                break;
              default:
                this.titulo = '';
                break;
            }
          }
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

  async save(instalacion: number) {
    this.extras.cargandoMessage('Guardando');
    // 📌 Validaciones iniciales
    if (this.presicion == null || this.presicion > 16) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('La precisión debe de ser menor a 16 para poder guardar el registro');
      }, 1500);
    }
    else if (this.latitud == null || this.longitud == null) {
      setTimeout(() => {
        this.extras.loading.dismiss();
        this.extras.presentToast('No se encontró una posición válida');
      }, 1500);
    }
    else {
      // 📌 Lógica principal
      if (instalacion === 1) {
        await this.handleInstalacion();
      } else if (instalacion === 0) {
        await this.handleNoInstalacion();
      }
    }
  }

  // 🧩 Maneja cuando instalacion = 1
  private async handleInstalacion() {
    this.captura.latitud_ins = this.latitud;
    this.captura.longitud_ins = this.longitud;
    this.captura.latitud_rev = this.latitud;
    this.captura.longitud_rev = this.longitud;
    this.captura.fecha_instalacion = this.fecha;

    const isVencido = this.dias > 10;

    // Cuando status = 4, 1 o 2
    if ([1, 2, 4].includes(this.status)) {
      const result = isVencido
        ? await this.capturas.updateInstalacion(this.getParams())
        : await this.capturas.instalacion(this.getParams());

      return this.finalizarGuardar(result);
    }

    // Cuando status = 3
    if (this.status === 3) {
      const result = await this.capturas.update(this.getParams());
      return this.finalizarGuardar(result);
    }
  }

  // 🧩 Maneja cuando instalacion = 0
  private async handleNoInstalacion() {
    this.captura.latitud_ins = this.latitud;
    this.captura.longitud_ins = this.longitud;
    this.captura.latitud_rev = this.latitud;
    this.captura.longitud_rev = this.longitud;
    this.captura.fecha_instalacion = this.fecha;

    if (this.status === 2) {
      await this.extras.loading.dismiss();

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Ya has hecho este registro anteriormente',
        message: '¿Estás seguro que deseas sobrescribir?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Si',
            handler: async () => {
              this.extras.cargandoMessage('Guardando');
              const result = await this.capturas.update(this.getParams());
              this.finalizarGuardar(result);
            },
          },
        ],
      });

      await alert.present();
    } else {
      let result = await this.capturas.insert(this.getParams());
      this.finalizarGuardar(result);
    }
  }

  // 🧩 Función común para cerrar el guardado
  private finalizarGuardar(result: any) {
    setTimeout(() => {
      this.extras.loading.dismiss();
      this.back.navigate(['/home']);
      const mensaje =
        result?.status === 'success' || result?.status === 'warning'
          ? result.message
          : 'Registro guardado localmente';
      this.extras.presentToast(mensaje);
    }, 1500);
  }

  // 🧩 Parametros comunes
  private getParams() {
    const result = this.distance.transform(
      null,
      this.latitud ?? 0.0,
      this.longitud ?? 0.0,
      this.latitud_campo,
      this.longitud_campo,
    );
    this.distancia_qr = result.distancia;
    this.orientacion = result.orientacion;

    const capturaData = buildCapturaSimtrampeo(
      this.captura,
      this.junta_id,
      this.personal_id,
      this.user_id,
      this.presicion ?? 0.0,
      this.fecha,
      this.fechaHoraSatelite,
      this.ano,
      this.semana,
      this.distancia_qr,
      this.id_bd_cel,
      this.version,
      this.siembra_id,
      this.instalacion,
      this.status,
    );
    return capturaData;
  }

  compareWithFnAcciones(a: any, b: any): boolean {
    return a === b;
  }
  getAcciones() {
    this.accion
      .getAcciones(this.campana)
      .then((res) => {
        this.acciones = res;
        // Si estamos en instalación == 1, filtramos para quitar el id 2 (instalacion)
        if (this.instalacion == 1) {
          this.acciones = this.acciones.filter(
            (accion: any) => accion.id !== 2,
          );
        }
        this.compareWithAccion = this.compareWithFnAcciones;
      })
      .catch((error) => {
        alert(error);
      });
  }
  seleccionar() {
    if (this.captura.accion == 3) {
      this.captura.captura = 0;
      this.captura.instalada = 1;
    } else {
      this.captura.observacion = null;
      this.captura.instalada = 0;
    }
  }
}
