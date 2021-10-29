import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DrawerService } from './drawer.service';

enum Position {
  left = 'left',
  right = 'right',
}

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, OnDestroy {
  private _open = false;

  @Input()
  set open(value: boolean) {
    document.body.classList.toggle(`u-drawer--${this.position}`, value);
    this._open = value;
  }

  get open() {
    return this._open;
  }

  @Input() position: string = Position.left;
  @Input() title: string = '';
  @Output() onTabClick = new EventEmitter<DrawerComponent>();

  handleTab() {
    this._drawers.closeAllExcept(this);
    this.open = !this.open;
  }

  constructor(private _drawers: DrawerService) {}

  ngOnDestroy(): void {
    this._drawers.unRegister(this);
  }

  ngOnInit(): void {
    this._drawers.register(this);
  }
}
