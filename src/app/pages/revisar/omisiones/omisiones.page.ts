import { Component, OnInit } from '@angular/core';
import { OmisionesService } from 'src/app/services/omisiones.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-omisiones',
  templateUrl: './omisiones.page.html',
  styleUrls: ['./omisiones.page.scss'],
  standalone: false,
})
export class OmisionesPage implements OnInit {
  omisiones: any = [];
  constructor(
    public omision: OmisionesService,
    private tabla: TablasService,
  ) {}

  ngOnInit() {
    this.getAcciones();
    this.tabla.nombre$.subscribe((texto) => {
      console.log('Omisiones: ', texto);
      this.getAcciones();
    });
  }
  getAcciones() {
    this.omision
      .getOmisionesAll()
      .then((res) => {
        this.omisiones = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  actualizar() {
    this.omisiones = 0;
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }
}
