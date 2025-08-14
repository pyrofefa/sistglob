import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assests.service';
import { SimdiaService } from 'src/app/services/simdia.service';
import { SimepService } from 'src/app/services/simep.service';
import { SimgbnService } from 'src/app/services/simgbn.service';
import { SimmoscasService } from 'src/app/services/simmoscas.service';
import { SimpicudoService } from 'src/app/services/simpicudo.service';
import { SimppService } from 'src/app/services/simpp.service';
import { SimtoService } from 'src/app/services/simto.service';
import { SimtrampeoService } from 'src/app/services/simtrampeo.service';

@Component({
  selector: 'app-subir',
  templateUrl: './subir.page.html',
  styleUrls: ['./subir.page.scss'],
  standalone: false,
})
export class SubirPage implements OnInit {
  /**Simep */
  simepCounts: number = 0;
  subirSimep: any = [];
  /**Simgbn */
  simgbnCounts: number = 0;
  subirSimgbn: any = [];
  /**Simdia */
  simdiaCounts: number = 0;
  subirSimdia: any = [];
  /**Simmosca */
  simmoscaCounts: number = 0;
  subirSimmosca: any = [];
  /**Simpp */
  simppCounts: number = 0;
  subirSimpp: any = [];
  /**Simtrampeo */
  simtrampeoCounts: number = 0;
  subirSimtrampeo: any = [];
  /**Simto */
  simtoCounts: number = 0;
  subirSimto: any = [];
  /**simpicudo */
  simpicudoCounts: number = 0;
  subirSimpicudo: any = [];

  constructor(
    public simpicudo: SimpicudoService,
    public simto: SimtoService,
    public simtrampeo: SimtrampeoService,
    public simmosca: SimmoscasService,
    public simdia: SimdiaService,
    public simpp: SimppService,
    public simep: SimepService,
    public simgbn: SimgbnService,
    public extras: AssetsService,
  ) {}
  ngOnInit() {
    this.simdiaCount();
    this.simppCount();
    this.simgbnCount();
    this.simepCount();
    this.simmoscaCount();
    this.simtrampeoCount();
    this.simtoCount();
    this.simpicudoCount();
  }
  simpicudoCount() {
    this.simpicudo
      .conteo()
      .then((res) => {
        this.subirSimpicudo = res;
        this.simpicudoCounts = this.subirSimpicudo.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simtoCount() {
    this.simto
      .conteo()
      .then((res) => {
        this.subirSimto = res;
        this.simtoCounts = this.subirSimto.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simtrampeoCount() {
    this.simtrampeo
      .conteo()
      .then((res) => {
        this.subirSimtrampeo = res;
        this.simtrampeoCounts = this.subirSimtrampeo.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simmoscaCount() {
    this.simmosca
      .conteo()
      .then((res) => {
        this.subirSimmosca = res;
        this.simmoscaCounts = this.subirSimmosca.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simepCount() {
    this.simep
      .conteo()
      .then((res) => {
        this.subirSimep = res;
        this.simepCounts = this.subirSimep.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simgbnCount() {
    this.simgbn
      .conteo()
      .then((res) => {
        this.subirSimgbn = res;
        this.simgbnCounts = this.subirSimgbn.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simdiaCount() {
    this.simdia
      .conteo()
      .then((res) => {
        this.subirSimdia = res;
        this.simdiaCounts = this.subirSimdia.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  simppCount() {
    this.simpp
      .conteo()
      .then((res) => {
        this.subirSimpp = res;
        this.simppCounts = this.subirSimpp.length;
      })
      .catch((error) => {
        alert(error);
      });
  }
  async subirRegistros<T>(
    nombre: string,
    servicio: {
      update: () => Promise<any>;
      get: () => Promise<T[]>;
    },
    setData: (data: T[]) => void,
    setCount: (count: number) => void,
  ) {
    this.extras.cargandoMessage(`Subiendo registros de ${nombre}`);
    try {
      const res = await servicio.update();

      setTimeout(async () => {
        this.extras.loading.dismiss();

        if (res.status === 'success') {
          this.extras.presentToast('⚠️ '+res.message);
        } else if (res.status === 'warning') {
          this.extras.presentToast('⚠️ '+res.message);
        } else {
          this.extras.presentToast(
            `Ocurrió un error al subir los registros de ${nombre}`,
          );
          alert('Problemas de conexión con el servidor');
          return;
        }

        try {
          const data = await servicio.get();
          setData(data);
          setCount(data.length);
        } catch (error) {
          alert('Error al obtener registros después de subir: ' + error);
        }
      }, 1500);
    } catch (error) {
      alert('Error! ' + error);
    }
  }

  simdiaSubir() {
    this.subirRegistros(
      'simdia',
      {
        update: () => this.simdia.subir(),
        get: () => this.simdia.conteo(),
      },
      (data) => (this.subirSimdia = data),
      (count) => (this.simdiaCounts = count),
    );
  }

  simppSubir() {
    this.subirRegistros(
      'simpp',
      {
        update: () => this.simpp.subir(),
        get: () => this.simpp.conteo(),
      },
      (data) => (this.subirSimpp = data),
      (count) => (this.simppCounts = count),
    );
  }

  simepSubir() {
    this.subirRegistros(
      'simep',
      {
        update: () => this.simep.subir(),
        get: () => this.simep.conteo(),
      },
      (data) => (this.subirSimep = data),
      (count) => (this.simepCounts = count),
    );
  }

  simgbnSubir() {
    this.subirRegistros(
      'simgbn',
      {
        update: () => this.simgbn.subir(),
        get: () => this.simgbn.conteo(),
      },
      (data) => (this.subirSimgbn = data),
      (count) => (this.simgbnCounts = count),
    );
  }

  simmoscaSubir() {
    this.subirRegistros(
      'simmosca',
      {
        update: () => this.simmosca.subir(),
        get: () => this.simmosca.conteo(),
      },
      (data) => (this.subirSimmosca = data),
      (count) => (this.simmoscaCounts = count),
    );
  }

  simtrampeoSubir() {
    this.subirRegistros(
      'simtrampeo',
      {
        update: () => this.simtrampeo.subir(),
        get: () => this.simtrampeo.conteo(),
      },
      (data) => (this.subirSimtrampeo = data),
      (count) => (this.simtrampeoCounts = count),
    );
  }

  simtoSubir() {
    this.subirRegistros(
      'simto',
      {
        update: () => this.simto.subir(),
        get: () => this.simto.conteo(),
      },
      (data) => (this.subirSimto = data),
      (count) => (this.simtoCounts = count),
    );
  }

  simpicudoSubir() {
    this.subirRegistros(
      'simpicudo',
      {
        update: () => this.simpicudo.subir(),
        get: () => this.simpicudo.conteo(),
      },
      (data) => (this.subirSimpicudo = data),
      (count) => (this.simpicudoCounts = count),
    );
  }
}
