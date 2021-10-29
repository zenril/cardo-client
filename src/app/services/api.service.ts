import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card, Deck, Game, User } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<User>(`${this.BASE_URL}/auth/user`, {
      withCredentials: true,
    });
  }

  updateUser(user: Partial<User>) {
    return this.http.put<User>(`${this.BASE_URL}/auth/user`, user, {
      withCredentials: true,
    });
  }

  login(user: Partial<User>) {
    return this.http.post<User>(`${this.BASE_URL}/auth/login`, user);
  }

  createGame(data: Partial<Game>) {
    return this.http.post<Game>(`${this.BASE_URL}/games`, data, {
      withCredentials: true,
    });
  }

  getGames() {
    return this.http.get<Game[]>(`${this.BASE_URL}/games`, {
      withCredentials: true,
    });
  }

  getGame(game_uuid: string) {
    return this.http.get<Game>(`${this.BASE_URL}/games/${game_uuid}`, {
      withCredentials: true,
    });
  }

  deleteGame(game_uuid: string) {
    return this.http.delete<string>(`${this.BASE_URL}/games/${game_uuid}`, {
      withCredentials: true,
    });
  }

  shuffleGame(game_uuid: string) {
    return this.http.post<string>(
      `${this.BASE_URL}/games/${game_uuid}/reset`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  pickCard(game_uuid: string) {
    return this.http.get<Card>(`${this.BASE_URL}/games/${game_uuid}/pick`, {
      withCredentials: true,
    });
  }

  upsertDeck(data: Partial<Deck>) {
    return this.http.post<Deck>(`${this.BASE_URL}/decks`, data, {
      withCredentials: true,
    });
  }

  deleteDeck(deck_uuid?: string) {
    return this.http.delete<string>(`${this.BASE_URL}/decks/${deck_uuid}`, {
      withCredentials: true,
    });
  }

  getDecks() {
    return this.http.get<Deck[]>(`${this.BASE_URL}/decks`, {
      withCredentials: true,
    });
  }

  getDeck(deck_uuid: string) {
    return this.http.get<Deck>(`${this.BASE_URL}/decks/${deck_uuid}`, {
      withCredentials: true,
    });
  }
}
