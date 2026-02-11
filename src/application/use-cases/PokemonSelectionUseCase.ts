import { Pokemon } from '../../domain/entities/Pokemon';

export interface IPokemonService {
  getPokemonByName(name: string): Promise<Pokemon>;
}

export class PokemonSelectionUseCase {
  constructor(private pokemonService: IPokemonService) {}

  async selectPokemon(playerId: 1 | 2, pokemonName: string): Promise<Pokemon> {
    // TODO: validar playerId, aplicar regras de selecao
    return this.pokemonService.getPokemonByName(pokemonName);
  }
}

