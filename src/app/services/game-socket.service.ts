import { Injectable } from '@angular/core';
import { combineLatest, filter, ReplaySubject } from 'rxjs';
import { GameService } from './game.service';
import { Card, Game } from './types';
import { io, Manager, Socket } from 'socket.io-client';
import { UserService } from './user.service';
import { ThrowStmt } from '@angular/compiler';
import { environment } from 'src/environments/environment';

export enum SceneState {
  initial = 'initial',
  notflipped = 'notflipped',
  isflipped = 'isflipped',
  socketflipped = 'socketflipped',
  iszoomed = 'iszoomed',
}

export enum Source {
  socket = 'socket',
  local = 'local',
}

export interface SceneStateSource {
  source: Source;
  state: SceneState;
}

@Injectable({
  providedIn: 'root',
})
export class GameSocketService {
  private sceneState$ = new ReplaySubject<SceneStateSource>(1);
  private cardState$ = new ReplaySubject<Card>(1);
  private socket?: Socket;

  latestCard$ = this.cardState$.pipe(
    filter((card) => {
      return card.userId != this.userService.currentUser?.id;
    })
  );

  latestMove$ = this.sceneState$.asObservable();

  constructor(
    public gameService: GameService,
    private userService: UserService
  ) {
    this.gameService.game$.subscribe((game) => {
      if (this.socket) {
        this.socket.disconnect();
      }

      this.socket = io(environment.api, {
        query: {
          room: game.uuid,
        },
      });

      this.socket.on('card', (card: Card) => {
        this.cardState$.next(card);
      });

      this.socket.on('nextSceneMove', (state: SceneState) => {
        this.sceneState$.next({
          state,
          source: Source.socket,
        });
      });
    });
  }

  move(state: SceneState) {
    if (!this.socket) return;
    this.socket.emit('move', state);
  }
}
