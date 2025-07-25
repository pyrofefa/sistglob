import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';
import { SimgbnService } from 'src/app/services/simgbn.service';

@Component({
  selector: 'app-simgbn',
  templateUrl: './simgbn.page.html',
  styleUrls: ['./simgbn.page.scss'],
  standalone: false
})
export class SimgbnPage implements OnInit {
  registros: any = [];
  name: any;

  nombre$ = new EventEmitter<string>();

  constructor(
    public simgbn: SimgbnService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimgbn();

    this.simgbn.capturas$.subscribe((texto) => {
      console.log('SIMGBN: ', texto);
      this.getSimgbn()
    });
  }
  getSimgbn() {
    this.simgbn
      .getCapturas()
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMGBN';
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
    this.simgbn.getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
