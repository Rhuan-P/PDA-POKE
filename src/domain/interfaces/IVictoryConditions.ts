import { IPokemon } from './IPokemon';

export interface IVictoryConditions {
  getWinner(pokemon1: IPokemon, pokemon2: IPokemon): IPokemon | null;
}
