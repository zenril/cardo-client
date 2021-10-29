import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import {
  ConfirmationButtonType,
  ConfirmationComponent,
  ConfirmationData,
} from '../components/confirmation/confirmation.component';
import { DialogService } from '../components/dialog/dialog.service';
import { DialogItem } from '../components/dialog/dialogItem';
import { ApiService } from '../services/api.service';
import { Deck } from '../services/types';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss'],
})
export class DeckListComponent implements OnInit {
  decks$ = new BehaviorSubject<Deck[]>([]);

  constructor(
    public api: ApiService,
    public userService: UserService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.api.getDecks().subscribe((decks) => {
      this.decks$.next(decks);
    });
  }

  handleDeckClick(deck: Deck) {
    this.router.navigate(['decks', deck.uuid]);
  }

  handleDeckDeleteClick(deck: Deck) {
    if (!deck?.uuid) return;

    let component = this.dialogService.open<
      ConfirmationComponent,
      ConfirmationData
    >(
      new DialogItem(ConfirmationComponent, {
        title: `Delete Deck`,
        content: `Are you sure you want to delete the deck <strong>${deck.name}</strong>`,
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
          return this.api.deleteDeck(deck?.uuid);
        }),
        catchError(() => {
          return of(null);
        })
      )
      .pipe(
        switchMap((deck_uuid) => {
          return deck_uuid ? this.api.getDecks() : of(null);
        })
      )
      .subscribe((decks) => {
        if (decks) {
          this.decks$.next(decks);
        }
      });

    component?.on('No').subscribe(() => {
      this.dialogService.close();
    });
    // this.confirmationService.dialog?.prompt(
    //   new Prompt('cool', 'no', (data) => {
    //
    //   })
    // );
  }
}
