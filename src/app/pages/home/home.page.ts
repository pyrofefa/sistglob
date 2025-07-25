import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  sims: any = [
    {
      id: 1,
      name: 'SIMEP',
      img: 'simep.png',
    },
    {
      id: 2,
      name: 'SIMGBN',
      img: 'simgbn.png',
    },
    {
      id: 4,
      name: 'SIMDIA',
      img: 'simdia.png',
    },
    {
      id: 5,
      name: 'SIMMOSCA',
      img: 'simmosca.png',
    },
    {
      id: 6,
      name: 'SIMPP',
      img: 'simpp.png',
    },
    {
      id: 7,
      name: 'SIMTO',
      img: 'simto.png',
    },
    {
      id: 8,
      name: 'SIMPICUDO',
      img: 'simpicudo.png',
    },
    {
      id: 3,
      name: 'SIMTRAMPEO',
      img: 'simtrampeo.png',
    },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.sims;
  }
  ngOnInit() {
    this.sims;
  }
  seleccionar(id: any, name: any) {
    this.router.navigate(['/ubicaciones', id, name], {
      relativeTo: this.route,
    });
  }
}
