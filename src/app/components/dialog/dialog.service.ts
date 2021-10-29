import { Directive, Injectable, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogData, DialogItem } from './dialogItem';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private component: DialogComponent | null = null;

  public register(component: DialogComponent) {
    this.component = component;
  }

  public unRegister() {
    this.component = null;
  }

  public open<Component extends DialogData<Component, Data>, Data>(
    item: DialogItem<Component, Data>
  ) {
    return this.component?.loadComponent<Component, Data>(item);
  }

  public close() {
    return this.component?.close();
  }

  constructor() {}
}
