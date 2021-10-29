import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [
    `
      :root {
        --offset: -1.9%;
        --single-offset: -25%;
        --face-offset: 0%;
      }
    `,
  ],
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() name: string = '1';
  @Input() type: string = '1';

  constructor() {}

  numberPips: { [key: string]: (number | string)[] } = {
    '1': [7],
    '2': [4, 10],
    '3': [4, 7, 10],
    '4': [2, 4, 10, 12],
    '5': [1, 4, 7, 10, 13],
    '6': [2, 3, 4, 10, 11, 12],
    '7': [1, 4, 6, 7, 8, 10, 13],
    '8': [1, 2, 3, 4, 10, 11, 12, 13],
    '9': [1, 2, 3, 4, 7, 10, 11, 12, 13],
    '10': [1, 2, 3, 4, 6, 8, 10, 11, 12, 13],
    '11': [1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13],
    '12': [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13],
    '13': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  };

  getName() {
    return this.name.toUpperCase();
  }

  getPips(): (null | string | number)[] {
    if (this.isLetter()) {
      return ['name', 2];
    }

    return this.numberPips[this.name] || [this.name];
  }

  getSuitLink() {
    return `/assets/sprites.svg#${this.type}`;
  }

  value() {
    let nv = Number(this.name);
    if (isNaN(nv)) {
      return this.name;
    }

    return nv;
  }

  isLetter() {
    return /[a-z]$/.test(this.name);
  }

  isSingle() {
    return /[A-Z]$/.test(this.name);
  }

  isNumber() {
    return /^1[0-3]|[1-9]$/.test(this.name);
  }

  isZero() {
    return /^0$/.test(this.name);
  }

  ngOnInit(): void {}
}
