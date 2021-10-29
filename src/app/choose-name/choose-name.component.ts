import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { NavigationService } from '../services/navigation.service';
import { Suit, User } from '../services/types';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-choose-name',
  templateUrl: './choose-name.component.html',
  styleUrls: ['./choose-name.component.scss'],
})
export class ChooseNameComponent implements OnInit {
  form = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
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

  submitName(event: Event) {
    let form: Partial<User> = this.form.value;
    if (!form?.displayName) return;
    this.userService
      .setDisplayName(form?.displayName)
      .pipe(
        catchError(() => {
          return of(null);
        })
      )
      .subscribe((user) => {
        if (!user) {
          return this.form.controls.displayName.setErrors({
            opps: true,
          });
        }

        this.navigation.back('/games');
      });
  }

  getSuits() {
    return Object.values(Suit);
  }

  getSuitLink(type: Suit) {
    return `/assets/sprites.svg#${type}`;
  }

  getDisplayName() {
    return this.userService.currentUser?.displayName;
  }

  constructor(
    private api: ApiService,
    public userService: UserService,
    private router: Router,
    private navigation: NavigationService
  ) {}

  ngOnInit(): void {
    this.form.controls.displayName.setValue(this.getDisplayName());
  }
}
