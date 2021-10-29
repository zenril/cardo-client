import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { switchMap } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _apiService: ApiService,
    public _userService: UserService
  ) {}

  ngOnInit(): void {}
}
