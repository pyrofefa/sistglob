import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assests.service';
import { FenologiasService } from 'src/app/services/fenologias.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-fenologias',
  templateUrl: './fenologias.page.html',
  styleUrls: ['./fenologias.page.scss'],
  standalone: false,
})
export class FenologiasPage implements OnInit {
  fenologias: any = [];

  constructor(
    private extras: AssetsService,
    private fenologia: FenologiasService,
    private tabla: TablasService
  ) {}

  ngOnInit() {
    this.getFenologias();
    this.tabla.nombre$.subscribe((texto) => {
      console.log('Fenologias: ', texto);
      this.getFenologias();
    });
  }
  getFenologias() {
    this.fenologia
      .getFenologiasAll()
      .then((res) => {
        this.fenologias = res;
      })
      .catch((error) => {
        setTimeout(() => {
          this.extras.presentToast(JSON.stringify(error));
        }, 1500);
      });
  }
  actualizar() {
    this.fenologias = 0
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }
}
