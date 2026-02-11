import { Pokemon } from '../entities/Pokemon';

export class VictoryConditions {
  static getWinner(pokemon1: Pokemon, pokemon2: Pokemon): Pokemon | null {
    if (pokemon1.stats.hp <= 0 && pokemon2.stats.hp <= 0) return null;
    if (pokemon1.stats.hp <= 0) return pokemon2;
    if (pokemon2.stats.hp <= 0) return pokemon1;
    return null;
  }
}

