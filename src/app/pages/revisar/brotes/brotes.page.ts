import { Component, OnInit } from '@angular/core';
import { BrotesService } from 'src/app/services/brotes.service';
import { TablasService } from 'src/app/services/tablas.service';

@Component({
  selector: 'app-brotes',
  templateUrl: './brotes.page.html',
  styleUrls: ['./brotes.page.scss'],
  standalone: false,
})
export class BrotesPage implements OnInit {
  brotes: any = [];

  constructor(
    public brote: BrotesService,
    private tabla: TablasService,
  ) {}

  ngOnInit() {
    this.getBrotes();
    this.tabla.nombre$.subscribe((texto) => {
      console.log('Brotes: ', texto);
      this.getBrotes();
    });
  }
  getBrotes() {
    this.brote
      .getBrotesAll()
      .then((res) => {
        this.brotes = res;
      })
      .catch((error) => {
        alert(error);
      });
  }
  actualizar() {
    this.brotes = 0
    setTimeout(() => {
      this.ngOnInit();
    }, 500);
  }
}
