import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpicudoService } from 'src/app/services/simpicudo.service';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from "moment";


@Component({
  selector: 'app-simpicudo',
  templateUrl: './simpicudo.page.html',
  styleUrls: ['./simpicudo.page.scss'],
  standalone: false
})
export class SimpicudoPage implements OnInit {
  registros: any = [];
  name: any;

  nombre$ = new EventEmitter<string>();


  constructor(
    public simpicudo: SimpicudoService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimep();
    this.simpicudo.capturas$.subscribe(texto =>{
      this.getSimep();
    })
  }
  getSimep() {
    this.simpicudo
      .getCapturas()
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item:any) {
    this.name = 'SIMPICUDO';
    this.route.navigate(['/registro-detalle', item, this.name]);
  }
  actualizar() {
    this.ngOnInit();
  }
  async buscar() {
    try {
      const result = await DatePicker.present({
        mode: 'date',
        date: new Date().toISOString(),
        locale: 'es_MX',
        theme: 'light',
      });

      if (result.value) {
        const selectedDate = new Date(result.value);
        this.onSuccess(selectedDate);
      }
    } catch (err) {
      console.log('Error occurred while getting date: ', err);
    }
  }
  onSuccess(date: any) {
    let fechaParse = moment(date).format('YYYY-MM-DD');
    this.simpicudo
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
