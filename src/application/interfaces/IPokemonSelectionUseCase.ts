import { Pokemon } from '../../domain/entities/Pokemon';

export interface IPokemonSelectionUseCase {
  selectPokemon(playerId: 1 | 2, pokemonName: string): Promise<Pokemon>;
}