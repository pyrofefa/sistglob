import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-capturas',
  templateUrl: './capturas.page.html',
  styleUrls: ['./capturas.page.scss'],
  standalone: false,
})
export class CapturasPage implements OnInit {
  @Input() name: any;
  @Input() id: any;
  @Input() campana: any;

  constructor(private route: ActivatedRoute, private back: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(res =>{
        this.name = res.get('name');
        this.id = res.get('ubicacion');
        this.campana = res.get('campana')
    })
  }
  async atras(){
    this.back.navigate(['/ubicaciones',this.campana, this.name ]);
  }
}
