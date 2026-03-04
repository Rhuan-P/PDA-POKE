import { del, get, post } from './api-client.js';
import { handleApiError } from './error-handler.js';
import { createCache } from './utils/cache.js';
import { normalizePokemon, normalizePokemonList } from './utils/data-transformer.js';

const cache = createCache();

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokeApiService {
  // Métodos Pokémon existentes
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
      // Retornar valor padrão em caso de erro
      return {
        count: 0,
        results: []
      };
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

  // Métodos de Batalha (Backend API)
  async createBattle() {
    try {
      const response = await post('http://localhost:3001/api/battle/create');
      return response;
    } catch (error) {
      handleApiError(error, 'createBattle');
    }
  }

  async selectPokemon(battleId, playerId, pokemonName) {
    try {
      const response = await post(`http://localhost:3001/api/battle/${battleId}/select`, {
        playerId,
        pokemonName
      });
      return response;
    } catch (error) {
      handleApiError(error, 'selectPokemon');
    }
  }

  async startBattle(battleId) {
    try {
      const response = await post(`http://localhost:3001/api/battle/${battleId}/start`);
      return response;
    } catch (error) {
      handleApiError(error, 'startBattle');
    }
  }

  async getBattleStatus(battleId) {
    try {
      const response = await get(`http://localhost:3001/api/battle/${battleId}/status`);
      return response;
    } catch (error) {
      handleApiError(error, 'getBattleStatus');
    }
  }

  async executeTurn(battleId, playerId, action) {
    try {
      const response = await post(`http://localhost:3001/api/battle/${battleId}/turn`, {
        playerId,
        action
      });
      return response;
    } catch (error) {
      handleApiError(error, 'executeTurn');
    }
  }

  async deleteBattle(battleId) {
    try {
      const response = await del(`http://localhost:3001/api/battle/${battleId}`);
      return response;
    } catch (error) {
      handleApiError(error, 'deleteBattle');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await get('http://localhost:3001/health');
      return response;
    } catch (error) {
      handleApiError(error, 'healthCheck');
    }
  }
}

export const pokeApiService = new PokeApiService();
