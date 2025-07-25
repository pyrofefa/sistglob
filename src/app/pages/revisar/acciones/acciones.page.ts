import { Component, OnInit } from '@angular/core';
import { AccionesService } from 'src/app/services/acciones.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.page.html',
  styleUrls: ['./acciones.page.scss'],
  standalone: false
})
export class AccionesPage implements OnInit {
 acciones:any = [];

  constructor(public accion: AccionesService, private tabla: TablasService) { }

  ngOnInit() {
    this.getAcciones();
    this.tabla.nombre$.subscribe(texto =>{
      console.log('Acciones: ', texto)
      this.getAcciones();
    })
  }
  getAcciones(){
    this.accion.getAccionesAll().then(res =>{
      this.acciones = res;
    }).catch(error =>{
      alert(error);
    })
  }
  actualizar() {
    this.acciones = 0
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }

}
