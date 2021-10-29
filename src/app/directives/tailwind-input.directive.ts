import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tailwindInput]',
})
export class TailwindInputDirective {
  constructor(el: ElementRef<HTMLElement>) {
    // el.nativeElement.classList.add(
    //   'bg-white',
    //   'bg-opacity-10',
    //   'flex-1',
    //   'py-3',
    //   'px-2',
    //   'border-b-2',
    //   'border-gray-400',
    //   'focus:border-green-400',
    //   'text-white',
    //   'placeholder-gray-400',
    //   'outline-none'
    // );
  }
}
