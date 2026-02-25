import { get } from './api-client.js';
import { handleApiError } from './error-handler.js';
import { createCache } from './utils/cache.js';
import { normalizePokemon, normalizePokemonList } from './utils/data-transformer.js';

const cache = createCache();

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokeApiService {
  async fetchPokemon(nameOrId) {
    const key = `pokemon:${String(nameOrId).toLowerCase()}`;
    const cached = cache.get(key);
    if (cached) return cached;

    try {
      const raw = await get(`${BASE_URL}/pokemon/${nameOrId}`);
      const normalized = normalizePokemon(raw);
      cache.set(key, normalized);
      return normalized;
    } catch (error) {
      handleApiError(error, 'fetchPokemon');
    }
  }

  async searchPokemon(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('searchPokemon: nome inválido.');
    }
    return this.fetchPokemon(name.toLowerCase().trim());
  }

  async getPokemonList(limit = 151, offset = 0) {
    const key = `pokemon-list:${limit}:${offset}`;
    const cached = cache.get(key);
    if (cached) return cached;

    try {
      const raw = await get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      const normalized = normalizePokemonList(raw);
      cache.set(key, normalized);
      return normalized;
    } catch (error) {
      handleApiError(error, 'getPokemonList');
    }
  }

  async getPokemonByName(name) {
    return this.fetchPokemon(name);
  }

  async getPokemon(id) {
    return this.fetchPokemon(id);
  }

  async getSkill(skillId) {
    return { id: skillId, type: 'normal', power: 10 };
  }
}

export const pokeApiService = new PokeApiService();