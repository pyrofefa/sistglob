import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registro-detalle',
  templateUrl: './registro-detalle.page.html',
  styleUrls: ['./registro-detalle.page.scss'],
  standalone: false,
})
export class RegistroDetallePage implements OnInit {
  @Input() name:any;
  @Input() id:any;

  constructor(
    private route: ActivatedRoute,
    public back: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((res) => {
      this.name = res.get('name');
      this.id = res.get('id');
    });
  }
  async atras() {
    this.back.navigate(['/revisar']);
  }
}
