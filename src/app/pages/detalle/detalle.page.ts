import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SimtoDetalleService } from 'src/app/services/simto-detalle.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {
@Input() id:any;
  simto:any;

  constructor(private modalCtrl: ModalController, private detalle: SimtoDetalleService) { }

  ngOnInit() {
    this.getPuntos();
  }
  getPuntos(){
    this.detalle.simto(this.id).then(res=>{
        this.simto = res;
    }).catch(error=>{
      alert(error);
    })
  }
  closeModal(){
    this.modalCtrl.dismiss()
  }
  eliminar(id:number){
    this.detalle.eliminar(id).then(res=>{
        if(res == true){
          this.getPuntos();
        }
    }).catch(error=>{
      alert(error);
    })
  }

}
