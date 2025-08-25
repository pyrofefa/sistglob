import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimppService } from 'src/app/services/simpp.service';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from "moment";

@Component({
  selector: 'app-simpp',
  templateUrl: './simpp.page.html',
  styleUrls: ['./simpp.page.scss'],
  standalone: false,
})
export class SimppPage implements OnInit {
  registros: any = [];
  name: any;

  nombre$ = new EventEmitter<string>();

  constructor(
    public simpp: SimppService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimpp();
    this.simpp.capturas$.subscribe((texto) => {
      this.getSimpp();
    });
  }
  getSimpp() {
    this.simpp
      .getCapturas()
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMPP';
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
    this.simpp
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
