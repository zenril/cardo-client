import {
  Component,
  ComponentFactoryResolver,
  Directive,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogService } from './dialog.service';
import { DialogData, DialogItem } from './dialogItem';

@Directive({
  selector: '[dialogHost]',
})
export class DialogDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    private resolver: ComponentFactoryResolver,
    private dialogService: DialogService
  ) {}

  @ViewChild(DialogDirective, { static: true }) dialogHost!: DialogDirective;

  loadComponent<Component extends DialogData<Component, Data>, Data>(
    next: DialogItem<Component, Data>
  ) {
    const factory = this.resolver.resolveComponentFactory(next.component);

    const ref = this.dialogHost.viewContainerRef;
    ref.clear();

    const componentRef = ref.createComponent<Component>(factory);
    componentRef.instance.data = next.data;
    return componentRef.instance;
  }

  gotStuff() {
    return !!this.dialogHost?.viewContainerRef;
  }

  close() {
    const ref = this.dialogHost.viewContainerRef;
    ref.clear();
  }

  ngOnInit(): void {
    this.dialogService.register(this);
  }
}
