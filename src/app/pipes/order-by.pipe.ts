import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: false
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!array) return [];
    return array.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  }
}
