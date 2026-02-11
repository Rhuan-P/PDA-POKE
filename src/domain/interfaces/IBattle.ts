import { IPokemon } from './IPokemon';

export interface IBattle {
  player1: IPokemon;
  player2: IPokemon;
  turns: number;
  log: string[];
}
