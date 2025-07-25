import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrampasService } from 'src/app/services/trampas.service';
import { TablasService } from 'src/app/services/tablas.service';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

import { registerPlugin } from '@capacitor/core';
import { AssetsService } from 'src/app/services/assests.service';
import { GPSSiafesonPlugin } from 'src/app/interfaces/gpssiafeson-plugin';

const GPSSiafeson = registerPlugin<GPSSiafesonPlugin>('GPSSiafeson');

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: ['./ubicaciones.page.scss'],
  standalone: false,
})
export class UbicacionesPage implements OnInit, OnDestroy {
  @Input() name: any;
  @Input() id!: any;

  latitud?: number;
  longitud?: number;
  presicion?: number;
  trampasCount: string = '';
  trampas: any[] = [];
  results: any[] = [];
  imei: any = '';
  total: number = 0;
  conteo: number = 0;
  title: string = '';
  distancia: number = 0;
  ubicaciones: string = '';
  watchId: string = '';
  bearing: string = '';

  fechaHora: any = moment().format('YYYY-MM-DD HH:mm:ss');
  fechaGPS: any;
  interval: any;

  horaValida: boolean = true;

  constructor(
    public extras: AssetsService,
    private route: ActivatedRoute,
    public nav: Router,
    public trampa: TrampasService,
    private tabla: TablasService,
    private zone: NgZone,
  ) {}

  gpsData: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null = null;
  errorMessage: string | null = null;
  private listener: { remove: () => Promise<void> } | null = null;

  async ngOnInit() {
    this.route.paramMap.subscribe((res) => {
      this.name = res.get('name');
      this.id = res.get('id');
      this.distancia = 200;
    });

    this.tabla.nombre$.subscribe((texto) => {
      this.getTrampas();
    });

    try {
      const permissions = await GPSSiafeson.requestPermissions();
      console.log('Permisos:', permissions);

      if (permissions.location === 'granted') {
        await this.startGPSWatch();
      } else {
        this.errorMessage = 'Permisos de ubicación no concedidos';
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      this.errorMessage = 'Error al acceder al GPS';
    }

    this.interval = setInterval(() => {
      this.fechaHora = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
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

          if (data.isMock) {
            alert('❗Ubicación simulada detectada.');
          } else if (data.isJumpDetected || data.isSpeedUnrealistic) {
            alert('⚠️ Ubicación sospechosa: salto o velocidad irreal.');
          }

          this.fechaGPS = gpsMoment.format('YYYY-MM-DD HH:mm:ss');
          this.fechaHora = sistemaMoment.format('YYYY-MM-DD HH:mm:ss');

          if (diferenciaSegundos > 5) {
            // tolerancia de 5 segundos
            this.horaValida = false;
            this.extras.presentToast(
              '⚠️ La hora del sistema no coincide con la del GPS. Verifica la configuración del dispositivo.',
            );
          } else {
            this.horaValida = true;
          }
          this.getTrampas();
        });
      });
    } catch (error) {
      console.error('Error al iniciar GPS:', error);
    }
  }

  async ngOnDestroy() {
    try {
      clearInterval(this.interval);
      if (this.listener) {
        await this.listener.remove(); // Ahora es una Promise
        this.listener = null;
      }
      await GPSSiafeson.stopWatch();
      console.log('Watch detenido correctamente');
    } catch (error) {
      console.error('Error al limpiar:', error);
    }
  }
  getTrampas() {
    this.trampa
      .getTrampas(this.id)
      .then((res) => {
        this.trampas = res.map((trampa) => ({
          ...trampa,
          distancia: 0,
        }));

        setTimeout(() => {
          this.conteo = this.trampas.length;
        }, 2500);
      })
      .catch((error) => {
        this.extras.presentToast(JSON.stringify(error));
      });
  }

  captura(ubicacion:any, name:any, campana:any){
    this.nav.navigate(['/capturas', ubicacion, name, campana ]);
  }

  actualizar() {
    this.startGPSWatch();
  }

  atras() {
    this.nav.navigate(['/home']);
  }
  get fechaHoraHumana(): string {
    return this.fechaHora
      ? moment(this.fechaHora).format('dddd, D [de] MMMM [de] YYYY · HH:mm')
      : '';
  }
}
