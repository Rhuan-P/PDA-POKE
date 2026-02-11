import { PokemonStats } from '../entities/Pokemon';

export interface IPokemon {
  id: string;
  name: string;
  level: number;
  types: string[];
  stats: PokemonStats;
  sprite?: string;
}

