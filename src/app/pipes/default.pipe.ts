import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'default',
})
export class DefaultPipe implements PipeTransform {
  transform(value: unknown, defaultValue: any): unknown {
    return !value ? defaultValue : value;
  }
}
