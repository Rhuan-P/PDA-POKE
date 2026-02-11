import { IPokemon } from './IPokemon';

export interface ITurnManager {
  getTurnOrder(pokemon1: IPokemon, pokemon2: IPokemon): [IPokemon, IPokemon];
}
