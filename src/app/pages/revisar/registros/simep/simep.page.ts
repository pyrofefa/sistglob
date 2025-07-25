import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimepService } from 'src/app/services/simep.service';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';

@Component({
  selector: 'app-simep',
  templateUrl: './simep.page.html',
  styleUrls: ['./simep.page.scss'],
  standalone: false,
})
export class SimepPage implements OnInit {
  simepRegistros: any = [];
  name: any;

  constructor(
    public simep: SimepService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getSimep();
  }
  getSimep() {
    this.simep
      .getCapturas()
      .then((res) => {
        console.log("SIMEP REGISTROS: ", res)
        this.simepRegistros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item:any) {
    this.name = 'SIMEP';
    this.route.navigate(['/registro-detalle', item, this.name]);
  }
  actualizar() {
    this.simepRegistros = 0;
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
    console.log(fechaParse);
    this.simep
      .getBuscar(fechaParse)
      .then((res) => {
        this.simepRegistros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
