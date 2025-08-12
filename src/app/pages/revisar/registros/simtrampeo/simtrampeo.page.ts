import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@capacitor-community/date-picker';
import * as moment from 'moment';
import { SimtrampeoService } from 'src/app/services/simtrampeo.service';

@Component({
  selector: 'app-simtrampeo',
  templateUrl: './simtrampeo.page.html',
  styleUrls: ['./simtrampeo.page.scss'],
  standalone: false
})
export class SimtrampeoPage implements OnInit {
registros: any = [];
  name: any;
  nombre$ = new EventEmitter<string>();

  constructor(
    public simtrampeo: SimtrampeoService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.getSimtrampeo();
    this.simtrampeo.capturas$.subscribe((texto) => {
      console.log('SIMTRAMPEO: ', texto);
      this.getSimtrampeo();
    });
  }
  getSimtrampeo() {
    this.simtrampeo
      .getCapturas()
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  registroDetails(item: any) {
    this.name = 'SIMTRAMPEO';
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
    this.simtrampeo
      .getBuscar(fechaParse)
      .then((res) => {
        this.registros = res;
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
