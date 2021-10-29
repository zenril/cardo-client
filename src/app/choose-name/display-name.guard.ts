import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class DisplayNameGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.currentUser$.pipe(
      map((user) => {
        if (!user || user?.displayName) {
          return true;
        } else {
          this.router.navigate(['/who']);
          return false;
        }
      })
    );
  }
}
