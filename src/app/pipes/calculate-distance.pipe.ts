import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDistance',
  standalone: false
})

@Injectable({ providedIn: 'root' }) // <--- Añade esto
export class CalculateDistancePipe implements PipeTransform {

  transform(value: any, lat1: number, lon1: number, lat2: number, lon2: number): any {
    let p = 0.017453292519943295;
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 +
            c(lat2 * p) * c(lat1 * p) *
            (1 - c((lon1 - lon2) * p)) / 2;

    let dis = 12742 * Math.asin(Math.sqrt(a)); // en km
    let mt = dis * 1000; // en metros
    let distancia = Math.trunc(mt);

    let bearing = this.calculateBearing(lat1, lon1, lat2, lon2);
    let orientacion = this.getOrien(bearing);

    return {
      distancia,
      orientacion
    };
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    let toRad = (deg: number) => deg * Math.PI / 180;
    let y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    let x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.cos(toRad(lon2 - lon1));
    let brng = Math.atan2(y, x);
    return brng * 180 / Math.PI;
  }

  private getOrien(bear: number): string {
    if ((bear > -22.5 && bear <= 22.5)) return 'N';
    if (bear > 22.5 && bear <= 67.5) return 'NE';
    if (bear > 67.5 && bear <= 112.5) return 'E';
    if (bear > 112.5 && bear <= 157.5) return 'SE';
    if ((bear > 157.5 && bear <= 180) || (bear < -157.5 && bear >= -180)) return 'S';
    if (bear > -157.5 && bear <= -112.5) return 'SW';
    if (bear > -112.5 && bear <= -67.5) return 'W';
    if (bear > -67.5 && bear <= -22.5) return 'NW';
    return '';
  }
}
