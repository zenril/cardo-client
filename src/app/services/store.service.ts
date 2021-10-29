import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { Game } from './types';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  game$ = new ReplaySubject<Game>(1);
  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    // this.route.params.pipe(distinctUntilChanged((oldParams,newParams)=> {
    //   this.game$.va
    //   return
    // }))
  }
}
