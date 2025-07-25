import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assests.service';
import { TablasService } from 'src/app/services/tablas.service';
import { TrampasService } from 'src/app/services/trampas.service';

@Component({
  selector: 'app-trampas',
  templateUrl: './trampas.page.html',
  styleUrls: ['./trampas.page.scss'],
  standalone: false,
})
export class TrampasPage implements OnInit {
  ubicaciones: any = [];
  textoBuscar = '';

  constructor(
    public ubicacion: TrampasService,
    private tabla: TablasService,
    public extras: AssetsService,
  ) {}

  ngOnInit() {
    this.getUbicaciones();
    (this.tabla.nombre$.subscribe((texto) => {
      console.log('Ubicaciones: ', texto);
      this.getUbicaciones();
    }),
      this.ubicacion.ubicaciones$.subscribe((texto) => {
        console.log('Ubicaciones: ', texto);
        this.getUbicaciones();
      }));
  }
  getUbicaciones() {
    this.ubicacion
      .getTrampasAll()
      .then((res) => {
        this.ubicaciones = res;
      })
      .catch((error) => {
        setTimeout(() => {
          this.extras.presentToast(JSON.stringify(error));
        }, 1500);
      });
  }
  buscar(event: any) {
    this.textoBuscar = event.detail.value;
  }
  actualizar() {
    this.ubicaciones = 0
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }
}
