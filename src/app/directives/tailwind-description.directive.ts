import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tailwindDescription]',
})
export class TailwindDescriptionDirective {
  constructor(el: ElementRef<HTMLElement>) {
    // el.nativeElement.classList.add();
  }
}
