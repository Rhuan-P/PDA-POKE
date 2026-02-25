import { Pokemon } from '../../domain/entities/Pokemon';

export interface IPokemonService {
  getPokemonByName(name: string): Promise<Pokemon>;
}

const VALID_PLAYER_IDS = [1, 2];

export class PokemonSelectionUseCase {
  constructor(private pokemonService: IPokemonService) {}

  async selectPokemon(playerId: 1 | 2, pokemonName: string): Promise<Pokemon> {
    if (!VALID_PLAYER_IDS.includes(playerId)) {
      throw new Error(
        `PokemonSelectionUseCase: playerId inválido "${playerId}". Use 1 ou 2.`
      );
    }

    if (!pokemonName || typeof pokemonName !== 'string' || pokemonName.trim().length === 0) {
      throw new Error('PokemonSelectionUseCase: nome do Pokémon inválido.');
    }

    return this.pokemonService.getPokemonByName(pokemonName.toLowerCase().trim());
  }
}