import { Component, OnInit } from '@angular/core';
import { RecomendacionesService } from 'src/app/services/recomendaciones.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
  standalone: false,
})
export class RecomendacionesPage implements OnInit {
  recomendaciones: any = [];

  constructor(
    public recomendacion: RecomendacionesService,
    private tabla: TablasService,
  ) {}

  ngOnInit() {
    this.getRecomendaciones();
    this.tabla.nombre$.subscribe((texto) => {
      console.log('Recomendaciones: ', texto);
      this.getRecomendaciones();
    });
  }
  getRecomendaciones() {
    this.recomendacion
      .getRecomendacionesAll()
      .then((res) => {
        this.recomendaciones = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  actualizar() {
    this.recomendaciones = 0;
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }
}
