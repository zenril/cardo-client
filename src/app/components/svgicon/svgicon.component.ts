import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svgicon',
  templateUrl: './svgicon.component.html',
  styleUrls: ['./svgicon.component.scss'],
})
export class SVGIconComponent implements OnInit {
  @Input() name: string = '';
  @Input() inline: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getSuitLink() {
    return `/assets/sprites.svg#${this.name}`;
  }
}
