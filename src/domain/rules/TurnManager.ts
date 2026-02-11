import { Pokemon } from '../entities/Pokemon';

export class TurnManager {
  static getTurnOrder(pokemon1: Pokemon, pokemon2: Pokemon): [Pokemon, Pokemon] {
    return pokemon1.stats.speed >= pokemon2.stats.speed ? [pokemon1, pokemon2] : [pokemon2, pokemon1];
  }
}

