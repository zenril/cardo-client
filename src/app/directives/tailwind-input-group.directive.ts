import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tailwindInputGroup]',
})
export class TailwindInputGroupDirective {
  constructor(el: ElementRef<HTMLElement>) {
    // el.nativeElement.classList.add('flex', 'flex-col', 'mb-2');
  }
}
