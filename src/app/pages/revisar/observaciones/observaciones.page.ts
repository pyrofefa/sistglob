import { Component, OnInit } from '@angular/core';
import { ObservacionesService } from 'src/app/services/observaciones.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.page.html',
  styleUrls: ['./observaciones.page.scss'],
  standalone: false
})
export class ObservacionesPage implements OnInit {
observaciones:any = [];

  constructor(public observacion: ObservacionesService, private tabla: TablasService) { }

  ngOnInit() {
    this.getObservaciones();
    this.tabla.nombre$.subscribe(texto =>{
      console.log('Observaciones: ', texto)
      this.getObservaciones();
    })
  }
  getObservaciones(){
    this.observacion.getObservacionesAll().then(res =>{
      this.observaciones = res;
    }).catch(error =>{
      alert(error);
    })
  }
  actualizar() {
    this.observaciones = 0
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }

}
