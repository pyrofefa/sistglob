import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';
import { SimmoscasService } from 'src/app/services/simmoscas.service';

@Component({
  selector: 'app-simmoscas',
  templateUrl: './simmoscas.page.html',
  styleUrls: ['./simmoscas.page.scss'],
  standalone: false,
})
export class SimmoscasPage implements OnInit {
  registros: any = [];
  name: any;

  nombre$ = new EventEmitter<string>();

  constructor(
    public simmosca: SimmoscasService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimmoscas();
    this.simmosca.capturas$.subscribe((texto) => {
      console.log('SIMMOSCAS: ', texto);
      this.getSimmoscas();
    });
  }
  getSimmoscas() {
    this.simmosca
      .getCapturas()
      .then((res) => {
        console.log('res: ', res);
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMMOSCAS';
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
    this.simmosca
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
