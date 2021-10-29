import { Type } from '@angular/core';
import { filter, map, Observable, share, Subject, take } from 'rxjs';

export class DialogBase {
  events$ = new Subject<string>();
  on(eventName: string) {
    return this.events$
      .pipe(
        filter((event) => {
          return event == eventName;
        })
      )
      .pipe(
        map((event) => {
          return this;
        })
      )
      .pipe(share(), take(1));
  }
}

export interface DialogData<Component, Data> {
  on: (eventName: string) => Observable<Component>;
  events$: Subject<string>;
  data: Data;
}

export class DialogItem<Component, Data> {
  constructor(public component: Type<Component>, public data: Data) {}
}
