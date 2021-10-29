import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tailwindLabel]',
})
export class TailwindLabelDirective {
  constructor(el: ElementRef<HTMLElement>) {
    // el.nativeElement.classList.add('text-green-400', 'inline-block', 'mb-1');
  }
}
