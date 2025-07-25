import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  calculate(lat1: number, lon1: number, lat2: number, lon2: number) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 +
              c(lat2 * p) * c(lat1 * p) *
              (1 - c((lon1 - lon2) * p)) / 2;

    const dis = 12742 * Math.asin(Math.sqrt(a)); // en km
    const mt = dis * 1000; // en metros
    const distancia = Math.trunc(mt);

    const bearing = this.calculateBearing(lat1, lon1, lat2, lon2);
    const orientacion = this.getOrien(bearing);

    return { distancia, orientacion };
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const p = Math.PI / 180;
    const y = Math.sin((lon2 - lon1) * p) * Math.cos(lat2 * p);
    const x = Math.cos(lat1 * p) * Math.sin(lat2 * p) -
              Math.sin(lat1 * p) * Math.cos(lat2 * p) * Math.cos((lon2 - lon1) * p);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  private getOrien(bearing: number): string {
    if (bearing >= 337.5 || bearing < 22.5) return 'Norte';
    if (bearing >= 22.5 && bearing < 67.5) return 'Noreste';
    if (bearing >= 67.5 && bearing < 112.5) return 'Este';
    if (bearing >= 112.5 && bearing < 157.5) return 'Sureste';
    if (bearing >= 157.5 && bearing < 202.5) return 'Sur';
    if (bearing >= 202.5 && bearing < 247.5) return 'Suroeste';
    if (bearing >= 247.5 && bearing < 292.5) return 'Oeste';
    if (bearing >= 292.5 && bearing < 337.5) return 'Noroeste';
    return '';
  }
}
