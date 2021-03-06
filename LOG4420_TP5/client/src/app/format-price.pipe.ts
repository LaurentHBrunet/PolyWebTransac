import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(price: any, args?: any): any {
    return Number(price).toFixed(2).replace(".", ",");
  }

}
