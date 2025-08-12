import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';
import { SimdiaService } from 'src/app/services/simdia.service';

@Component({
  selector: 'app-simdia',
  templateUrl: './simdia.page.html',
  styleUrls: ['./simdia.page.scss'],
  standalone: false,
})
export class SimdiaPage implements OnInit {
  registros: any = [];
  name: any;

  nombre$ = new EventEmitter<string>();

  constructor(
    public simdia: SimdiaService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimdia();
    this.simdia.capturas$.subscribe((texto) => {
      console.log('SIMDIA: ', texto);
      this.getSimdia();
    });
  }
  getSimdia() {
    this.simdia
      .getCapturas()
      .then((res) => {
        console.log("res: ", res)
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMDIA';
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
    this.simdia
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
