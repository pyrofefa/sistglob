import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';
import { SimtoService } from 'src/app/services/simto.service';

@Component({
  selector: 'app-simto',
  templateUrl: './simto.page.html',
  styleUrls: ['./simto.page.scss'],
  standalone: false,
})
export class SimtoPage implements OnInit {
  registros: any = [];
  name: any;
  nombre$ = new EventEmitter<string>();

  constructor(
    public simto: SimtoService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimto();
    this.simto.capturas$.subscribe((texto) => {
      this.getSimto();
    });
  }
  getSimto() {
    this.simto
      .getCapturas()
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMTO';
    this.route.navigate(['/registro-detalle', item, this.name]);
  }
  actualizar() {
    this.registros = 0;
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
    this.simto
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
