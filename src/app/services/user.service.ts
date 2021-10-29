import { Injectable, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
// import { ConsoleReporter } from 'jasmine';
import {
  BehaviorSubject,
  catchError,
  map,
  NEVER,
  Observable,
  ReplaySubject,
  switchMap,
  tap,
} from 'rxjs';
import { ApiService } from './api.service';
import { User } from './types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$ = new ReplaySubject<User | null>(1);
  currentUser: User | null = null;
  constructor(private api: ApiService) {
    this.api.getUser().subscribe((user) => {
      this.currentUser = user ?? null;
      this.currentUser$.next(this.currentUser);
    });
  }

  setDisplayName(displayName: string) {
    return this.api.updateUser({ displayName }).pipe(
      tap((user) => {
        if (user) {
          this.currentUser = user;
          this.currentUser$.next(user);
        }
      })
    );
  }

  getDisplayName() {
    return this.currentUser?.displayName;
  }
}
