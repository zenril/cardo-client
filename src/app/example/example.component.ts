import { Component, OnInit } from '@angular/core';
import json from '../../assets/sprites.json';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {
  constructor() {}

  sprites = json.sprites;

  ngOnInit(): void {}
}
