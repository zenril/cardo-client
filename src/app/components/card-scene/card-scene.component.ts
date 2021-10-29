import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  GameSocketService,
  SceneState,
  SceneStateSource,
  Source,
} from 'src/app/services/game-socket.service';
import { GameService } from 'src/app/services/game.service';
import { Card } from 'src/app/services/types';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-scene',
  templateUrl: './card-scene.component.html',
  styleUrls: ['./card-scene.component.scss'],
  // styles: [
  //   `
  //     :host {
  //       color: var(--zoom-top);
  //     }
  //   `,
  // ],
})
export class CardSceneComponent implements OnInit {
  private current: Card | null = null;

  states: Record<
    SceneState,
    { classname: string; next: SceneState; name: string }
  > = {
    initial: { name: 'initial', next: SceneState.notflipped, classname: '' },
    notflipped: {
      name: 'notflipped',
      classname: '',
      next: SceneState.isflipped,
    },
    isflipped: {
      name: 'isflipped',
      classname: 'is-flipped',
      next: SceneState.iszoomed,
    },
    socketflipped: {
      name: 'socketflipped',
      classname: 'is-flipped',
      next: SceneState.iszoomed,
    },
    iszoomed: {
      name: 'iszoomed',
      classname: 'is-flipped is-zoomed',
      next: SceneState.notflipped,
    },
  };

  actualCard$ = new ReplaySubject<Card>(1);

  cardState$ = new Subject<string>();
  previousCard$ = new BehaviorSubject<Card | null>(null);
  sceneState$ = new BehaviorSubject<SceneStateSource>({
    state: this.states.initial.next,
    source: Source.local,
  });

  zoomToggle = false;
  @HostBinding('style.--zoom-top')
  @Input()
  zoomTop: string;

  @HostBinding('style.--zoom-left')
  @Input()
  zoomLeft: string;

  @Input()
  set initialCard(card: Card) {
    if (!this.previousCard$.value) {
      this.previousCard$.next(card);
    }
  }
  @Input() cardSet = 'default';
  @Output() handleNewCard = new EventEmitter<any>();
  @Input() socketCard$ = new Observable<Card | null>();
  @Input() currentCard$ = new Observable<Card | null>();

  cardBack(num: number) {
    return `/assets/back${num}.svg`;
  }

  constructor(
    public gameService: GameService,
    public gameSocket: GameSocketService,
    public userService: UserService
  ) {
    this.zoomLeft = '4000px';
    this.zoomTop = '0px';

    this.nextZoom();
  }

  handleCardClick() {
    this.sceneState$.next({
      state: this.states[this.sceneState$.value.state].next,
      source: Source.local,
    });
  }

  nextZoom() {
    // let offset = this.zoomToggle ? 45 : 225;
    // let degrees = offset + ((Math.random() * 90) << 0);
    // console.log(degrees);
    // let rads = degrees * (Math.PI / 180);

    // this.zoomLeft = `${3000 * Math.sin(rads)}px`;
    // this.zoomTop = `${3000 * Math.cos(rads)}px`;

    this.zoomLeft = `${this.zoomToggle ? 3000 : -3000}px`;
    this.zoomTop = `0`;

    this.zoomToggle = !this.zoomToggle;
  }

  ngOnInit(): void {
    combineLatest(
      this.gameSocket.latestMove$,
      this.gameSocket.latestCard$
    ).subscribe(([move, card]) => {
      this.sceneState$.next(move);
      this.actualCard$.next(card);
    });

    this.sceneState$.subscribe(({ state, source }) => {
      let ns = this.states[state];

      if (source == Source.local) {
        this.gameSocket.move(state);
      }

      this.cardState$.next(ns.classname);

      if (source == Source.local && state == SceneState.isflipped) {
        this.handleNewCard.emit('pwease');
      }

      if (source == Source.local && state == SceneState.iszoomed) {
        this.nextZoom();
        setTimeout(() => {
          this.sceneState$.next({
            state: ns.next,
            source: Source.local,
          });
        }, 500);
      }
    });

    this.currentCard$.subscribe((card) => {
      if (!card) return;

      this.current = card;
      this.actualCard$.next(card);
    });
  }
}
