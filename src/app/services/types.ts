export enum Suit {
  ACORNS = 'acorns',
  BELLS = 'bells',
  CLUBS = 'clubs',
  COINS = 'coins',
  CUPS = 'cups',
  DIAMONDS = 'diamonds',
  EYES = 'eyes',
  HEARTS = 'hearts',
  LEAVES = 'leaves',
  REDSTARS = 'redstars',
  RODS = 'rods',
  ROSES = 'roses',
  SHIELDS = 'shields',
  SPADES = 'spades',
  STARBURST = 'starburst',
  STARS = 'stars',
  SWORDS = 'swords',
}

export type SuitCards = {
  cards: string;
  added: number;
  suit: string;
};

export type Deck = {
  id?: number;
  uuid?: string;
  name: string;
  // cards: { [key: string]: string[] };
  suits: SuitCards[];
};

export interface GameRequest {
  name: string;
  deck: Deck;
}

export type Stats = {
  id: number;
  game?: Game;
  gameId: number | null;
  lastUser?: User;
  lastUserId: number | null;
  playedCards: number;
  totalCards: number;
  updatedAt: string;
};

/**
 * Model Game
 */
export type Game = {
  id: number;
  name: string;
  deck?: Deck;
  open: boolean;
  uuid: string;
  cards?: Card[];
  stats?: Stats;
};

/**
 * Model Card
 */

export type Card = {
  uuid: string;
  id: number;
  name: string;
  type: string;
  set: string;
  position: number;
  gameId: number;
  userId: number | null;
  user?: User;
  played: string | null;
  description: string | null;
};

/**
 * Model User
 */

export type User = {
  id: number;
  email: string;
  googleId: string;
  name: string;
  uuid: string;
  displayName: string;
};

// export interface Deck {
//   suits: {
//     suit: Suit

//   }[]
// }
