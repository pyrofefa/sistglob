import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { CommonModule } from '@angular/common';
import { CalculateDistancePipe } from './calculate-distance.pipe';
import { OrderByPipe } from './order-by.pipe';

@NgModule({
  declarations: [ FiltroPipe, CalculateDistancePipe, OrderByPipe ],
  exports: [ FiltroPipe, CalculateDistancePipe, OrderByPipe ],
  imports: [CommonModule]
})
export class PipesModule { }
