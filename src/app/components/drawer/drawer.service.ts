import { Injectable } from '@angular/core';
import { DrawerComponent } from './drawer.component';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  public drawers = new Map<string, DrawerComponent>();

  public register(drawer: DrawerComponent) {
    // drawer.open = false;
    this.drawers.set(drawer.position, drawer);
  }

  public unRegister(drawer: DrawerComponent) {
    drawer.open = false;
    this.drawers.delete(drawer.position);
  }

  public closeAllExcept(except?: DrawerComponent) {
    for (const kp of this.drawers.entries()) {
      let [id, drawer] = kp;
      if (except && drawer == except) continue;
      drawer.open = false;
    }
  }
  constructor() {}
}
