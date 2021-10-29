import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tailwindError]',
})
export class TailwindErrorDirective {
  constructor(el: ElementRef<HTMLElement>) {}
}
