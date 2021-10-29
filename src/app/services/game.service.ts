import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  ReplaySubject,
  switchMap,
} from 'rxjs';
import { ApiService } from './api.service';
import { Game } from './types';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  uuid$ = new ReplaySubject<string>(1);
  game$ = new ReplaySubject<Game>(1);
  constructor(private apiService: ApiService) {
    this.uuid$
      .pipe(
        distinctUntilChanged(),
        switchMap((uuid: string) => {
          return this.apiService.getGame(uuid);
        })
      )
      .subscribe((game: Game) => {
        this.game$.next(game);
      });
  }
}
