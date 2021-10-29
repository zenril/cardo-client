import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap, take } from 'rxjs';
import {
  ConfirmationButtonType,
  ConfirmationComponent,
  ConfirmationData,
} from '../components/confirmation/confirmation.component';
import { DialogService } from '../components/dialog/dialog.service';
import { DialogItem } from '../components/dialog/dialogItem';
import { ApiService } from '../services/api.service';
import { Deck, Game, Suit, Stats } from '../services/types';
import { UserService } from '../services/user.service';

interface GameStats {
  played: number;
  lastPlayed: Date | null;
  total: number;
}

@Component({
  selector: 'app-games',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  providers: [{ provide: FormBuilder }],
})
export class ManageComponent implements OnInit {
  decks$ = new BehaviorSubject<Deck[]>([]);
  games$ = new BehaviorSubject<Game[]>([]);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    deck: new FormControl(-1, [Validators.required, Validators.min(0)]),
  });

  showError(formControl: AbstractControl | string, error?: string) {
    if (typeof formControl == 'string') {
      formControl = this.form.get(formControl) as FormControl;
    }

    if (!error) return false;

    let hasError =
      !!error &&
      formControl.hasError(error) &&
      (formControl.dirty || formControl.touched);

    if (hasError) return formControl.getError(error);
    return false;
  }

  constructor(
    public api: ApiService,
    public userService: UserService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  sortGames(games: Game[]) {
    return games.sort((a, b) => {
      if (!a?.stats?.updatedAt || !b?.stats?.updatedAt) {
        return 0;
      }

      if (a?.stats?.updatedAt > b.stats?.updatedAt) return -1;
      if (a?.stats?.updatedAt < b.stats?.updatedAt) return 1;
      return 0;
    });
  }

  ngOnInit(): void {
    this.api.getGames().subscribe((games) => {
      this.games$.next(this.sortGames(games));
    });

    this.api.getDecks().subscribe((decks) => {
      this.decks$.next(decks);
    });
  }

  handleGameClick(game: Game) {
    this.router.navigate(['games', game.uuid]);
  }

  handleGameDelete(game: Game) {
    let component = this.dialogService.open<
      ConfirmationComponent,
      ConfirmationData
    >(
      new DialogItem(ConfirmationComponent, {
        title: `Delete Game`,
        content: `Are you sure you want to delete the game <strong>${game.name}</strong>`,
        buttons: [
          {
            label: 'Yes',
            type: ConfirmationButtonType.main,
          },
          {
            label: 'No',
          },
        ],
      })
    );

    component
      ?.on('Yes')
      .pipe(
        switchMap((dialog) => {
          return this.api.deleteGame(game?.uuid);
        }),
        catchError(() => {
          return of(null);
        })
      )
      .pipe(
        switchMap((deck_uuid) => {
          return deck_uuid ? this.api.getGames() : of(null);
        })
      )
      .subscribe((games) => {
        if (games) {
          this.games$.next(this.sortGames(games));
        }
        this.dialogService.close();
      });

    component?.on('No').subscribe(() => {
      this.dialogService.close();
    });
  }

  handleGameShuffle(game: Game) {
    let component = this.dialogService.open<
      ConfirmationComponent,
      ConfirmationData
    >(
      new DialogItem(ConfirmationComponent, {
        title: `Shuffle Game Deck`,
        content: `
        Are you sure you want to shuffle game <strong>${game.name}</strong>
        <br/>
        <span class="text-red">Warning: After shuffle all played cards will reset.</span>
        `,
        buttons: [
          {
            label: 'Shuffle',
            type: ConfirmationButtonType.main,
          },
          {
            label: 'Cancel',
          },
        ],
      })
    );

    component
      ?.on('Shuffle')
      .pipe(
        switchMap((dialog) => {
          return this.api.shuffleGame(game?.uuid);
        }),
        catchError(() => {
          return of(null);
        })
      )
      .pipe(
        switchMap((deck_uuid) => {
          return this.api.getGames();
        })
      )
      .subscribe((games) => {
        if (games) {
          this.games$.next(this.sortGames(games));
        }
        this.dialogService.close();
      });

    component?.on('Cancel').subscribe(() => {
      this.dialogService.close();
    });
  }

  handleDeckSelect(event: Event) {}

  createGame(event: Event) {
    let form: Partial<Game> = this.form.value;
    if (!form?.deck) return;

    let game: Partial<Game> = {
      ...form,
      deck: form.deck,
    };

    this.api.createGame(this.form.value).subscribe((game) => {
      this.router.navigate(['games', game.uuid]);
    });
  }
}
