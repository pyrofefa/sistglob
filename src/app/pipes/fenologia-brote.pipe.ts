import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fenologiaBrotes',
  standalone: false
})
export class FenologiaBrotesPipe implements PipeTransform {

  transform(value: any, id:number): any {
    if(id == 1){
        return 'Yema V1';
    }
    else if(id == 2){
      return 'C. BROTES V2';
    }
    else if(id == 3){
      return 'C. BROTES V3';
    }
    else if(id == 4){
      return 'C. BROTES V4';
    }
    else if(id == 5){
      return 'C. BROTES V5';
    }
    else if(id == 6){
      return 'C. BROTES V6';
    }
    else if(id == 7){
      return 'BROTE RECIO V7';
    }
    else{
      return '';
    }
    //return null;
  }

}
