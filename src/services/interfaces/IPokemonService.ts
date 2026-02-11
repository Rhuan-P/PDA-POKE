import { Pokemon } from '../../domain/entities/Pokemon';

export interface IPokemonService {
  getPokemon(id: string): Promise<Pokemon>;
  getPokemonByName(name: string): Promise<Pokemon>;
  getSkill(id: string): Promise<{ id: string; type: string; power: number }>;
}

