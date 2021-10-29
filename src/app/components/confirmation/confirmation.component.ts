import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogBase, DialogData } from '../dialog/dialogItem';

export enum ConfirmationButtonType {
  main = 'main',
  secondary = 'secondary',
  red = 'red',
}

export interface ConfirmationButton {
  label: string;
  type?: ConfirmationButtonType;
}

export interface ConfirmationData {
  title?: string;
  content?: string;
  buttons: ConfirmationButton[];
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent
  extends DialogBase
  implements
    OnInit,
    OnDestroy,
    DialogData<ConfirmationComponent, ConfirmationData>
{
  constructor() {
    super();
  }

  public data: ConfirmationData = {
    title: '',
    content: '',
    buttons: [],
  };

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public handleButton(action: string) {
    this.events$.next(action);
  }

  private buttonStyles = {
    [ConfirmationButtonType.main.toString()]:
      'bg-red text-white border-red hover:bg-opacity-75 hover:bg-opacity-75',
    default: 'border-black text-black hover:bg-gray-200 hover:text-black',
  };

  getButtonStyles(type: ConfirmationButtonType | undefined) {
    if (type && this?.buttonStyles[type]) {
      return this?.buttonStyles[type];
    }

    return this?.buttonStyles['default'];
  }
}
