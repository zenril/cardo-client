import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  NEVER,
  switchMap,
  tap,
} from 'rxjs';
import { DialogService } from '../components/dialog/dialog.service';
import { ApiService } from '../services/api.service';
import { GameSocketService } from '../services/game-socket.service';
import { GameService } from '../services/game.service';
import { Card, Game } from '../services/types';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game$ = new BehaviorSubject<Game | null>(null);
  lastFlipped$ = new BehaviorSubject<Card | null>(null);
  private playedCardsMap = new Map<string, Card>();
  playedCards$ = new BehaviorSubject<Card[]>([]);

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public gameService: GameService,
    public gameSocket: GameSocketService,
    public userService: UserService,
    private dialogService: DialogService
  ) {}

  sortByDate(a: Card, b: Card) {
    return (
      new Date(b.played || 0).getTime() - new Date(a.played || 0).getTime()
    );
  }

  flip(game: Game) {
    this.apiService.pickCard(game.uuid).subscribe((card) => {
      this.lastFlipped$.next(card);
      this.addPlayedCards([card]);
    });
  }

  addPlayedCards(cards: Card[]) {
    for (const card of cards) {
      if (!card.userId || !card.played) continue;
      this.playedCardsMap.set(card.uuid, card);
    }

    let played = [...this.playedCardsMap.values()].sort((a, b) => {
      return (
        new Date(b.played as string).getTime() -
        new Date(a.played as string).getTime()
      );
    });

    this.playedCards$.next(played);
  }

  getSuitLink(suit: string) {
    return `/assets/sprites.svg#${suit}`;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let game_uuid = params.get('game_uuid');
      this.gameService.uuid$.next(game_uuid as string);
    });

    this.gameService.game$.subscribe((game: Game) => {
      this.addPlayedCards(game?.cards || []);
    });

    this.gameSocket.latestCard$.subscribe((card) => {
      this.addPlayedCards([card]);
    });
  }
}
