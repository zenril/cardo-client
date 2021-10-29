import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  filter,
  switchMap,
} from 'rxjs';
import { ApiService } from '../services/api.service';
import { Card, Deck, Game, Suit, SuitCards } from '../services/types';
import { UserService } from '../services/user.service';

import json from '../../assets/sprites.json';
import { CardValidator } from '../validators/cards.validator';
import { DialogService } from '../components/dialog/dialog.service';
import {
  ConfirmationButtonType,
  ConfirmationComponent,
  ConfirmationData,
} from '../components/confirmation/confirmation.component';
import { DialogItem } from '../components/dialog/dialogItem';

interface GameStats {
  played: number;
  lastPlayed: Date;
  total: number;
}

interface SuitItem {
  suit: Suit;
  added: Date;
}

@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss'],
})
export class DeckBuilderComponent implements OnInit {
  deck?: Deck = {
    name: '',
    suits: [],
  };

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    suits: new FormGroup(
      {},
      {
        validators: (control) => {
          let formGroup = control as FormGroup;
          let suits = Object.values(formGroup.controls);
          if (!suits.length) return { deck: 'Must contain at least one suit' };
          return null;
        },
      }
    ),
  });

  get isEditing() {
    return !!this.deck?.uuid;
  }

  get isCreating() {
    return !this.deck?.uuid;
  }

  saving$ = new BehaviorSubject<Boolean>(false);

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
    private api: ApiService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  getSuits() {
    return json.suits.filter((suit) => {
      return !this.deck?.suits.find((item) => item.suit == suit);
    });
  }

  getDeckSuits() {
    // let values = [...this.deck.values()];

    // if (!values.length) {
    //   return null;
    // }

    // return values.sort((a: SuitItem, b: SuitItem) => {
    //   return b.added.getTime() - a.added.getTime();
    // });

    return this.deck?.suits || ([] as SuitCards[]);
  }

  handleSelect(event: Event | null) {
    let input = event?.target as HTMLInputElement;
    const suit = input.value as Suit;
    this.addSuitControl(suit);
  }

  addSuitControl(suit: string) {
    if (this.form.controls[suit]) return;

    let fg = this.form.controls.suits as FormGroup;

    let newForm = new FormControl('', [
      Validators.required,
      CardValidator('cardsInvalid'),
    ]);

    if (!this.deck?.suits.find((item) => item.suit == suit)) {
      this.deck?.suits.unshift({
        added: this.deck.suits.length,
        suit: suit,
        cards: '',
      });

      console.log(this.deck);
    }

    fg.registerControl(suit, newForm);
    return newForm;
  }

  getSuitControl(key: string) {
    let fg = this.form.controls.suits as FormGroup;
    return fg.controls[key] as FormControl;
  }

  removeSuit(suit: string) {
    let component = this.dialogService.open<
      ConfirmationComponent,
      ConfirmationData
    >(
      new DialogItem(ConfirmationComponent, {
        title: `Delete Suit <strong>${suit}</strong>`,
        content: `Are you sure?`,
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

    component?.on('Yes').subscribe((dialog) => {
      this.dialogService.close();
      let index = this.deck?.suits?.findIndex((item) => item.suit == suit);
      if (typeof index == 'undefined' || index == -1) return;

      this.deck?.suits.splice(index, 1);

      let fg = this.form.controls.suits as FormGroup;
      fg.removeControl(suit);
    });

    component?.on('No').subscribe((dialog) => {
      this.dialogService.close();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let deck_uuid = params.get('deck_uuid');

      if (!deck_uuid) {
        return;
      }

      return this.api.getDeck(deck_uuid).subscribe((deck) => {
        if (!deck.suits.length) return;

        this.deck = deck;

        for (const suit of deck.suits) {
          let control = this.addSuitControl(suit.suit as Suit);
          control?.setValue(suit.cards);
        }

        this.form.controls.name.setValue(deck.name);

        this.form.valueChanges
          .pipe(
            debounceTime(2500),
            filter((value) => {
              return !this.form.invalid;
            })
          )
          .subscribe((value) => {
            this.createDeck();
          });
      });
    });
  }

  splitCards(cards: string) {
    return cards
      .split(/[,\n\s]+/)
      .filter((item) => !!item)
      .map((card) => card.trim());
  }

  createDeck() {
    if (!this.deck) return;
    this.saving$.next(true);
    this.deck.name = this.form.controls.name.value;

    let cards: { [key: string]: string } = this.form.controls.suits.value;

    for (const suitObject of this.deck?.suits || []) {
      suitObject.cards = cards[suitObject.suit];
    }

    this.api.upsertDeck(this.deck).subscribe((deck) => {
      setTimeout(() => {
        this.saving$.next(false);

        if (this.isCreating) {
          this.router.navigate(['decks', deck.uuid]);
        }
      }, 2000);
    });
  }
}
