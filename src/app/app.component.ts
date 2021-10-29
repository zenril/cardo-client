import { Component } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { map } from 'rxjs';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cardo-client';

  constructor(
    private _apiService: ApiService,
    public _userService: UserService
  ) {}

  get currentURL() {
    return window.location.href;
  }

  ngOnInit(): void {}
}
